import { NextFunction, Request, Response } from "express";
import { updatePropertyInputSchema } from "@repo/schemas";
import { FileService } from "../services/file.service.js";
import { PropertyCrudService } from "@/services/property-crud.service.js";

export class PropertyManageController {
  propertyCrud = new PropertyCrudService();
  fileService = new FileService();

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

      const updateData = await this.buildUpdateData(request, propertyImages);
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

  async buildUpdateData(
    request: Request,
    propertyImages: Express.Multer.File[]
  ) {
    const updateData: any = {};

    this.extractBasicFields(request, updateData);
    this.extractCategoryFields(request, updateData);
    this.extractFacilities(request, updateData);

    const pictures = await this.processPictures(request, propertyImages);
    if (pictures.length > 0) {
      updateData.pictures = pictures;
    }

    return updateData;
  }

  extractBasicFields(request: Request, updateData: any) {
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
  }

  extractCategoryFields(request: Request, updateData: any) {
    updateData.propertyCategoryId = request.body.propertyCategoryId || null;
    updateData.customCategoryId = request.body.customCategoryId || null;
  }

  extractFacilities(request: Request, updateData: any) {
    if (request.body.facilities) {
      updateData.facilities = JSON.parse(request.body.facilities);
    }
  }

  async processPictures(
    request: Request,
    propertyImages: Express.Multer.File[]
  ) {
    const finalPictures: Array<{ imageUrl: string; note?: string | null }> = [];

    this.extractExistingPictures(request, finalPictures);
    await this.uploadNewPictures(request, propertyImages, finalPictures);

    return finalPictures;
  }

  extractExistingPictures(
    request: Request,
    finalPictures: Array<{ imageUrl: string; note?: string | null }>
  ) {
    if (request.body.existingPictures) {
      try {
        const existing = JSON.parse(request.body.existingPictures);
        if (Array.isArray(existing)) {
          for (const p of existing) {
            if (p && p.imageUrl) {
              finalPictures.push({
                imageUrl: p.imageUrl,
                note: p.note ?? null,
              });
            }
          }
        }
      } catch (err) {}
    }
  }

  async uploadNewPictures(
    request: Request,
    propertyImages: Express.Multer.File[],
    finalPictures: Array<{ imageUrl: string; note?: string | null }>
  ) {
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
  }
}

export const propertyManageController = new PropertyManageController();
