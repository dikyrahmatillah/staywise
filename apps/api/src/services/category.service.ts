import type { Prisma } from "@repo/database/generated/prisma/index.js";
import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import type {
  CreatePropertyInput,
  CreateCustomCategoryInput,
  UpdateCustomCategoryInput,
  GetCategoriesQuery,
  CustomCategoryListResponse,
  PropertyCategoryListResponse,
} from "@repo/schemas";

export async function resolveCategoryId(
  tx: Prisma.TransactionClient,
  data: CreatePropertyInput
) {
  if ("propertyCategoryId" in data) return (data as any).propertyCategoryId;

  if ("category" in data) {
    const category: any = (data as any).category;
    if (category && typeof category === "object") {
      const { name, description } = category as {
        name: string;
        description?: string;
      };
      const { id } = await tx.propertyCategory.create({
        data: {
          name,
        },
        select: { id: true },
      });
      return id;
    }
  }

  throw new AppError("Category is required", 400);
}

export class CategoryService {
  async getCustomCategories(tenantId: string, query: GetCategoriesQuery) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.CustomCategoryWhereInput = {
      tenantId,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),
    };

    const [categories, total] = await Promise.all([
      prisma.customCategory.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          tenantId: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.customCategory.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      categories,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getDefaultCategories(query: GetCategoriesQuery) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.PropertyCategoryWhereInput = {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),
    };

    const [categories, total] = await Promise.all([
      prisma.propertyCategory.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.propertyCategory.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      categories,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async createCustomCategory(
    tenantId: string,
    data: CreateCustomCategoryInput
  ) {
    const existingCategory = await prisma.customCategory.findFirst({
      where: {
        tenantId,
        name: {
          equals: data.name,
          mode: "insensitive",
        },
      },
    });

    if (existingCategory) {
      throw new AppError("Category with this name already exists", 409);
    }

    const category = await prisma.customCategory.create({
      data: {
        tenantId,
        name: data.name.trim(),
      },
      select: {
        id: true,
        tenantId: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return category;
  }

  async updateCustomCategory(
    tenantId: string,
    categoryId: string,
    data: UpdateCustomCategoryInput
  ) {
    const existingCategory = await prisma.customCategory.findFirst({
      where: {
        id: categoryId,
        tenantId,
      },
    });

    if (!existingCategory) {
      throw new AppError("Category not found", 404);
    }

    const nameConflict = await prisma.customCategory.findFirst({
      where: {
        tenantId,
        name: {
          equals: data.name,
          mode: "insensitive",
        },
        NOT: {
          id: categoryId,
        },
      },
    });

    if (nameConflict) {
      throw new AppError("Category with this name already exists", 409);
    }

    const category = await prisma.customCategory.update({
      where: {
        id: categoryId,
        tenantId,
      },
      data: {
        name: data.name.trim(),
      },
      select: {
        id: true,
        tenantId: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return category;
  }

  async deleteCustomCategory(tenantId: string, categoryId: string) {
    const existingCategory = await prisma.customCategory.findFirst({
      where: {
        id: categoryId,
        tenantId,
      },
    });

    if (!existingCategory) {
      throw new AppError("Category not found", 404);
    }

    const propertiesUsingCategory = await prisma.property.count({
      where: {
        customCategoryId: categoryId,
      },
    });

    if (propertiesUsingCategory > 0) {
      throw new AppError(
        "Cannot delete category that is being used by properties",
        409
      );
    }

    await prisma.customCategory.delete({
      where: {
        id: categoryId,
        tenantId,
      },
    });
  }
}
