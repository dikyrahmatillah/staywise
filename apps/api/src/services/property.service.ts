import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { GetPropertiesParams, CreatePropertyInput } from "@repo/schemas";
import { nanoid } from "nanoid";
import { resolveCategoryId } from "./category.service.js";
import { mapFacilities, mapPictures, mapRooms } from "../utils/mappers.js";
import slugify from "@sindresorhus/slugify";

export class PropertyService {
  async createProperty(data: CreatePropertyInput) {
    const slug = `${slugify(data.name)}-${nanoid(6)}`;

    const property = await prisma.$transaction(async (tx) => {
      const categoryId = await resolveCategoryId(tx, data);

      const created = await tx.property.create({
        data: {
          tenantId: data.tenantId,
          categoryId,
          name: data.name,
          slug,
          description: data.description,
          country: data.country,
          city: data.city,
          address: data.address,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          maxGuests: data.maxGuests,
          Facilities: mapFacilities(data.facilities),
          Pictures: mapPictures(data.pictures),
          Rooms: mapRooms(data.rooms),
        },
        include: {
          PropertyCategory: true,
          Pictures: true,
          Rooms: {
            include: {
              RoomAvailabilities: true,
              PriceAdjustments: { include: { Dates: true } },
            },
          },
          Facilities: true,
        },
      });

      return created;
    });

    return property;
  }

  async getProperties(params: GetPropertiesParams = {}) {
    const {
      skip = 0,
      take = 10,
      destination,
      checkIn,
      checkOut,
      guest,
      pets,
      name: nameFilter,
      categoryName,
      sortBy,
      sortOrder,
    } = params;

    const where: any = {};
    if (destination) {
      const fields = ["city", "country", "address"];
      where.OR = fields.map((f) => ({
        [f]: { contains: destination, mode: "insensitive" },
      }));
    }

    if (nameFilter) where.name = { contains: nameFilter, mode: "insensitive" };

    if (categoryName)
      where.PropertyCategory = {
        is: { name: { contains: categoryName, mode: "insensitive" } },
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
      }
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "name") {
      orderBy = { name: sortOrder || "asc" };
    } else if (sortBy === "price") {
      orderBy = { Rooms: { _min: { basePrice: sortOrder || "asc" } } };
    }

    return prisma.property.findMany({
      where,
      skip,
      take,
      orderBy,
      include: { PropertyCategory: true, Rooms: true, Pictures: true },
    });
  }

  async getPropertyBySlug(slug: string) {
    if (!slug) throw new AppError("Missing property slug", 400);

    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        PropertyCategory: true,
        Pictures: true,
        Rooms: true,
        Facilities: true,
        Reviews: {
          include: { User: true },
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    if (!property) throw new AppError("Property not found", 404);

    const reviewCount = await prisma.review.count({
      where: { propertyId: property.id },
    });
    const avg = await prisma.review.aggregate({
      where: { propertyId: property.id },
      _avg: { rating: true },
    });

    return {
      ...property,
      reviewCount,
      averageRating: avg._avg.rating ?? 0,
    };
  }
}
