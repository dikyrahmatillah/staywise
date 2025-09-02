import { NextFunction, Request, Response } from "express";
import { propertySchema } from "@repo/schemas";
import { PropertyService } from "@/services/property.service.js";

export class PropertyController {
  private propertyService = new PropertyService();

  createProperty = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = propertySchema.parse(request.body);
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
      const page = Number(request.query.page) || 1;
      const limit = Number(request.query.limit) || 10;
      const location =
        (request.query.location as string) ||
        (request.query.destination as string) ||
        undefined;
      const checkIn = request.query.checkIn as string | undefined;
      const checkOut = request.query.checkOut as string | undefined;
      const adults = Number(request.query.adults) || 0;
      const children = Number(request.query.children) || 0;
      const guest = adults + children || Number(request.query.guest) || 1;
      const pets = Number(request.query.pets) || 0;
      const name = (request.query.name as string) || undefined;
      const categoryId = (request.query.categoryId as string) || undefined;
      const categoryName = (request.query.categoryName as string) || undefined;
      const sortBy = request.query.sortBy as string as
        | "name"
        | "price"
        | undefined;
      const sortOrder = request.query.sortOrder as string as "asc" | "desc";

      const properties = await this.propertyService.getProperties({
        ...({
          skip: (page - 1) * limit,
          take: limit,
          destination: location,
          checkIn,
          checkOut,
          guest,
          pets,
          name,
          categoryId,
          categoryName,
          sortBy,
          sortOrder,
        } as any),
      });

      response.status(200).json({
        message: "Properties fetched successfully",
        data: properties,
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(properties.length / limit),
      });
    } catch (error) {
      next(error);
    }
  };
}

export const propertyController = new PropertyController();
