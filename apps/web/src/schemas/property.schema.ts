import z from "zod";
import { createFacilitySchema } from "./facility.schema";
import {
  createRoomSchema,
  createRoomAvailabilitySchema,
  createPriceAdjustmentSchema,
} from "./room.schema";

export const propertySchema = z.object({
  tenantId: z.uuid(),
  propertyCategoryId: z.uuid().optional(),
  customCategoryId: z.uuid().optional(),
  name: z.string().max(100, "Name must be 100 characters or less"),
  slug: z.string().max(150),
  description: z.string(),
  imageUrl: z.string(),
  country: z.string().max(60, "Country must be 60 characters or less"),
  city: z.string().max(100, "City must be 100 characters or less"),
  address: z.string(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

const coerceOptionalInt = (min = 0) =>
  z.preprocess(
    (v) => (v == null || v === "" ? undefined : Number(v)),
    z.number().int().min(min).optional()
  );

export const getPropertiesQuerySchema = z.object({
  page: coerceOptionalInt(1),
  limit: coerceOptionalInt(1),
  location: z.string().optional(),
  destination: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  adults: coerceOptionalInt(0),
  children: coerceOptionalInt(0),
  guest: coerceOptionalInt(0),
  pets: coerceOptionalInt(0),
  name: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.union([z.literal("name"), z.literal("price")]).optional(),
  sortOrder: z.union([z.literal("asc"), z.literal("desc")]).optional(),
});

export const roomSummarySchema = z.object({
  name: z.string().optional(),
  basePrice: z.number(),
  beds: z.number().optional(),
  capacity: z.number().optional(),
});

export const propertyCategorySchema = z.object({
  name: z.string(),
});

export const customCategorySchema = z.object({
  name: z.string(),
});

export const createPropertyPictureSchema = z.object({
  imageUrl: z.url(),
  note: z.string().optional().nullable(),
});

export const propertyResponseSchema = propertySchema
  .omit({ tenantId: true, propertyCategoryId: true, customCategoryId: true })
  .extend({
    id: z.string(),
    maxGuests: z.number().int().min(1),
    Pictures: z.array(createPropertyPictureSchema).default([]),
    PropertyCategory: propertyCategorySchema.optional().nullable(),
    CustomCategory: customCategorySchema.optional().nullable(),
    Rooms: z.array(roomSummarySchema),
    priceFrom: z.number().optional(),
  });

export type GetPropertiesParams = {
  skip?: number;
  take?: number;
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guest?: number;
  pets?: number;
  name?: string;
  category?: string;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
};
export const createPropertyCategoryInput = z.union([
  z.object({ propertyCategoryId: z.uuid() }),
  z.object({ customCategoryId: z.uuid() }),
]);

export const createPropertyInputSchema = z
  .object({
    tenantId: z.uuid(),
    propertyCategoryId: z.uuid().optional(),
    customCategoryId: z.uuid().optional(),
    name: z.string().max(100),
    description: z.string(),
    country: z.string().max(60),
    city: z.string().max(100),
    address: z.string(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    slug: z.string().max(150).optional(),
    pictures: z.array(createPropertyPictureSchema).default([]),
    facilities: z.array(createFacilitySchema).default([]),
    rooms: z
      .array(
        createRoomSchema.extend({
          availabilities: z.array(createRoomAvailabilitySchema).default([]),
          priceAdjustments: z.array(createPriceAdjustmentSchema).default([]),
        })
      )
      .min(1, "At least one room is required"),
  })
  .and(createPropertyCategoryInput);

export const updatePropertyInputSchema = z.object({
  name: z.string().max(100).optional(),
  description: z.string().optional(),
  country: z.string().max(60).optional(),
  city: z.string().max(100).optional(),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  pictures: z.array(createPropertyPictureSchema).optional(),
  facilities: z.array(createFacilitySchema).optional(),
  propertyCategoryId: z.uuid().optional(),
  customCategoryId: z.uuid().optional().nullable(),
});

export type CreatePropertyInput = z.infer<typeof createPropertyInputSchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertyInputSchema>;
export type CreatePropertyPictureInput = z.infer<
  typeof createPropertyPictureSchema
>;
export type Property = z.infer<typeof createPropertyInputSchema>;
export type GetPropertiesQuery = z.infer<typeof getPropertiesQuerySchema>;
export type RoomResponse = z.infer<typeof roomSummarySchema>;
export type PropertyCategoryResponse = z.infer<typeof propertyCategorySchema>;
export type PropertyResponse = z.infer<typeof propertyResponseSchema>;
