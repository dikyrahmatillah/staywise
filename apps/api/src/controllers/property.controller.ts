import { NextFunction, Request, Response } from "express";
import {
  getPropertiesQuerySchema,
  createPropertyInputSchema,
} from "@repo/schemas";
import { PropertyService } from "@/services/property.service.js";
import { FileService } from "@/services/file.service.js";

export class PropertyController {
  private propertyService = new PropertyService();
  private fileService = new FileService();

  private static querySchema = getPropertiesQuerySchema;

  createProperty = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const files = request.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      const propertyImages = files?.["propertyImages"] || [];
      const roomImages = files?.["roomImages"] || [];

      const propertyData: any = {
        tenantId: request.body.tenantId,
        name: request.body.name,
        description: request.body.description,
        country: request.body.country,
        city: request.body.city,
        address: request.body.address,
        maxGuests: parseInt(request.body.maxGuests) || 1,
        latitude: request.body.latitude
          ? parseFloat(request.body.latitude)
          : undefined,
        longitude: request.body.longitude
          ? parseFloat(request.body.longitude)
          : undefined,
      };

      if (request.body.propertyCategoryId) {
        propertyData.propertyCategoryId = request.body.propertyCategoryId;
      } else if (request.body.customCategoryId) {
        propertyData.customCategoryId = request.body.customCategoryId;
      } else if (request.body.customCategory) {
        propertyData.customCategory = JSON.parse(request.body.customCategory);
      }

      const facilities = request.body.facilities
        ? JSON.parse(request.body.facilities)
        : [];

      let pictures: Array<{ imageUrl: string; note?: string | null }> = [];
      if (propertyImages.length > 0) {
        const propertyPicturesData = request.body.propertyPictures
          ? JSON.parse(request.body.propertyPictures)
          : [];

        for (let i = 0; i < propertyImages.length; i++) {
          const imageUrl = await this.fileService.uploadPicture(
            propertyImages[i].path
          );
          const pictureData = propertyPicturesData.find(
            (p: any) => p.fileIndex === i
          );
          pictures.push({
            imageUrl,
            note: pictureData?.note || null,
          });
        }
      }

      let rooms: Array<any> = [];
      if (request.body.rooms) {
        const roomsData = JSON.parse(request.body.rooms);
        let roomImageIndex = 0;

        for (const roomData of roomsData) {
          const room: any = {
            name: roomData.name,
            description: roomData.description,
            basePrice: roomData.basePrice,
            capacity: roomData.capacity || 1,
            bedType: roomData.bedType,
            bedCount: roomData.bedCount || 1,
            availabilities: roomData.availabilities || [],
            priceAdjustments: roomData.priceAdjustments || [],
          };

          // If room has an image file, upload it
          if (roomData.hasImage && roomImageIndex < roomImages.length) {
            const imageUrl = await this.fileService.uploadPicture(
              roomImages[roomImageIndex].path
            );
            room.imageUrl = imageUrl;
            roomImageIndex++;
          }

          rooms.push(room);
        }
      }

      // Combine all data
      const finalData = {
        ...propertyData,
        facilities,
        pictures,
        rooms,
      };

      const validatedData = createPropertyInputSchema.parse(finalData);

      const property = await this.propertyService.createProperty(validatedData);

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
