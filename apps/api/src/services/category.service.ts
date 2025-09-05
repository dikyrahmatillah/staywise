import type { Prisma } from "@repo/database/generated/prisma/index.js";
import { AppError } from "@/errors/app.error.js";
import type { CreatePropertyInput } from "@repo/schemas";

export async function resolveCategoryId(
  tx: Prisma.TransactionClient,
  data: CreatePropertyInput
) {
  if ("categoryId" in data) return data.categoryId;

  if ("category" in data) {
    const { name, description } = data.category;
    const { id } = await tx.propertyCategory.create({
      data: {
        tenantId: data.tenantId,
        name,
        description: description ?? null,
      },
      select: { id: true },
    });
    return id;
  }

  throw new AppError("Category is required", 400);
}
