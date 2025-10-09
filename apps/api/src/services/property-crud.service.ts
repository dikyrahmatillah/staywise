import type {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "../schemas/index.js";
import { prisma } from "../configs/prisma.config.js";
import { nanoid } from "nanoid";
import slugify from "@sindresorhus/slugify";
import { PropertyCrudRepository } from "../repositories/property-crud.repository.js";
import { PropertyRelationsRepository } from "../repositories/property-relations.repository.js";
import { PropertyValidator } from "../utils/property-validator.js";
import { mapFacilities, mapPictures, mapRooms } from "../utils/mappers.js";

export class PropertyCrudService {
  private crudRepository: PropertyCrudRepository;
  private relationsRepository: PropertyRelationsRepository;

  constructor() {
    this.crudRepository = new PropertyCrudRepository();
    this.relationsRepository = new PropertyRelationsRepository();
  }

  async createProperty(data: CreatePropertyInput) {
    const slug = `${slugify(data.name)}-${nanoid(6)}`;

    const property = await prisma.$transaction(
      async (tx) => {
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
          maxGuests:
            (data.rooms || []).reduce(
              (sum: number, r: any) => sum + (r.capacity ?? 1),
              0
            ) || 1,
          Facilities: mapFacilities(data.facilities),
          Pictures: mapPictures(data.pictures),
          Rooms: mapRooms(data.rooms),
        };

        return this.crudRepository.create(propertyData);
      },
      {
        maxWait: 15000,
        timeout: 30000,
      }
    );

    return property;
  }

  async getPropertyBySlug(slug: string) {
    PropertyValidator.validateSlug(slug);

    const property = await this.crudRepository.findUniqueBySlug(slug);
    PropertyValidator.validatePropertyExists(property);

    const reviewStats = await this.relationsRepository.getReviewStats(
      property.id
    );

    return {
      ...property,
      reviewCount: reviewStats.count,
      averageRating: reviewStats.averageRating,
    };
  }

  async getPropertyById(propertyId: string, tenantId?: string) {
    PropertyValidator.validatePropertyId(propertyId);

    const property = await this.crudRepository.findUniqueById(
      propertyId,
      tenantId
    );
    PropertyValidator.validatePropertyExists(property, tenantId);

    return property;
  }

  async getPropertiesByTenant(tenantId: string) {
    PropertyValidator.validateTenantAccess(tenantId);

    return this.crudRepository.findManyByTenant(tenantId);
  }

  async deleteProperty(propertyId: string, tenantId: string) {
    PropertyValidator.validatePropertyId(propertyId);
    PropertyValidator.validateTenantAccess(tenantId);

    const property = await this.crudRepository.findFirstByIdAndTenant(
      propertyId,
      tenantId
    );
    PropertyValidator.validateDeletePermission(property);

    const activeBookingCount = await this.crudRepository.getActiveBookingCount(
      propertyId
    );
    PropertyValidator.validateActiveBookings(activeBookingCount);

    await this.crudRepository.delete(propertyId);

    return { message: "Property deleted successfully" };
  }

  async updateProperty(
    propertyId: string,
    tenantId: string,
    data: UpdatePropertyInput
  ) {
    PropertyValidator.validatePropertyId(propertyId);
    PropertyValidator.validateTenantAccess(tenantId);

    const existingProperty = await this.crudRepository.findFirstByIdAndTenant(
      propertyId,
      tenantId
    );
    PropertyValidator.validateUpdatePermission(existingProperty);

    const updatedProperty = await prisma.$transaction(
      async (tx) => {
        const updateData: any = this.buildBasicUpdateData(data);

        if ("propertyCategoryId" in data) {
          const val = (data as any).propertyCategoryId;
          if (val !== "") {
            updateData.propertyCategoryId = val;
          }
        }

        if ("customCategoryId" in data) {
          updateData.customCategoryId = data.customCategoryId || null;
        }

        const updated = await this.crudRepository.update(
          propertyId,
          updateData
        );

        await this.updateFacilities(propertyId, data);
        await this.updatePictures(propertyId, data);

        return updated;
      },
      {
        maxWait: 15000,
        timeout: 30000,
      }
    );

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
      await this.relationsRepository.deleteFacilities(propertyId);
      if (data.facilities.length > 0) {
        await this.relationsRepository.createFacilities(
          propertyId,
          data.facilities
        );
      }
    }
  }

  private async updatePictures(propertyId: string, data: UpdatePropertyInput) {
    if ("pictures" in data && data.pictures !== undefined) {
      await this.relationsRepository.deletePictures(propertyId);
      if (data.pictures.length > 0) {
        await this.relationsRepository.createPictures(
          propertyId,
          data.pictures
        );
      }
    }
  }
}
