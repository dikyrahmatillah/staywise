"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySelectorDefaultSection } from "./category-selector-default-section";
import { CategorySelectorCustomSection } from "./category-selector-custom-section";
import { CategoryDialogs } from "./category-dialogs";

type Category = { id: string; name: string };

type Props = {
  defaultCategories: Category[];
  customCategories: Category[];
  defaultLoading?: boolean;
  customLoading?: boolean;
  selectedDefault?: string;
  selectedCustom?: string;
  onDefaultSelect: (id: string) => void;
  onCustomSelect: (id: string) => void;
  onCreate: (name: string) => Promise<void>;
  updateCustomCategory?: (
    id: string,
    data: { name: string }
  ) => Promise<unknown>;
  deleteCustomCategory?: (id: string) => Promise<unknown>;
};

export default function CategorySelector({
  defaultCategories,
  customCategories,
  customLoading = false,
  selectedDefault,
  selectedCustom,
  onDefaultSelect,
  onCustomSelect,
  onCreate,
  updateCustomCategory,
  deleteCustomCategory,
}: Props) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const resetCreateDialog = () => {
    setNewCategoryName("");
    setError(null);
    setIsCreating(false);
  };

  const handleCreateSubmit = async () => {
    const value = newCategoryName.trim();
    if (!value) {
      setError("Category name is required");
      return;
    }
    setError(null);
    setIsCreating(true);
    try {
      await onCreate(value);
      setIsCreateDialogOpen(false);
      resetCreateDialog();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editCategoryId) return;
    try {
      await updateCustomCategory?.(editCategoryId, {
        name: editCategoryName.trim(),
      });
      setEditCategoryId(null);
      setEditCategoryName("");
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCategoryId) return;
    try {
      await deleteCustomCategory?.(deleteCategoryId);
      if (selectedCustom === deleteCategoryId) onCustomSelect("");
      setDeleteCategoryId(null);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const handleEdit = (category: Category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const handleDelete = (category: Category) => {
    setDeleteCategoryId(category.id);
  };

  return (
    <>
      <Card>
        <CardHeader className="mb-6">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5 text-primary" />
            Property Category
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pick the category that best matches your place. You can choose one
            of our presets or create your own label to suit unique spaces.
          </p>
        </CardHeader>
        <CardContent className="space-y-10">
          <div className="space-y-6">
            <CategorySelectorDefaultSection
              categories={defaultCategories}
              selectedId={selectedDefault}
              onSelect={onDefaultSelect}
            />

            <Separator className="bg-border/60" />

            <CategorySelectorCustomSection
              categories={customCategories}
              loading={customLoading}
              selectedId={selectedCustom}
              onSelect={onCustomSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreateNew={() => setIsCreateDialogOpen(true)}
            />
          </div>
        </CardContent>
      </Card>

      <CategoryDialogs
        createOpen={isCreateDialogOpen}
        editOpen={!!editCategoryId}
        deleteOpen={!!deleteCategoryId}
        editCategoryName={editCategoryName}
        newCategoryName={newCategoryName}
        error={error}
        isCreating={isCreating}
        onCreateOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) resetCreateDialog();
        }}
        onEditOpenChange={(open) => {
          if (!open) {
            setEditCategoryId(null);
            setEditCategoryName("");
            setError(null);
          }
        }}
        onDeleteOpenChange={(open) => {
          if (!open) {
            setDeleteCategoryId(null);
            setError(null);
          }
        }}
        onNewCategoryNameChange={setNewCategoryName}
        onEditCategoryNameChange={setEditCategoryName}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        onErrorClear={() => setError(null)}
      />
    </>
  );
}
