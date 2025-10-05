import { NextFunction, Request, Response } from "express";
import { getPropertiesQuerySchema } from "@repo/schemas";
import { PropertyCrudService } from "@/services/property-crud.service.js";
import { PropertySearchService } from "@/services/property-search.service.js";

export class PropertyQueryController {
  propertyCrud = new PropertyCrudService();
  propertySearch = new PropertySearchService();

  querySchema = getPropertiesQuerySchema;

  getProperties = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = this.querySchema.parse(request.query);

      const page = parsed.page ?? 1;
      const limit = parsed.limit ?? 10;
      const adults = parsed.adults ?? 0;
      const children = parsed.children ?? 0;

      const params = this.buildSearchParams(
        parsed,
        page,
        limit,
        adults,
        children
      );
      const result = await this.propertySearch.searchProperties(params);

      response.status(200).json({
        message: "Properties fetched successfully",
        data: result.properties,
        page,
        limit,
        total: result.total,
        totalPage: Math.ceil(result.total / limit),
      });
    } catch (error) {
      next(error);
    }
  };

  getProperty = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const slug = request.params.slug;
      const property = await this.propertyCrud.getPropertyBySlug(slug);
      response
        .status(200)
        .json({ message: "Property fetched successfully", data: property });
    } catch (error) {
      next(error);
    }
  };

  getPropertiesByTenant = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const tenantId = request.params.tenantId;

      if ((request as any).user?.id !== tenantId) {
        return response.status(403).json({
          message: "Access denied: You can only view your own properties",
        });
      }

      const properties = await this.propertyCrud.getPropertiesByTenant(
        tenantId
      );
      response.status(200).json({
        message: "Tenant properties fetched successfully",
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  };

  getPropertyById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const propertyId = request.params.id;
      const tenantId = request.user?.id;

      const property = await this.propertyCrud.getPropertyById(
        propertyId,
        tenantId
      );
      response.status(200).json({
        message: "Property fetched successfully",
        data: property,
      });
    } catch (error) {
      next(error);
    }
  };

  buildSearchParams(
    parsed: any,
    page: number,
    limit: number,
    adults: number,
    children: number
  ) {
    return {
      skip: (page - 1) * limit,
      take: limit,
      destination: parsed.location,
      checkIn: parsed.checkIn,
      checkOut: parsed.checkOut,
      guest: adults + children,
      pets: parsed.pets,
      name: parsed.name,
      category: parsed.category,
      sortBy: parsed.sortBy,
      sortOrder: parsed.sortOrder,
    };
  }
}

export const propertyQueryController = new PropertyQueryController();
