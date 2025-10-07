import z from "zod";
import { amenitiesEnum } from "./facility.schema";
import { createPropertyPictureSchema } from "./property.schema";

export const roomDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  basePrice: z.number(),
  bedCount: z.number().optional(),
  bedType: z.string().nullable().optional(),
  maxGuests: z.number().optional(),
  capacity: z.number().optional(),
  imageUrl: z.string().nullable().optional(),
  beds: z.number().optional(),
});

export const facilityDetailSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  facility: amenitiesEnum,
});

export const reviewUserSchema = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  image: z.string().nullable().optional(),
});

export const reviewDetailSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.string(),
  User: reviewUserSchema,
});

export const propertyDetailResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  country: z.string(),
  city: z.string(),
  address: z.string(),
  maxGuests: z.number(),
  Rooms: z.array(roomDetailSchema),
  Facilities: z.array(facilityDetailSchema),
  Pictures: z.array(
    createPropertyPictureSchema.extend({
      id: z.string(),
      propertyId: z.string(),
    })
  ),
  Reviews: z.array(reviewDetailSchema),
  reviewCount: z.number().optional(),
  averageRating: z.number().nullable().optional(),
  latitude: z.union([z.number(), z.string()]).nullable().optional(),
  longitude: z.union([z.number(), z.string()]).nullable().optional(),
});

export type RoomDetail = z.infer<typeof roomDetailSchema>;
export type FacilityDetail = z.infer<typeof facilityDetailSchema>;
export type ReviewDetail = z.infer<typeof reviewDetailSchema>;
export type PropertyDetailResponse = z.infer<
  typeof propertyDetailResponseSchema
>;
