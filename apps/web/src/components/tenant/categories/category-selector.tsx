"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Loader2, Plus, Building2, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Badge as LucideBadge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
};

export default function CategorySelector({
  defaultCategories,
  customCategories,
  defaultLoading = false,
  customLoading = false,
  selectedDefault,
  selectedCustom,
  onDefaultSelect,
  onCustomSelect,
  onCreate,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const sortedDefault = useMemo(
    () =>
      [...defaultCategories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [defaultCategories]
  );
  const sortedCustom = useMemo(
    () =>
      [...customCategories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [customCategories]
  );

  const reset = () => {
    setNewCategoryName("");
    setAddError(null);
    setIsCreating(false);
  };

  const handleCreate = async () => {
    const value = newCategoryName.trim();
    if (!value) {
      setAddError("Category name is required");
      return;
    }
    setAddError(null);
    setIsCreating(true);
    try {
      await onCreate(value);
      setIsDialogOpen(false);
      reset();
    } catch (err) {
      setAddError(
        err instanceof Error ? err.message : "Failed to create category"
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
  }) => (
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
          <LucideBadge
            variant="secondary"
            className="gap-1 bg-primary/10 text-primary"
          >
            <BadgeCheck className="h-3.5 w-3.5" />
            Selected
          </LucideBadge>
        )}
      </div>
    </button>
  );

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
        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary">
                  Recommended
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Browse curated travel-friendly categories
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Plus className="h-3.5 w-3.5" />
                Picks to help guests filter your listing faster.
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
            ) : sortedDefault.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No default categories available at the moment.
              </p>
            ) : (
              <ScrollArea className="max-h-72 pr-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedDefault.map((cat) => (
                    <CategoryOption
                      key={cat.id}
                      id={cat.id}
                      name={cat.name}
                      description="Popular choice"
                      selected={selectedDefault === cat.id}
                      onSelect={onDefaultSelect}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </section>

          <Separator className="bg-border/60" />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-foreground">
                  Your custom categories
                </Label>
                <p className="text-xs text-muted-foreground">
                  Tailor listings with names that guests will remember.
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        if (addError) setAddError(null);
                      }}
                      placeholder="e.g., Seaside Villa"
                      autoFocus
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum 100 characters. Keep it descriptive but concise.
                    </p>
                    {addError && (
                      <p className="text-xs text-destructive">{addError}</p>
                    )}
                  </div>
                  <DialogFooter className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsDialogOpen(false);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreate}
                      disabled={isCreating}
                      className="gap-2"
                    >
                      {isCreating && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
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
            ) : sortedCustom.length === 0 ? (
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
                  {sortedCustom.map((cat) => (
                    <CategoryOption
                      key={cat.id}
                      id={cat.id}
                      name={cat.name}
                      description="Created by you"
                      selected={selectedCustom === cat.id}
                      onSelect={onCustomSelect}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
