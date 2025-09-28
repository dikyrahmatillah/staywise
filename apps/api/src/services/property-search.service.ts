import type { GetPropertiesParams } from "@repo/schemas";
import { prisma } from "@repo/database";
import { PropertyRepository } from "../repositories/property.repository.js";
import { PriceCalculationService } from "./price-calculation.service.js";

export class PropertySearchService {
  private repository = new PropertyRepository();
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

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (
        !Number.isNaN(checkInDate.getTime()) &&
        !Number.isNaN(checkOutDate.getTime())
      ) {
        where.Bookings = {
          none: {
            AND: [
              { checkInDate: { lt: checkOutDate } },
              { checkOutDate: { gt: checkInDate } },
            ],
          },
        };
        // Ensure rooms don't have explicit unavailable dates in the range
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
      const checkInDate = checkIn ? new Date(checkIn) : new Date();
      const checkOutDate = checkOut
        ? new Date(checkOut)
        : new Date(Date.now() + 24 * 60 * 60 * 1000);

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
        (property) => {
          return property.Rooms.some((room: any) =>
            PriceCalculationService.isRoomAvailable(
              room,
              checkInDate,
              checkOutDate,
              guest || 1
            )
          );
        }
      );

      if (propertiesWithAvailableRooms.length === 0)
        return { properties: [], total: 0 };

      const propertiesWithMinPrice = propertiesWithAvailableRooms
        .map((property) => {
          const availableRooms = property.Rooms.filter((room: any) =>
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
        .filter((p) => p.priceFrom !== Number.POSITIVE_INFINITY);

      propertiesWithMinPrice.sort((a, b) => {
        if (a.priceFrom === b.priceFrom) return 0;
        return (params.sortOrder || "asc") === "asc"
          ? a.priceFrom - b.priceFrom
          : b.priceFrom - a.priceFrom;
      });

      const pagedIds = propertiesWithMinPrice
        .slice(skip, skip + take)
        .map((p) => p.id);
      const total = propertiesWithMinPrice.length;

      const properties = await this.repository.findManyByIds(pagedIds);
      const itemsById = new Map(properties.map((item) => [item.id, item]));
      const orderedProperties = pagedIds
        .map((id) => itemsById.get(id))
        .filter(Boolean) as typeof properties;

      return { properties: orderedProperties, total };
    }

    const orderBy: any =
      params.sortBy === "name"
        ? { name: params.sortOrder || "asc" }
        : { createdAt: "desc" };
    const defaultCheckIn = new Date();
    const defaultCheckOut = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [properties, total] = await Promise.all([
      this.repository.findManyWithMinPrices(
        where,
        skip,
        take,
        orderBy,
        checkIn ? new Date(checkIn) : defaultCheckIn,
        checkOut ? new Date(checkOut) : defaultCheckOut
      ),
      this.repository.count(where),
    ]);

    return { properties, total };
  }
}
