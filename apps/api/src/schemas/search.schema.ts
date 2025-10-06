import { z } from "zod";

export const searchSchema = z.object({
  location: z.string().optional(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
  adults: z.number().min(0).optional(),
  childrenCount: z.number().min(0).optional(),
  pets: z.number().min(0).optional(),
});

export type SearchSchema = z.infer<typeof searchSchema>;
