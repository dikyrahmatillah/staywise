import type { Prisma } from "@repo/database/generated/prisma/index.js";
import { AppError } from "@/errors/app.error.js";
import type { CreatePropertyInput } from "@repo/schemas";

export async function resolveCategoryId(
  tx: Prisma.TransactionClient,
  data: CreatePropertyInput
): Promise<string> {
  if ("categoryId" in data && typeof data.categoryId === "string") {
    return data.categoryId;
  }
  if (
    "category" in data &&
    (data as { category?: { name?: unknown } }).category?.name
  ) {
    const { name, description } = (
      data as {
        category: { name: string; description?: string };
      }
    ).category;
    const created = await tx.propertyCategory.create({
      data: {
        tenantId: data.tenantId,
        name,
        description: description ?? null,
      },
      select: { id: true },
    });
    return created.id;
  }
  throw new AppError("Category is required", 400);
}
