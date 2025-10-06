import type { Prisma } from "../generated/prisma/index.js";
import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";
import type {
  CreateCustomCategoryInput,
  UpdateCustomCategoryInput,
  GetCategoriesQuery,
} from "@repo/schemas";

function paginate(query: GetCategoriesQuery) {
  const { page = 1, limit = 10, search } = query;
  const skip = (page - 1) * limit;
  return { page, limit, skip, search };
}

export class CategoryService {
  async getCustomCategories(tenantId: string, query: GetCategoriesQuery) {
    const { page, limit, skip, search } = paginate(query);

    const where: Prisma.CustomCategoryWhereInput = {
      tenantId,
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    };

    const [categories, total] = await Promise.all([
      prisma.customCategory.findMany({
        where,
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
      prisma.customCategory.count({ where }),
    ]);

    return {
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDefaultCategories(query: GetCategoriesQuery) {
    const { page, limit, skip, search } = paginate(query);

    const where: Prisma.PropertyCategoryWhereInput = {
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    };

    const [categories, total] = await Promise.all([
      prisma.propertyCategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        select: { id: true, name: true, createdAt: true, updatedAt: true },
      }),
      prisma.propertyCategory.count({ where }),
    ]);

    return {
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createCustomCategory(
    tenantId: string,
    data: CreateCustomCategoryInput
  ) {
    const name = data.name.trim();

    const currentCount = await prisma.customCategory.count({
      where: { tenantId },
    });
    if (currentCount >= 10) {
      throw new AppError("Maximum of 10 custom categories reached", 409);
    }

    const existingCategory = await prisma.customCategory.findFirst({
      where: { tenantId, name: { equals: name, mode: "insensitive" } },
    });

    if (existingCategory)
      throw new AppError("Category with this name already exists", 409);

    return prisma.customCategory.create({
      data: { tenantId, name },
      select: {
        id: true,
        tenantId: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateCustomCategory(
    tenantId: string,
    categoryId: string,
    data: UpdateCustomCategoryInput
  ) {
    const existingCategory = await prisma.customCategory.findFirst({
      where: { id: categoryId, tenantId },
    });
    if (!existingCategory) throw new AppError("Category not found", 404);

    const name = data.name.trim();
    const nameConflict = await prisma.customCategory.findFirst({
      where: {
        tenantId,
        name: { equals: name, mode: "insensitive" },
        NOT: { id: categoryId },
      },
    });

    if (nameConflict)
      throw new AppError("Category with this name already exists", 409);

    return prisma.customCategory.update({
      where: { id: categoryId, tenantId },
      data: { name },
      select: {
        id: true,
        tenantId: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteCustomCategory(tenantId: string, categoryId: string) {
    const existingCategory = await prisma.customCategory.findFirst({
      where: { id: categoryId, tenantId },
    });
    if (!existingCategory) throw new AppError("Category not found", 404);

    const propertiesUsingCategory = await prisma.property.count({
      where: { customCategoryId: categoryId },
    });

    if (propertiesUsingCategory > 0)
      throw new AppError(
        "Cannot delete category that is being used by properties",
        409
      );

    await prisma.customCategory.delete({ where: { id: categoryId, tenantId } });
  }
}
