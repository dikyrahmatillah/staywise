"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
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
      setCreateDialogOpen(false);
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="relative overflow-visible rounded-2xl">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Category Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  New category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Category</DialogTitle>
                  <DialogDescription>
                    Add a new custom category for your properties.
                  </DialogDescription>
                </DialogHeader>
                <CategoryForm
                  onSubmit={handleCreateCategory}
                  onCancel={() => setCreateDialogOpen(false)}
                  isLoading={actionLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <Tabs defaultValue="custom" className="space-y-6">
        <div className="flex flex-col gap-4">
          <TabsList className="w-full">
            <TabsTrigger
              value="custom"
              className="flex-1 px-4 py-2 text-sm text-center cursor-pointer"
            >
              Custom categories
            </TabsTrigger>
            <TabsTrigger
              value="default"
              className="flex-1 px-4 py-2 text-sm text-center cursor-pointer"
            >
              Default library
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="custom" className="space-y-6">
          <CustomCategoriesSection
            categories={customCategories}
            loading={customLoading}
            error={customError}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </TabsContent>

        <TabsContent value="default" className="space-y-6">
          <DefaultCategoriesSection
            categories={defaultCategories}
            loading={defaultLoading}
            error={defaultError}
          />
        </TabsContent>
      </Tabs>

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
