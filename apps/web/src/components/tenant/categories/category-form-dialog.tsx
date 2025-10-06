"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CategoryForm } from "./category-form";
import type {
  CustomCategoryResponse,
  CreateCustomCategoryInput,
  UpdateCustomCategoryInput,
} from "@/schemas";

interface CategoryFormDialogProps {
  title?: string;
  description?: React.ReactNode;
  category?: CustomCategoryResponse | null;
  onSubmit: (
    data: CreateCustomCategoryInput | UpdateCustomCategoryInput
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryFormDialog({
  title = "Create Custom Category",
  description = "Add a new custom category for your properties.",
  category = null,
  onSubmit,
  onCancel,
  isLoading,
}: CategoryFormDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <CategoryForm
        category={category ?? undefined}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    </DialogContent>
  );
}
