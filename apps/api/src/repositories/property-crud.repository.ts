import type { Prisma } from "@prisma/client";
import { prisma } from "../configs/prisma.config.js";

/**
 * Repository for basic CRUD operations on properties
 */
export class PropertyCrudRepository {
  /**
   * Create a new property with all related entities
   */
  async create(data: any): Promise<any> {
    return prisma.property.create({
      data,
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
  }

  /**
   * Find a property by its unique slug
   */
  async findUniqueBySlug(slug: string): Promise<any | null> {
    return prisma.property.findUnique({
      where: { slug },
      include: {
        PropertyCategory: true,
        Pictures: true,
        Rooms: true,
        Facilities: true,
        Reviews: {
          include: { User: true },
          orderBy: { createdAt: "desc" as const },
          take: 3,
        },
      },
    });
  }

  /**
   * Find a property by its unique ID, optionally filtered by tenant
   */
  async findUniqueById(
    propertyId: string,
    tenantId?: string
  ): Promise<any | null> {
    const where: Prisma.PropertyWhereUniqueInput & { tenantId?: string } = {
      id: propertyId,
    };
    if (tenantId) {
      where.tenantId = tenantId;
    }

    return prisma.property.findUnique({
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
  }

  /**
   * Find all properties belonging to a specific tenant
   */
  async findManyByTenant(tenantId: string): Promise<any[]> {
    return prisma.property.findMany({
      where: { tenantId },
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
        _count: {
          select: {
            Bookings: true,
            Reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Find the first property matching both ID and tenant ID
   */
  async findFirstByIdAndTenant(
    propertyId: string,
    tenantId: string
  ): Promise<any | null> {
    return prisma.property.findFirst({
      where: { id: propertyId, tenantId },
    });
  }

  /**
   * Update a property by its ID
   */
  async update(
    propertyId: string,
    data: Prisma.PropertyUpdateInput
  ): Promise<any> {
    return prisma.property.update({
      where: { id: propertyId },
      data,
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
  }

  /**
   * Delete a property by its ID
   */
  async delete(propertyId: string): Promise<any> {
    return prisma.property.delete({
      where: { id: propertyId },
    });
  }

  /**
   * Count active bookings for a property
   */
  async getActiveBookingCount(propertyId: string): Promise<number> {
    return prisma.booking.count({
      where: {
        propertyId,
        checkOutDate: { gte: new Date() },
        status: {
          in: ["WAITING_PAYMENT", "WAITING_CONFIRMATION", "PROCESSING"],
        },
      },
    });
  }
}
