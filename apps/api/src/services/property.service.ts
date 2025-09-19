import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import {
  GetPropertiesParams,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@repo/schemas";
import { nanoid } from "nanoid";
import { resolveCategoryId } from "./category.service.js";
import { mapFacilities, mapPictures, mapRooms } from "../utils/mappers.js";
import slugify from "@sindresorhus/slugify";

export class PropertyService {
  async createProperty(data: CreatePropertyInput) {
    const slug = `${slugify(data.name)}-${nanoid(6)}`;

    const property = await prisma.$transaction(async (tx) => {
      const propertyCategoryId = await resolveCategoryId(tx, data);

      const created = await tx.property.create({
        data: {
          tenantId: data.tenantId,
          propertyCategoryId,
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

    // Get total count for pagination
    const total = await prisma.property.count({ where });

    const properties = await prisma.property.findMany({
      where,
      skip,
      take,
      orderBy,
      include: { PropertyCategory: true, Rooms: true, Pictures: true },
    });

    return { properties, total };
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

  async getPropertyById(propertyId: string, tenantId?: string) {
    if (!propertyId) throw new AppError("Missing property ID", 400);

    const where: any = { id: propertyId };
    if (tenantId) {
      where.tenantId = tenantId;
    }

    const property = await prisma.property.findUnique({
      where,
      include: {
        PropertyCategory: true,
        CustomCategory: true,
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

    if (!property) {
      throw new AppError(
        tenantId
          ? "Property not found or you don't have permission to access it"
          : "Property not found",
        404
      );
    }

    return property;
  }

  async getPropertiesByTenant(tenantId: string) {
    const properties = await prisma.property.findMany({
      where: { tenantId },
      include: {
        PropertyCategory: true,
        CustomCategory: true,
        Pictures: true,
        Rooms: {
          include: {
            RoomAvailabilities: true,
            PriceAdjustments: true,
          },
        },
        Facilities: true,
        _count: {
          select: {
            Bookings: true,
            Reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return properties;
  }

  async deleteProperty(propertyId: string, tenantId: string) {
    // First check if the property belongs to the tenant
    const property = await prisma.property.findFirst({
      where: { id: propertyId, tenantId },
    });

    if (!property) {
      throw new AppError(
        "Property not found or you don't have permission to delete it",
        404
      );
    }

    // Check if there are any active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        propertyId,
        checkOutDate: { gte: new Date() },
        status: {
          in: ["WAITING_PAYMENT", "WAITING_CONFIRMATION", "PROCESSING"],
        },
      },
    });

    if (activeBookings > 0) {
      throw new AppError("Cannot delete property with active bookings", 400);
    }

    // Delete the property (cascading will handle related data)
    await prisma.property.delete({
      where: { id: propertyId },
    });

    return { message: "Property deleted successfully" };
  }

  async updateProperty(
    propertyId: string,
    tenantId: string,
    data: UpdatePropertyInput
  ) {
    // First check if the property belongs to the tenant
    const existingProperty = await prisma.property.findFirst({
      where: { id: propertyId, tenantId },
    });

    if (!existingProperty) {
      throw new AppError(
        "Property not found or you don't have permission to update it",
        404
      );
    }

    const property = await prisma.$transaction(async (tx) => {
      const updateData: any = {};

      // Only update fields that are provided
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.country !== undefined) updateData.country = data.country;
      if (data.city !== undefined) updateData.city = data.city;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.latitude !== undefined) updateData.latitude = data.latitude;
      if (data.longitude !== undefined) updateData.longitude = data.longitude;
      if (data.maxGuests !== undefined) updateData.maxGuests = data.maxGuests;

      // Handle category updates
      if (
        "propertyCategoryId" in data ||
        "customCategoryId" in data ||
        "customCategory" in data
      ) {
        const propertyCategoryId = await resolveCategoryId(tx, data as any);
        updateData.propertyCategoryId = propertyCategoryId;
        if ("customCategoryId" in data && data.customCategoryId) {
          updateData.customCategoryId = data.customCategoryId;
        }
      }

      // Update basic property data
      const updated = await tx.property.update({
        where: { id: propertyId },
        data: updateData,
        include: {
          PropertyCategory: true,
          CustomCategory: true,
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

      // Handle facilities update
      if ("facilities" in data && data.facilities !== undefined) {
        await tx.propertyFacility.deleteMany({
          where: { propertyId },
        });

        if (data.facilities.length > 0) {
          await tx.propertyFacility.createMany({
            data: data.facilities.map((facility: any) => ({
              propertyId,
              facility: facility.facility,
              note: facility.note,
            })),
          });
        }
      }

      // Handle pictures update
      if ("pictures" in data && data.pictures !== undefined) {
        await tx.propertyPicture.deleteMany({
          where: { propertyId },
        });

        if (data.pictures.length > 0) {
          await tx.propertyPicture.createMany({
            data: data.pictures.map((picture: any) => ({
              propertyId,
              imageUrl: picture.imageUrl,
              note: picture.note,
            })),
          });
        }
      }

      return updated;
    });

    return property;
  }
}
