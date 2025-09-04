import z from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(1),
  basePrice: z.number().positive(),
  capacity: z.number().int().min(1).default(1),
  bedType: z.enum(["KING", "QUEEN", "SINGLE", "TWIN"]).optional(),
  bedCount: z.number().int().min(1).default(1),
  imageUrl: z.string().url().optional(),
});

export const createRoomAvailabilitySchema = z.object({
  date: z.string(),
  isAvailable: z.boolean().optional().default(true),
});

export const createPriceAdjustmentDateSchema = z.object({
  date: z.string(),
});

export const createPriceAdjustmentSchema = z.object({
  title: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  adjustType: z.enum(["PERCENTAGE", "NOMINAL"]),
  adjustValue: z.number(),
  applyAllDates: z.boolean().optional().default(true),
  dates: z.array(z.string()).optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type CreateRoomAvailabilityInput = z.infer<
  typeof createRoomAvailabilitySchema
>;
export type CreatePriceAdjustmentInput = z.infer<
  typeof createPriceAdjustmentSchema
>;
