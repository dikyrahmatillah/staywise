import type { Prisma } from "@prisma/client";
import { prisma } from "../configs/prisma.config.js";

export class PropertyCrudRepository {
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
            Bookings: {
              where: {
                status: {
                  in: ["WAITING_PAYMENT", "WAITING_CONFIRMATION", "PROCESSING"],
                },
              },
            },
            Reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findFirstByIdAndTenant(
    propertyId: string,
    tenantId: string
  ): Promise<any | null> {
    return prisma.property.findFirst({
      where: { id: propertyId, tenantId },
    });
  }

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

  async delete(propertyId: string): Promise<any> {
    return prisma.property.delete({
      where: { id: propertyId },
    });
  }

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
