"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { CustomCategoryResponse } from "@repo/schemas";

interface DeleteCategoryDialogProps {
  category: CustomCategoryResponse;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteCategoryDialog({
  category,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteCategoryDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the category “{category.name}”? This
          action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
