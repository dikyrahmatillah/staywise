import z from "zod";

export const propertySchema = z.object({
  tenantId: z.uuid(),
  categoryId: z.uuid(),
  name: z.string().max(100, "Name must be 100 characters or less"),
  slug: z.string().max(150),
  description: z.string(),
  pictureUrl: z.string(),
  country: z.string().max(60, "Country must be 60 characters or less"),
  province: z.string().optional(),
  city: z.string().max(100, "City must be 100 characters or less"),
  address: z.string(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  maxGuests: z.number().min(1),
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
  categoryName: z.string().optional(),
  sortBy: z.union([z.literal("name"), z.literal("price")]).optional(),
  sortOrder: z.union([z.literal("asc"), z.literal("desc")]).optional(),
});

export const roomSchema = z.object({
  name: z.string().optional(),
  basePrice: z.number(),
  beds: z.number().optional(),
  bathrooms: z.number().optional(),
});

export const propertyCategorySchema = z.object({
  name: z.string(),
});

export const propertyResponseSchema = propertySchema
  .omit({ tenantId: true, categoryId: true })
  .extend({
    id: z.string(),
    PropertyCategory: propertyCategorySchema.optional().nullable(),
    Rooms: z.array(roomSchema),
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
  categoryName?: string;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
};

export type Property = z.infer<typeof propertySchema>;
export type GetPropertiesQuery = z.infer<typeof getPropertiesQuerySchema>;
export type RoomResponse = z.infer<typeof roomSchema>;
export type PropertyCategoryResponse = z.infer<typeof propertyCategorySchema>;
export type PropertyResponse = z.infer<typeof propertyResponseSchema>;
