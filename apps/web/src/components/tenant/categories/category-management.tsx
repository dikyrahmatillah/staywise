"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import {
  useCustomCategories,
  useDefaultCategories,
} from "@/hooks/useCategories";
import {
  CreateCustomCategoryInput,
  UpdateCustomCategoryInput,
  CustomCategoryResponse,
} from "@repo/schemas";
import { DefaultCategoriesSection } from "./default-categories-section";
import { CustomCategoriesSection } from "./custom-categories-section";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { CategoryFormDialog } from "./category-form-dialog";

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
      setCreateDialogOpen(false);
    } catch {
      throw new Error("Failed to create category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCategory = async (data: UpdateCustomCategoryInput) => {
    if (!selectedCategory) return;
    setActionLoading(true);
    try {
      await updateCategory(selectedCategory.id, data);
      setEditDialogOpen(false);
      setSelectedCategory(null);
    } catch {
      throw new Error("Failed to update category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setActionLoading(true);
    try {
      await deleteCategory(selectedCategory.id);
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
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
        <DashboardPageHeader
          title="Category Management"
          description="Create and manage custom categories."
          action={
            <div className="flex items-center gap-3 justify-end">
              <Dialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    New category
                  </Button>
                </DialogTrigger>
                <CategoryFormDialog
                  title="Create Custom Category"
                  description={"Add a new custom category for your properties."}
                  onSubmit={handleCreateCategory}
                  onCancel={() => setCreateDialogOpen(false)}
                  isLoading={actionLoading}
                />
              </Dialog>
            </div>
          }
        />
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
        {selectedCategory && (
          <CategoryFormDialog
            title="Edit Category"
            description={"Update the category information."}
            category={selectedCategory}
            onSubmit={handleUpdateCategory}
            onCancel={() => {
              setEditDialogOpen(false);
              setSelectedCategory(null);
            }}
            isLoading={actionLoading}
          />
        )}
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
