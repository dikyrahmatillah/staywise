import z from "zod";

export const roomSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.coerce.number(),
  beds: z.coerce.number().optional(),
});

export const createRoomSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  basePrice: z.coerce.number().positive(),
  capacity: z.coerce.number().int().min(1).default(1),
  bedType: z.enum(["KING", "QUEEN", "SINGLE", "TWIN"]).optional(),
  bedCount: z.coerce.number().int().min(1).default(1),
  imageUrl: z.url().optional(),
});

export const createRoomAvailabilitySchema = z.object({
  date: z.string(),
  isAvailable: z.boolean().optional().default(true),
});

export const blockRoomDatesSchema = z.object({
  dates: z.array(z.string()).min(1),
});

export const unblockRoomDatesSchema = z.object({
  dates: z.array(z.string()).min(1),
});

export const getRoomAvailabilitySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createPriceAdjustmentDateSchema = z.object({
  date: z.string(),
});

export const createPriceAdjustmentSchema = z.object({
  title: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  adjustType: z.enum(["PERCENTAGE", "NOMINAL"]),
  adjustValue: z.coerce.number(),
  applyAllDates: z.boolean().optional().default(true),
  dates: z.array(z.string()).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export const deleteRoomSchema = z.object({
  roomId: z.uuid(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type CreateRoomAvailabilityInput = z.infer<
  typeof createRoomAvailabilitySchema
>;
export type BlockRoomDatesInput = z.infer<typeof blockRoomDatesSchema>;
export type UnblockRoomDatesInput = z.infer<typeof unblockRoomDatesSchema>;
export type GetRoomAvailabilityInput = z.infer<
  typeof getRoomAvailabilitySchema
>;
export type CreatePriceAdjustmentInput = z.infer<
  typeof createPriceAdjustmentSchema
>;
