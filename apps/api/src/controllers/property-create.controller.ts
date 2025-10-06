import { NextFunction, Request, Response } from "express";
import { createPropertyInputSchema } from "@repo/schemas";
import { FileService } from "../services/file.service.js";
import { PropertyCrudService } from "../services/property-crud.service.js";

export class PropertyCreateController {
  propertyCrud = new PropertyCrudService();
  fileService = new FileService();

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

      const propertyData = await this.extractPropertyData(request);
      const facilities = this.extractFacilities(request);
      const pictures = await this.processPropertyImages(
        propertyImages,
        request
      );
      const rooms = await this.processRoomData(roomImages, request);

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

  async extractPropertyData(request: Request) {
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

    propertyData.propertyCategoryId =
      request.body.propertyCategoryId || undefined;
    propertyData.customCategoryId = request.body.customCategoryId || undefined;

    return propertyData;
  }

  extractFacilities(request: Request) {
    return request.body.facilities ? JSON.parse(request.body.facilities) : [];
  }

  async processPropertyImages(
    propertyImages: Express.Multer.File[],
    request: Request
  ) {
    const pictures: Array<{ imageUrl: string; note?: string | null }> = [];

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

    return pictures;
  }

  async processRoomData(roomImages: Express.Multer.File[], request: Request) {
    const rooms: Array<any> = [];

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

    return rooms;
  }
}

export const propertyCreateController = new PropertyCreateController();
