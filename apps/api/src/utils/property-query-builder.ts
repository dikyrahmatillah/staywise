import type { GetPropertiesParams } from "@repo/schemas";
import type { Prisma } from "@repo/database/generated/prisma/index.js";
import { prisma } from "@repo/database";

export class PropertyQueryBuilder {
  private params: GetPropertiesParams;

  constructor(params: GetPropertiesParams = {}) {
    this.params = params;
  }

  buildWhereClause(): Prisma.PropertyWhereInput {
    const {
      destination,
      name: nameFilter,
      category,
      guest,
      pets,
      checkIn,
      checkOut,
    } = this.params;
    const where: Prisma.PropertyWhereInput = {};

    if (destination) {
      const fields = ["city", "country", "address"];
      where.OR = fields.map((field) => ({
        [field]: { contains: destination, mode: "insensitive" },
      }));
    }

    if (nameFilter) {
      where.name = { contains: nameFilter, mode: "insensitive" };
    }

    if (category) {
      where.PropertyCategory = {
        is: { name: { contains: category, mode: "insensitive" } },
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

    return where;
  }

  buildOrderBy(): Prisma.PropertyOrderByWithRelationInput {
    const { sortBy, sortOrder } = this.params;

    if (sortBy === "name") {
      return { name: sortOrder || "asc" };
    }

    return { createdAt: "desc" };
  }

  getPaginationParams() {
    const { skip = 0, take = 10 } = this.params;
    return { skip, take };
  }

  async buildPriceSortedProperties() {
    const { sortOrder, skip = 0, take = 10 } = this.params;
    const where = this.buildWhereClause();

    const matchingProperties = await prisma.property.findMany({
      where,
      select: { id: true },
    });

    const propertyIds = matchingProperties.map((p) => p.id);

    if (propertyIds.length === 0) {
      return { propertyIds: [], total: 0 };
    }

    const grouped = await prisma.room.groupBy({
      by: ["propertyId"],
      where: { propertyId: { in: propertyIds } },
      _min: { basePrice: true },
    });

    const minPriceMap = new Map<string, number>();
    for (const group of grouped) {
      const price = group._min?.basePrice;
      minPriceMap.set(
        group.propertyId,
        price === null || price === undefined
          ? Number.POSITIVE_INFINITY
          : Number(price)
      );
    }

    const propertiesWithMinPrice = propertyIds.map((id) => ({
      id,
      minPrice: minPriceMap.get(id) ?? Number.POSITIVE_INFINITY,
    }));

    propertiesWithMinPrice.sort((a, b) => {
      if (a.minPrice === b.minPrice) return 0;
      if ((sortOrder || "asc") === "asc") return a.minPrice - b.minPrice;
      return b.minPrice - a.minPrice;
    });

    const pagedIds = propertiesWithMinPrice
      .slice(skip, skip + take)
      .map((p) => p.id);

    return {
      propertyIds: pagedIds,
      total: matchingProperties.length,
    };
  }

  static preserveOrder<T extends { id: string }>(
    items: T[],
    orderedIds: string[]
  ): T[] {
    const itemsById = new Map(items.map((item) => [item.id, item]));
    return orderedIds.map((id) => itemsById.get(id)).filter(Boolean) as T[];
  }
}
