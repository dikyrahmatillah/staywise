import { z } from "zod";

export const baseCategorySchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters"),
});
export const customCategoryResponseSchema = baseCategorySchema.extend({
  tenantId: z.uuid(),
});
export const defaultPropertyCategorySchema = baseCategorySchema;
export const createCustomCategoryInputSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters")
    .trim(),
});
export const updateCustomCategoryInputSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters")
    .trim(),
});
export const deleteCustomCategoryInputSchema = z.object({
  id: z.string().uuid("Invalid category ID"),
});
export const getCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
});
export const customCategoryListResponseSchema = z.object({
  categories: z.array(customCategoryResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});
export const propertyCategoryListResponseSchema = z.object({
  categories: z.array(defaultPropertyCategorySchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type BaseCategory = z.infer<typeof baseCategorySchema>;
export type CustomCategoryResponse = z.infer<
  typeof customCategoryResponseSchema
>;
export type DefaultPropertyCategory = z.infer<
  typeof defaultPropertyCategorySchema
>;
export type CreateCustomCategoryInput = z.infer<
  typeof createCustomCategoryInputSchema
>;
export type UpdateCustomCategoryInput = z.infer<
  typeof updateCustomCategoryInputSchema
>;
export type DeleteCustomCategoryInput = z.infer<
  typeof deleteCustomCategoryInputSchema
>;
export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;
export type CustomCategoryListResponse = z.infer<
  typeof customCategoryListResponseSchema
>;
export type PropertyCategoryListResponse = z.infer<
  typeof propertyCategoryListResponseSchema
>;
