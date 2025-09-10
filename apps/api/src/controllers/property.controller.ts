import { NextFunction, Request, Response } from "express";
import {
  getPropertiesQuerySchema,
  createPropertyInputSchema,
} from "@repo/schemas";
import { PropertyService } from "@/services/property.service.js";

export class PropertyController {
  private propertyService = new PropertyService();

  private static querySchema = getPropertiesQuerySchema;

  createProperty = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = createPropertyInputSchema.parse(request.body);
      const property = await this.propertyService.createProperty(data);
      response.status(201).json({
        message: "Property created successfully",
        data: property,
      });
    } catch (error) {
      next(error);
    }
  };

  getProperties = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = PropertyController.querySchema.parse(request.query);

      const page = parsed.page ?? 1;
      const limit = parsed.limit ?? 10;
      const adults = parsed.adults ?? 0;
      const children = parsed.children ?? 0;

      const params = {
        skip: (page - 1) * limit,
        take: limit,
        destination: parsed.location,
        checkIn: parsed.checkIn,
        checkOut: parsed.checkOut,
        guest: adults + children,
        pets: parsed.pets,
        name: parsed.name,
        categoryName: parsed.categoryName,
        sortBy: parsed.sortBy,
        sortOrder: parsed.sortOrder,
      };

      const result = await this.propertyService.getProperties(params);

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
      const property = await this.propertyService.getPropertyBySlug(slug);
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

      if (request.user?.id !== tenantId) {
        return response.status(403).json({
          message: "Access denied: You can only view your own properties",
        });
      }

      const properties = await this.propertyService.getPropertiesByTenant(
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

  deleteProperty = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const propertyId = request.params.propertyId;
      const tenantId = request.user?.id;

      if (!tenantId) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const result = await this.propertyService.deleteProperty(
        propertyId,
        tenantId
      );
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export const propertyController = new PropertyController();
