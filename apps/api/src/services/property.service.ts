import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { Property, propertySchema, GetPropertiesParams } from "@repo/schemas";

export class PropertyService {
  async createProperty(data: Property) {
    const validation = propertySchema.safeParse(data);
    if (!validation.success) {
      throw new AppError("Invalid property data", 400);
    }

    const property = await prisma.property.create({
      data: validation.data,
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

    // compute totals/averages separately so we can expose summaries while returning a single review
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
