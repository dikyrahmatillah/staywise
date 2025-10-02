"use client";

import { useEffect, useMemo, useState } from "react";
import { usePropertyCreation } from "../property-creation-context";
import {
  useCustomCategories,
  useDefaultCategories,
} from "@/hooks/useCategories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BadgeCheck, Building2, Loader2, Plus, Sparkles } from "lucide-react";

export function CategoryStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const {
    categories: customCategories,
    loading: customLoading,
    createCategory,
  } = useCustomCategories();
  const { categories: defaultCategories, loading: defaultLoading } =
    useDefaultCategories();
  const [selectedDefaultCategory, setSelectedDefaultCategory] =
    useState<string>("");
  const [selectedCustomCategory, setSelectedCustomCategory] =
    useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (formData.propertyCategoryId) {
      setSelectedDefaultCategory(formData.propertyCategoryId);
    }
    if (formData.customCategoryId) {
      setSelectedCustomCategory(formData.customCategoryId);
    }
  }, [formData]);

  const handleDefaultCategorySelect = (categoryId: string) => {
    const next = selectedDefaultCategory === categoryId ? "" : categoryId;
    setSelectedDefaultCategory(next);
    const name = next
      ? defaultCategories.find((c) => c.id === next)?.name
      : undefined;
    updateFormData({
      propertyCategoryId: next || undefined,
      propertyCategoryName: name,
    });
  };

  const handleCustomCategorySelect = (categoryId: string) => {
    const next = selectedCustomCategory === categoryId ? "" : categoryId;
    setSelectedCustomCategory(next);
    const name = next
      ? customCategories.find((c) => c.id === next)?.name
      : undefined;
    // Only update custom category fields; do not clear default category
    updateFormData({
      customCategoryId: next || undefined,
      customCategoryName: name,
    });
  };

  const sortedDefaultCategories = useMemo(
    () =>
      [...defaultCategories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [defaultCategories]
  );

  const sortedCustomCategories = useMemo(
    () =>
      [...customCategories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [customCategories]
  );

  const resetDialogState = () => {
    setNewCategoryName("");
    setAddError(null);
    setIsCreating(false);
  };

  const handleAddCategory = async () => {
    const value = newCategoryName.trim();
    if (!value) {
      setAddError("Category name is required");
      return;
    }
    setAddError(null);
    setIsCreating(true);
    try {
      const category = await createCategory({ name: value });
      setSelectedCustomCategory(category.id);
      setSelectedDefaultCategory("");
      updateFormData({
        customCategoryId: category.id,
        customCategoryName: category.name,
        propertyCategoryId: undefined,
        propertyCategoryName: undefined,
      });
      setIsDialogOpen(false);
      resetDialogState();
    } catch (err) {
      setAddError(
        err instanceof Error ? err.message : "Unable to create category"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const CategoryOption = ({
    id,
    name,
    description,
    selected,
    onSelect,
  }: {
    id: string;
    name: string;
    description: string;
    selected: boolean;
    onSelect: (id: string) => void;
  }) => {
    return (
      <button
        type="button"
        onClick={() => onSelect(id)}
        className={cn(
          "group relative flex h-full flex-col items-start gap-3 rounded-2xl border bg-card/80 p-4 text-left transition-all duration-200 hover:border-primary/50 hover:shadow-md",
          selected &&
            "border-primary bg-primary/5 shadow-[0_10px_30px_-15px_rgba(59,130,246,0.45)]"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-primary transition-colors",
              selected && "border-primary bg-primary/10"
            )}
          >
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          {selected && (
            <Badge
              variant="secondary"
              className="gap-1 bg-primary/10 text-primary"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              Selected
            </Badge>
          )}
        </div>
      </button>
    );
  };

  return (
    <Card className="border-border/60 bg-background/95 shadow-lg backdrop-blur-sm">
      <CardHeader className="border-b border-border/60 pb-6">
        <div className="space-y-3">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Property Category
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Pick the category that best matches your place. You can choose one
            of our presets or create your own label to suit unique spaces.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-10 py-6">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary">
                Recommended
              </Badge>
              <span className="text-sm text-muted-foreground">
                Browse curated travel-friendly categories
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Stunning picks to help guests filter your listing faster.
            </div>
          </div>

          {defaultLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl border border-dashed border-border/50 bg-muted/20"
                />
              ))}
            </div>
          ) : sortedDefaultCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No default categories available at the moment.
            </p>
          ) : (
            <ScrollArea className="max-h-72 pr-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sortedDefaultCategories.map((category) => (
                  <CategoryOption
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    description="Popular choice"
                    selected={selectedDefaultCategory === category.id}
                    onSelect={handleDefaultCategorySelect}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </section>

        <Separator className="bg-border/60" />

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-foreground">
                Your custom categories
              </Label>
              <p className="text-xs text-muted-foreground">
                Tailor listings with names that guests will remember.
              </p>
            </div>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  resetDialogState();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add category
                </Button>
              </DialogTrigger>
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
                    onChange={(event) => {
                      setNewCategoryName(event.target.value);
                      if (addError) setAddError(null);
                    }}
                    placeholder="e.g., Seaside Villa"
                    autoFocus
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum 100 characters. Keep it descriptive but concise.
                  </p>
                  {addError ? (
                    <p className="text-xs text-destructive">{addError}</p>
                  ) : null}
                </div>
                <DialogFooter className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetDialogState();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddCategory}
                    disabled={isCreating}
                    className="gap-2"
                  >
                    {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {customLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl border border-dashed border-border/50 bg-muted/20"
                />
              ))}
            </div>
          ) : sortedCustomCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                You haven’t created any custom categories yet.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Use the “Add category” button to craft unique labels for your
                listings.
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-60 pr-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sortedCustomCategories.map((category) => (
                  <CategoryOption
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    description="Created by you"
                    selected={selectedCustomCategory === category.id}
                    onSelect={handleCustomCategorySelect}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
