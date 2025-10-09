"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Ellipsis from "@/components/ui/ellipsis";

type Category = { id: string; name: string };

interface CategorySelectorDefaultSectionProps {
  categories: Category[];
  loading?: boolean;
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function CategorySelectorDefaultSection({
  categories,
  loading = false,
  selectedId,
  onSelect,
}: CategorySelectorDefaultSectionProps) {
  const sortedCategories = useMemo(
    () =>
      [...categories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [categories]
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Recommended categories *
            </p>
            <p className="text-xs text-muted-foreground">
              Curated suggestions to help you label your listing faster.
              Selection is required.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Plus className="h-3.5 w-3.5" />
          <span>Quick picks to help guests find your place.</span>
        </div>
      </div>

      <ScrollArea className="h-72 lg:h-auto lg:max-h-full pr-3">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Ellipsis />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className={
                  "group relative flex h-full flex-col items-start gap-3 rounded-2xl border bg-card/80 p-4 text-left transition-all duration-200 hover:border-primary/50 cursor-pointer" +
                  (selectedId === cat.id
                    ? " border-primary bg-primary/5"
                    : " border-muted-foreground/20")
                }
              >
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold ">{cat.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </section>
  );
}
