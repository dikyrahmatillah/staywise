import type { GetPropertiesParams } from "@repo/schemas";
import { PropertyRepository } from "../repositories/property.repository.js";
import { PropertyQueryBuilder } from "../utils/property-query-builder.js";

export class PropertySearchService {
  private repository: PropertyRepository;

  constructor() {
    this.repository = new PropertyRepository();
  }

  async searchProperties(params: GetPropertiesParams = {}) {
    const queryBuilder = new PropertyQueryBuilder(params);
    const { skip, take } = queryBuilder.getPaginationParams();

    if (params.sortBy === "price") {
      return this.searchPropertiesByPrice(queryBuilder, skip, take);
    }

    return this.searchPropertiesStandard(queryBuilder, skip, take);
  }

  private async searchPropertiesByPrice(
    queryBuilder: PropertyQueryBuilder,
    skip: number,
    take: number
  ) {
    const { propertyIds, total } =
      await queryBuilder.buildPriceSortedProperties();

    if (propertyIds.length === 0) {
      return { properties: [], total };
    }

    const properties = await this.repository.findManyByIds(propertyIds);

    const orderedProperties = PropertyQueryBuilder.preserveOrder(
      properties,
      propertyIds
    );

    return { properties: orderedProperties, total };
  }

  private async searchPropertiesStandard(
    queryBuilder: PropertyQueryBuilder,
    skip: number,
    take: number
  ) {
    const where = queryBuilder.buildWhereClause();
    const orderBy = queryBuilder.buildOrderBy();

    const [properties, total] = await Promise.all([
      this.repository.findMany(where, skip, take, orderBy),
      this.repository.count(where),
    ]);

    return { properties, total };
  }
}
