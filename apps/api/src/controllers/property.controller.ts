import { NextFunction, Request, Response } from "express";
import {
  getPropertiesQuerySchema,
  createPropertyInputSchema,
  updatePropertyInputSchema,
} from "@repo/schemas";
import { FileService } from "../services/file.service.js";
import { PropertyCrudService } from "@/services/property-crud.service.js";
import { PropertySearchService } from "@/services/property-search.service.js";

export class PropertyController {
  private propertyCrud = new PropertyCrudService();
  private propertySearch = new PropertySearchService();
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

      const finalData = {
        ...propertyData,
        facilities,
        pictures,
        rooms,
      };

      const validatedData = createPropertyInputSchema.parse(finalData);

      const property = await this.propertyCrud.createProperty(validatedData);

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
        category: parsed.category,
        sortBy: parsed.sortBy,
        sortOrder: parsed.sortOrder,
      };

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

      const result = await this.propertyCrud.deleteProperty(
        propertyId,
        tenantId
      );
      response.status(200).json(result);
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

  updateProperty = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const propertyId = request.params.id;
      const tenantId = request.user?.id;

      if (!tenantId) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const files = request.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      const propertyImages = files?.["propertyImages"] || [];

      const updateData: any = {};

      // Basic property data
      if (request.body.name) updateData.name = request.body.name;
      if (request.body.description)
        updateData.description = request.body.description;
      if (request.body.country) updateData.country = request.body.country;
      if (request.body.city) updateData.city = request.body.city;
      if (request.body.address) updateData.address = request.body.address;
      if (request.body.maxGuests)
        updateData.maxGuests = parseInt(request.body.maxGuests);
      if (request.body.latitude)
        updateData.latitude = parseFloat(request.body.latitude);
      if (request.body.longitude)
        updateData.longitude = parseFloat(request.body.longitude);

      // Category data
      if (request.body.propertyCategoryId) {
        updateData.propertyCategoryId = request.body.propertyCategoryId;
      } else if (request.body.customCategoryId) {
        updateData.customCategoryId = request.body.customCategoryId;
      } else if (request.body.customCategory) {
        updateData.customCategory = JSON.parse(request.body.customCategory);
      }

      // Facilities
      if (request.body.facilities) {
        updateData.facilities = JSON.parse(request.body.facilities);
      }

      // Handle property images
      // Strategy: keep any existing pictures provided by `existingPictures` and
      // append newly uploaded files. Only remove pictures if the client sends
      // an explicit list that omits them (client should send full desired list
      // via `existingPictures`) or include a deletion mechanism in the future.
      const finalPictures: Array<{ imageUrl: string; note?: string | null }> =
        [];

      // Start with existing pictures if provided
      if (request.body.existingPictures) {
        try {
          const existing = JSON.parse(request.body.existingPictures);
          if (Array.isArray(existing)) {
            for (const p of existing) {
              // Expect existing pictures to at least contain imageUrl
              if (p && p.imageUrl) {
                finalPictures.push({
                  imageUrl: p.imageUrl,
                  note: p.note ?? null,
                });
              }
            }
          }
        } catch (err) {
          // ignore parse errors and continue with new uploads only
        }
      }

      // Upload any new images and append
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
          finalPictures.push({ imageUrl, note: pictureData?.note || null });
        }
      }

      if (finalPictures.length > 0) {
        updateData.pictures = finalPictures;
      }

      const validatedData = updatePropertyInputSchema.parse(updateData);

      const property = await this.propertyCrud.updateProperty(
        propertyId,
        tenantId,
        validatedData
      );

      response.status(200).json({
        message: "Property updated successfully",
        data: property,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const propertyController = new PropertyController();
