import type { GetPropertiesParams } from "@repo/schemas";
import { prisma } from "@repo/database";
import { PropertyRepository } from "../repositories/property.repository.js";
import { PriceCalculationService } from "./price-calculation.service.js";
import { isValid, isSameDay, addDays, startOfDay } from "date-fns";

export class PropertySearchService {
  private repository = new PropertyRepository();

  private normalizeDates(checkIn?: string, checkOut?: string) {
    const defaultCheckIn = startOfDay(new Date());
    const defaultCheckOut = addDays(defaultCheckIn, 1);

    const checkInDate = checkIn
      ? startOfDay(new Date(checkIn))
      : defaultCheckIn;
    let checkOutDate = checkOut
      ? startOfDay(new Date(checkOut))
      : checkIn
      ? checkInDate
      : defaultCheckOut;

    if (isSameDay(checkInDate, checkOutDate)) {
      checkOutDate = addDays(checkOutDate, 1);
    }

    return { checkInDate, checkOutDate };
  }

  async searchProperties(params: GetPropertiesParams = {}) {
    const skip = params.skip ?? 0;
    const take = params.take ?? 10;

    const {
      destination,
      name: nameFilter,
      category,
      guest,
      pets,
      checkIn,
      checkOut,
    } = params;

    const where: any = {};

    if (destination) {
      const fields = ["city", "country", "address"] as const;
      where.OR = fields.map((field) => ({
        [field]: { contains: destination, mode: "insensitive" },
      }));
    }

    if (nameFilter) where.name = { contains: nameFilter, mode: "insensitive" };

    if (category)
      where.PropertyCategory = {
        is: { name: { contains: category, mode: "insensitive" } },
      };

    if (typeof guest === "number") where.maxGuests = { gte: guest };
    if (typeof pets === "number" && pets > 0)
      where.Facilities = { some: { facility: "PET_FRIENDLY" } };

    if (checkIn) {
      const { checkInDate, checkOutDate } = this.normalizeDates(
        checkIn,
        checkOut
      );
      if (isValid(checkInDate) && isValid(checkOutDate)) {
        where.Bookings = {
          none: {
            AND: [
              { checkInDate: { lt: checkOutDate } },
              { checkOutDate: { gt: checkInDate } },
            ],
          },
        };

        where.Rooms = {
          some: {
            RoomAvailabilities: {
              none: {
                AND: [
                  { date: { gte: checkInDate, lt: checkOutDate } },
                  { isAvailable: false },
                ],
              },
            },
          },
        };
      }
    }

    if (params.sortBy === "price") {
      const { checkInDate, checkOutDate } = this.normalizeDates(
        checkIn,
        checkOut
      );

      const matchingProperties = await prisma.property.findMany({
        where,
        select: {
          id: true,
          Rooms: {
            include: {
              PriceAdjustments: { include: { Dates: true } },
              RoomAvailabilities: true,
            },
          },
        },
      });

      const propertiesWithAvailableRooms = matchingProperties.filter(
        (property: any) =>
          (property.Rooms || []).some((room: any) =>
            PriceCalculationService.isRoomAvailable(
              room,
              checkInDate,
              checkOutDate,
              guest || 1
            )
          )
      );

      if (propertiesWithAvailableRooms.length === 0)
        return { properties: [], total: 0 };

      const propertiesWithMinPrice = propertiesWithAvailableRooms
        .map((property: any) => {
          const availableRooms = (property.Rooms || []).filter((room: any) =>
            PriceCalculationService.isRoomAvailable(
              room,
              checkInDate,
              checkOutDate,
              guest || 1
            )
          );

          const priceFrom = PriceCalculationService.calculatePropertyMinPrice(
            availableRooms,
            checkInDate,
            checkOutDate
          );

          return {
            id: property.id,
            priceFrom: priceFrom === 0 ? Number.POSITIVE_INFINITY : priceFrom,
          };
        })
        .filter((p: any) => p.priceFrom !== Number.POSITIVE_INFINITY);

      propertiesWithMinPrice.sort((a: any, b: any) => {
        if (a.priceFrom === b.priceFrom) return 0;
        return (params.sortOrder || "asc") === "asc"
          ? a.priceFrom - b.priceFrom
          : b.priceFrom - a.priceFrom;
      });

      const pagedIds = propertiesWithMinPrice
        .slice(skip, skip + take)
        .map((p: any) => p.id);
      const total = propertiesWithMinPrice.length;

      const properties = await this.repository.findManyByIds(pagedIds);
      const itemsById = new Map(properties.map((item: any) => [item.id, item]));
      const orderedProperties = pagedIds
        .map((id) => itemsById.get(id))
        .filter(Boolean) as typeof properties;

      return { properties: orderedProperties, total };
    }

    const orderBy: any =
      params.sortBy === "name"
        ? { name: params.sortOrder || "asc" }
        : { createdAt: "desc" };
    const { checkInDate, checkOutDate } = this.normalizeDates(
      checkIn,
      checkOut
    );

    const [properties, total] = await Promise.all([
      this.repository.findManyWithMinPrices(
        where,
        skip,
        take,
        orderBy,
        checkInDate,
        checkOutDate,
        guest
      ),
      this.repository.count(where),
    ]);

    return { properties, total };
  }
}
