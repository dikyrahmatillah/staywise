"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCustomCategories,
  useDefaultCategories,
} from "@/hooks/useCategories";
import {
  CreateCustomCategoryInput,
  UpdateCustomCategoryInput,
  CustomCategoryResponse,
} from "@repo/schemas";
import { toast } from "sonner";
import { DefaultCategoriesSection } from "./default-categories-section";
import { CustomCategoriesSection } from "./custom-categories-section";
import { CategoryForm } from "./category-form";
import { DeleteCategoryDialog } from "./delete-category-dialog";

export function CategoryManagement() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategoryResponse | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    categories: customCategories,
    loading: customLoading,
    error: customError,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCustomCategories();

  const {
    categories: defaultCategories,
    loading: defaultLoading,
    error: defaultError,
  } = useDefaultCategories();

  const handleCreateCategory = async (data: CreateCustomCategoryInput) => {
    setActionLoading(true);
    try {
      await createCategory(data);
      toast.success("Category created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      );
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCategory = async (data: UpdateCustomCategoryInput) => {
    if (!selectedCategory) return;

    setActionLoading(true);
    try {
      await updateCategory(selectedCategory.id, data);
      toast.success("Category updated successfully");
      setEditDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category"
      );
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setActionLoading(true);
    try {
      await deleteCategory(selectedCategory.id);
      toast.success("Category deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (category: CustomCategoryResponse) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (category: CustomCategoryResponse) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DefaultCategoriesSection
          categories={defaultCategories}
          loading={defaultLoading}
          error={defaultError}
        />
        <CustomCategoriesSection
          categories={customCategories}
          loading={customLoading}
          error={customError}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onCreate={handleCreateCategory}
          createLoading={actionLoading}
        />
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm
              category={selectedCategory}
              onSubmit={handleUpdateCategory}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedCategory(null);
              }}
              isLoading={actionLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        {selectedCategory && (
          <DeleteCategoryDialog
            category={selectedCategory}
            onConfirm={handleDeleteCategory}
            onCancel={() => {
              setDeleteDialogOpen(false);
              setSelectedCategory(null);
            }}
            isLoading={actionLoading}
          />
        )}
      </Dialog>
    </div>
  );
}
