import type { CreatePropertyInput, UpdatePropertyInput } from "@repo/schemas";
import { prisma } from "../configs/prisma.config.js";
import { nanoid } from "nanoid";
import slugify from "@sindresorhus/slugify";
import { PropertyRepository } from "../repositories/property.repository.js";
import { PropertyValidator } from "../utils/property-validator.js";
import { mapFacilities, mapPictures, mapRooms } from "../utils/mappers.js";

export class PropertyCrudService {
  private repository: PropertyRepository;

  constructor() {
    this.repository = new PropertyRepository();
  }

  async createProperty(data: CreatePropertyInput) {
    const slug = `${slugify(data.name)}-${nanoid(6)}`;

    const property = await prisma.$transaction(async (tx) => {
      const propertyCategoryId = data.propertyCategoryId;
      if (!propertyCategoryId) {
        throw new Error("propertyCategoryId is required");
      }

      const propertyData = {
        tenantId: data.tenantId,
        propertyCategoryId,
        customCategoryId: data.customCategoryId ?? undefined,
        name: data.name,
        slug,
        description: data.description,
        country: data.country,
        city: data.city,
        address: data.address,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        Facilities: mapFacilities(data.facilities),
        Pictures: mapPictures(data.pictures),
        Rooms: mapRooms(data.rooms),
      };

      return this.repository.create(propertyData);
    });

    return property;
  }

  async getPropertyBySlug(slug: string) {
    PropertyValidator.validateSlug(slug);

    const property = await this.repository.findUniqueBySlug(slug);
    PropertyValidator.validatePropertyExists(property);

    const reviewStats = await this.repository.getReviewStats(property.id);

    return {
      ...property,
      reviewCount: reviewStats.count,
      averageRating: reviewStats.averageRating,
    };
  }

  async getPropertyById(propertyId: string, tenantId?: string) {
    PropertyValidator.validatePropertyId(propertyId);

    const property = await this.repository.findUniqueById(propertyId, tenantId);
    PropertyValidator.validatePropertyExists(property, tenantId);

    return property;
  }

  async getPropertiesByTenant(tenantId: string) {
    PropertyValidator.validateTenantAccess(tenantId);

    return this.repository.findManyByTenant(tenantId);
  }

  async deleteProperty(propertyId: string, tenantId: string) {
    PropertyValidator.validatePropertyId(propertyId);
    PropertyValidator.validateTenantAccess(tenantId);

    const property = await this.repository.findFirstByIdAndTenant(
      propertyId,
      tenantId
    );
    PropertyValidator.validateDeletePermission(property);

    const activeBookingCount = await this.repository.getActiveBookingCount(
      propertyId
    );
    PropertyValidator.validateActiveBookings(activeBookingCount);

    await this.repository.delete(propertyId);

    return { message: "Property deleted successfully" };
  }

  async updateProperty(
    propertyId: string,
    tenantId: string,
    data: UpdatePropertyInput
  ) {
    PropertyValidator.validatePropertyId(propertyId);
    PropertyValidator.validateTenantAccess(tenantId);

    const existingProperty = await this.repository.findFirstByIdAndTenant(
      propertyId,
      tenantId
    );
    PropertyValidator.validateUpdatePermission(existingProperty);

    const updatedProperty = await prisma.$transaction(async (tx) => {
      const updateData: any = this.buildBasicUpdateData(data);

      // Handle category updates - allow explicit null to remove categories
      // propertyCategoryId: only update when provided and not empty string
      if ("propertyCategoryId" in data) {
        const val = (data as any).propertyCategoryId;
        if (val !== "") {
          updateData.propertyCategoryId = val;
        }
        // if empty string -> do not change
      }

      // customCategoryId: allow explicit null to remove
      if ("customCategoryId" in data) {
        updateData.customCategoryId = data.customCategoryId || null;
      }

      const updated = await this.repository.update(propertyId, updateData);

      await this.updateFacilities(propertyId, data);
      await this.updatePictures(propertyId, data);

      return updated;
    });

    return updatedProperty;
  }

  private buildBasicUpdateData(data: UpdatePropertyInput) {
    const updateData: UpdatePropertyInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;

    return updateData;
  }

  private async updateFacilities(
    propertyId: string,
    data: UpdatePropertyInput
  ) {
    if ("facilities" in data && data.facilities !== undefined) {
      await this.repository.deleteFacilities(propertyId);
      if (data.facilities.length > 0) {
        await this.repository.createFacilities(propertyId, data.facilities);
      }
    }
  }

  private async updatePictures(propertyId: string, data: UpdatePropertyInput) {
    if ("pictures" in data && data.pictures !== undefined) {
      await this.repository.deletePictures(propertyId);
      if (data.pictures.length > 0) {
        await this.repository.createPictures(propertyId, data.pictures);
      }
    }
  }
}
