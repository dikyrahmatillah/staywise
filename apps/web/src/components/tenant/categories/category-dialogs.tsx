"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface CategoryDialogsProps {
  createOpen: boolean;
  editOpen: boolean;
  deleteOpen: boolean;
  editCategoryName: string;
  newCategoryName: string;
  error: string | null;
  isCreating: boolean;
  onCreateOpenChange: (open: boolean) => void;
  onEditOpenChange: (open: boolean) => void;
  onDeleteOpenChange: (open: boolean) => void;
  onNewCategoryNameChange: (name: string) => void;
  onEditCategoryNameChange: (name: string) => void;
  onCreateSubmit: () => void;
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
  onErrorClear: () => void;
}

export function CategoryDialogs({
  createOpen,
  editOpen,
  deleteOpen,
  editCategoryName,
  newCategoryName,
  error,
  isCreating,
  onCreateOpenChange,
  onEditOpenChange,
  onDeleteOpenChange,
  onNewCategoryNameChange,
  onEditCategoryNameChange,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm,
  onErrorClear,
}: CategoryDialogsProps) {
  return (
    <>
      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={onCreateOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new category</DialogTitle>
            <DialogDescription>
              Give your category a short, memorable name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={newCategoryName}
              onChange={(e) => {
                onNewCategoryNameChange(e.target.value);
                if (error) onErrorClear();
              }}
              placeholder="e.g., Seaside Villa"
              autoFocus
              maxLength={100}
              className="focus:ring-2 focus-visible:border-primary/50 focus-visible:ring-primary/10 transition-all duration-200"
            />
            <p className="text-xs text-muted-foreground">
              Maximum 100 characters. Keep it descriptive but concise.
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onCreateOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onCreateSubmit}
              disabled={isCreating}
              className="gap-2"
            >
              {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={onEditOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>
              Update your custom category name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={editCategoryName}
              onChange={(e) => {
                onEditCategoryNameChange(e.target.value);
                if (error) onErrorClear();
              }}
              placeholder="e.g., Seaside Villa"
              autoFocus
              maxLength={100}
              className="focus:ring-2 focus-visible:border-primary/50 focus-visible:ring-primary/10 transition-all duration-200"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onEditSubmit}
              className="gap-2"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={onDeleteOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
            <DialogDescription>
              This will permanently delete the category. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {error && <p className="text-xs text-destructive">{error}</p>}
            <p className="text-sm">
              Are you sure you want to delete this category?
            </p>
          </div>
          <DialogFooter className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDeleteOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onDeleteConfirm}
              className="gap-2"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
