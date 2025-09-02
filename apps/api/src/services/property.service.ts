import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { Property, propertySchema } from "@repo/schemas";

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

  async getProperties(
    params?:
      | (Partial<Property> & { skip?: number; take?: number })
      | (Partial<Property> & {
          skip?: number;
          take?: number;
          destination?: string;
          checkIn?: string;
          checkOut?: string;
          guest?: number;
          pets?: number;
          name?: string;
          categoryId?: string;
          categoryName?: string;
          sortBy?: "name" | "price";
          sortOrder?: "asc" | "desc";
        })
  ) {
    const { skip = 0, take = 10 } = (params as any) || {};

    const destination = (params as any)?.destination as string | undefined;
    const checkIn = (params as any)?.checkIn as string | undefined;
    const checkOut = (params as any)?.checkOut as string | undefined;
    const guestRaw = (params as any)?.guest as number | undefined;
    const petsRaw = (params as any)?.pets as number | undefined;
    const nameFilter = (params as any)?.name as string | undefined;
    const categoryId = (params as any)?.categoryId as string | undefined;
    const categoryName = (params as any)?.categoryName as string | undefined;
    const sortBy = (params as any)?.sortBy as "name" | "price" | undefined;
    const sortOrder = (params as any)?.sortOrder as "asc" | "desc" | undefined;

    const guest =
      typeof guestRaw === "number" && !Number.isNaN(guestRaw)
        ? guestRaw
        : undefined;
    const pets =
      typeof petsRaw === "number" && !Number.isNaN(petsRaw)
        ? petsRaw
        : undefined;

    const where: any = {};

    if (destination) {
      where.OR = [
        { city: { contains: destination, mode: "insensitive" } },
        { country: { contains: destination, mode: "insensitive" } },
        { province: { contains: destination, mode: "insensitive" } },
        { address: { contains: destination, mode: "insensitive" } },
      ];
    }

    // property name filter
    if (nameFilter) {
      where.name = { contains: nameFilter, mode: "insensitive" };
    }

    // category filter by id or name
    if (categoryId) {
      where.categoryId = categoryId;
    } else if (categoryName) {
      where.PropertyCategory = {
        is: { name: { contains: categoryName, mode: "insensitive" } },
      };
    }

    if (typeof guest === "number") {
      where.maxGuests = { gte: guest };
    }

    if (typeof pets === "number" && pets > 0) {
      where.Facilities = { some: { facility: "PET_FRIENDLY" } };
    }

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
    if (sortBy === "name") orderBy = { name: sortOrder || "asc" };
    if (sortBy === "price") {
      orderBy = { Rooms: { _min: { basePrice: sortOrder || "asc" } } };
    }

    const properties = await prisma.property.findMany({
      where,
      skip,
      take,
      orderBy,
      include: { PropertyCategory: true },
    });
    return properties;
  }
}
