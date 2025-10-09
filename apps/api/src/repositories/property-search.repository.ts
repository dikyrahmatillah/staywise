import type { Prisma } from "@prisma/client";
import { prisma } from "../configs/prisma.config.js";

export class PropertySearchRepository {
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
      include: {
        PropertyCategory: true,
        Pictures: true,
        Rooms: {
          include: {
            RoomAvailabilities: true,
            PriceAdjustments: { include: { Dates: true } },
          },
        },
        _count: { select: { Reviews: true } },
      },
    });
  }

  async findManyByIds(propertyIds: string[]): Promise<any[]> {
    const properties = await prisma.property.findMany({
      where: { id: { in: propertyIds } },
      include: {
        PropertyCategory: true,
        Pictures: true,
        Rooms: {
          include: {
            RoomAvailabilities: true,
            PriceAdjustments: { include: { Dates: true } },
          },
        },
        _count: { select: { Reviews: true } },
      },
    });

    const propertyIds2 = properties.map((p) => p.id);

    const reviewStats = await prisma.review.groupBy({
      by: ["propertyId"],
      where: { propertyId: { in: propertyIds2 } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const statsMap = new Map(
      reviewStats.map((stat: any) => [
        stat.propertyId,
        {
          averageRating: stat._avg.rating ?? 0,
          reviewCount: stat._count.rating,
        },
      ])
    );

    return properties.map((property) => {
      const stats = statsMap.get(property.id) || {
        averageRating: 0,
        reviewCount: 0,
      };
      return {
        ...property,
        averageRating: stats.averageRating,
        reviewCount: stats.reviewCount,
      };
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
      include: {
        PropertyCategory: true,
        Pictures: true,
        Rooms: {
          include: {
            RoomAvailabilities: true,
            PriceAdjustments: { include: { Dates: true } },
          },
        },
        _count: { select: { Reviews: true } },
      },
    });

    if (!checkIn || !checkOut) {
      return this.addReviewStatsToProperties(
        properties.slice(skip, skip + take)
      );
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

    const sliced = withPrices.slice(skip, skip + take);

    return this.addReviewStatsToProperties(sliced);
  }

  async count(where: Prisma.PropertyWhereInput): Promise<number> {
    return prisma.property.count({ where });
  }

  private async addReviewStatsToProperties(properties: any[]): Promise<any[]> {
    const propertyIds = properties.map((p) => p.id);

    const reviewStats = await prisma.review.groupBy({
      by: ["propertyId"],
      where: { propertyId: { in: propertyIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const statsMap = new Map(
      reviewStats.map((stat: any) => [
        stat.propertyId,
        {
          averageRating: stat._avg.rating ?? 0,
          reviewCount: stat._count.rating,
        },
      ])
    );

    return properties.map((property) => {
      const stats = statsMap.get(property.id) || {
        averageRating: 0,
        reviewCount: 0,
      };
      return {
        ...property,
        averageRating: stats.averageRating,
        reviewCount: stats.reviewCount,
      };
    });
  }
}
