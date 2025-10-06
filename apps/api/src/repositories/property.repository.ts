import type { Prisma } from "../generated/prisma/index.js";
import { prisma } from "../configs/prisma.config.js";

export class PropertyRepository {
  private readonly includeBasic = {
    PropertyCategory: true,
    Pictures: true,
    Rooms: {
      include: {
        RoomAvailabilities: true,
        PriceAdjustments: { include: { Dates: true } },
      },
    },
  };

  private readonly includeDetailed = {
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
  };

  private readonly includeWithReviews = {
    PropertyCategory: true,
    Pictures: true,
    Rooms: true,
    Facilities: true,
    Reviews: {
      include: { User: true },
      orderBy: { createdAt: "desc" as const },
      take: 3,
    },
  };

  async create(data: any): Promise<any> {
    return prisma.property.create({
      data,
      include: this.includeDetailed,
    });
  }

  async findMany(
    where: Prisma.PropertyWhereInput,
    skip: number,
    take: number,
    orderBy: Prisma.PropertyOrderByWithRelationInput
  ): Promise<any[]> {
    return prisma.property.findMany({
      where,
      skip,
      take,
      orderBy,
      include: this.includeBasic,
    });
  }

  async findManyByIds(propertyIds: string[]): Promise<any[]> {
    return prisma.property.findMany({
      where: { id: { in: propertyIds } },
      include: this.includeBasic,
    });
  }

  async findManyWithMinPrices(
    where: any,
    skip: number,
    take: number,
    orderBy: any,
    checkIn?: Date,
    checkOut?: Date,
    guest?: number
  ) {
    const properties = await prisma.property.findMany({
      where,
      orderBy,
      include: this.includeBasic,
    });

    if (!checkIn || !checkOut) {
      return properties.slice(skip, skip + take);
    }

    const { PriceCalculationService } = await import(
      "../services/price-calculation.service.js"
    );

    const withPrices = properties
      .map((property) => {
        const availableRooms = (property.Rooms || []).filter((room: any) =>
          PriceCalculationService.isRoomAvailable(
            room,
            checkIn as Date,
            checkOut as Date,
            guest || 1
          )
        );

        const minPrice = availableRooms.length
          ? PriceCalculationService.calculatePropertyMinPrice(
              availableRooms,
              checkIn,
              checkOut
            )
          : undefined;
        return {
          ...property,
          priceFrom: minPrice,
        };
      })
      .filter((p) => typeof p.priceFrom !== "undefined");

    return withPrices.slice(skip, skip + take);
  }

  async count(where: Prisma.PropertyWhereInput): Promise<number> {
    return prisma.property.count({ where });
  }

  async findUniqueBySlug(slug: string): Promise<any | null> {
    return prisma.property.findUnique({
      where: { slug },
      include: this.includeWithReviews,
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
      include: this.includeDetailed,
    });
  }

  async findManyByTenant(tenantId: string): Promise<any[]> {
    return prisma.property.findMany({
      where: { tenantId },
      include: {
        ...this.includeDetailed,
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

  async findFirstByIdAndTenant(
    propertyId: string,
    tenantId: string
  ): Promise<any | null> {
    return prisma.property.findFirst({
      where: { id: propertyId, tenantId },
    });
  }

  async delete(propertyId: string): Promise<any> {
    return prisma.property.delete({
      where: { id: propertyId },
    });
  }

  async update(
    propertyId: string,
    data: Prisma.PropertyUpdateInput
  ): Promise<any> {
    return prisma.property.update({
      where: { id: propertyId },
      data,
      include: this.includeDetailed,
    });
  }

  async getReviewStats(
    propertyId: string
  ): Promise<{ count: number; averageRating: number }> {
    const [reviewCount, avg] = await Promise.all([
      prisma.review.count({ where: { propertyId } }),
      prisma.review.aggregate({
        where: { propertyId },
        _avg: { rating: true },
      }),
    ]);

    return {
      count: reviewCount,
      averageRating: avg._avg.rating ?? 0,
    };
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

  async deleteFacilities(propertyId: string): Promise<void> {
    await prisma.propertyFacility.deleteMany({
      where: { propertyId },
    });
  }

  async createFacilities(propertyId: string, facilities: any[]): Promise<void> {
    await prisma.propertyFacility.createMany({
      data: facilities.map((facility) => ({
        propertyId,
        facility: facility.facility,
      })),
    });
  }

  async deletePictures(propertyId: string): Promise<void> {
    await prisma.propertyPicture.deleteMany({
      where: { propertyId },
    });
  }

  async createPictures(propertyId: string, pictures: any[]): Promise<void> {
    await prisma.propertyPicture.createMany({
      data: pictures.map((picture) => ({
        propertyId,
        imageUrl: picture.imageUrl,
        note: picture.note,
      })),
    });
  }
}
