import z from "zod";
export const propertySchema = z.object({
  tenantId: z.uuid(),
  categoryId: z.uuid(),
  name: z.string().max(150, "Name must be 150 characters or less"),
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

export type Property = z.infer<typeof propertySchema>;
