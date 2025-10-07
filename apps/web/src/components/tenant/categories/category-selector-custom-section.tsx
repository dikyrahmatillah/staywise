"use client";

import { useMemo } from "react";
import { Edit3, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };

interface CategorySelectorCustomSectionProps {
  categories: Category[];
  loading?: boolean;
  selectedId?: string;
  onSelect: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onCreateNew: () => void;
}

export function CategorySelectorCustomSection({
  categories,
  loading = false,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onCreateNew,
}: CategorySelectorCustomSectionProps) {
  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [categories]
  );

  return (
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
        <Button type="button" size="sm" className="gap-2" onClick={onCreateNew}>
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl border border-dashed border-border/50 bg-muted/20"
            />
          ))}
        </div>
      ) : sortedCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            You haven&apos;t created any custom categories yet.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use the &quot;Add category&quot; button to craft unique labels for
            your listings.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-60 lg:h-auto lg:max-h-full pr-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCategories.map((cat) => (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(cat.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(cat.id);
                  }
                }}
                aria-pressed={selectedId === cat.id}
                className={cn(
                  "group relative flex items-center gap-3 rounded-2xl border bg-card/80 p-3 transition-all duration-200 hover:border-primary/50 cursor-pointer",
                  selectedId === cat.id && "border-primary bg-primary/5"
                )}
              >
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {cat.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(cat);
                    }}
                    className="rounded-md p-2 text-sm text-muted-foreground hover:bg-muted/30 cursor-pointer"
                    aria-label={`Edit ${cat.name}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(cat);
                    }}
                    className="rounded-md p-2 text-sm text-destructive hover:bg-muted/30 cursor-pointer"
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </section>
  );
}
