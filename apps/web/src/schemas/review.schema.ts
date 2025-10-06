import { z } from "zod";

export const createReviewSchema = z.object({
  orderId: z.string().uuid("Invalid booking ID"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be less than 1000 characters"),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .optional(),
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be less than 1000 characters")
    .optional(),
});

export const reviewResponseSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  userId: z.string(),
  propertyId: z.string(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.date(),
  User: z.object({
    firstName: z.string(),
    lastName: z.string().nullable(),
    image: z.string().nullable(),
  }).optional(),
  Property: z.object({
    name: z.string(),
    slug: z.string(),
  }).optional(),
});

export const getReviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  propertyId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>;