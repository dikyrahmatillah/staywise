"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import type {
  CustomCategoryResponse,
  CreateCustomCategoryInput,
  UpdateCustomCategoryInput,
} from "@repo/schemas";

interface CategoryFormProps {
  category?: CustomCategoryResponse;
  onSubmit: (
    data: CreateCustomCategoryInput | UpdateCustomCategoryInput
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isLoading,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    if (name.length > 100) {
      setError("Category name must be less than 100 characters");
      return;
    }

    try {
      await onSubmit({ name: name.trim() });
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categoryName">Category Name</Label>
        <Input
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          disabled={isLoading}
          maxLength={100}
        />
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {category ? "Update" : "Create"} Category
        </Button>
      </DialogFooter>
    </form>
  );
}
