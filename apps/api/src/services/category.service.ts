import type { Prisma } from "@repo/database/generated/prisma/index.js";
import { AppError } from "@/errors/app.error.js";
import type { CreatePropertyInput } from "@repo/schemas";

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
