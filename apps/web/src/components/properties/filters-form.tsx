"use client";

import { Search } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDefaultCategories } from "@/hooks/useCategories";
import type { GetPropertiesQuery } from "@/schemas";
import type { FC } from "react";

export interface FiltersFormProps {
  nameFilter: string;
  setNameFilter: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  params: GetPropertiesQuery;
  onChange: (updates: Partial<GetPropertiesQuery>) => void;
  onAfterSubmit?: () => void;
}

export const FiltersForm: FC<FiltersFormProps> = ({
  nameFilter,
  setNameFilter,
  categoryFilter,
  setCategoryFilter,
  params,
  onChange,
  onAfterSubmit,
}) => {
  const { categories: defaultCategories, loading: categoriesLoading } =
    useDefaultCategories();

  const activeSort =
    params.sortBy && params.sortOrder
      ? `${params.sortBy}-${params.sortOrder}`
      : "";

  const applyFilters = (after?: () => void) => {
    onChange({ name: nameFilter, category: categoryFilter, page: 1 });
    after?.();
  };

  const clearAll = (after?: () => void) => {
    setNameFilter("");
    setCategoryFilter("");
    onChange({ name: "", category: "", sortBy: "", sortOrder: "", page: 1 });
    after?.();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters(onAfterSubmit);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="name">Property Name</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Search by property name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-10 pr-8"
            />
            {nameFilter && (
              <button
                type="button"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-muted-foreground"
                onClick={() => {
                  setNameFilter("");
                  onChange({ name: "", page: 1 });
                }}
                aria-label="Clear name"
              >
                <IoClose className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <div className="relative">
            <Select
              value={categoryFilter ? categoryFilter : "__any__"}
              onValueChange={(value) => {
                const mapped = value === "__any__" ? "" : value;
                setCategoryFilter(mapped);
                onChange({ category: mapped, page: 1 });
              }}
            >
              <SelectTrigger className="text-left">
                <SelectValue
                  placeholder={
                    categoriesLoading ? "Loading..." : "All categories"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">All categories</SelectItem>
                {defaultCategories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select
            value={activeSort || "none"}
            onValueChange={(value) => {
              if (!value || value === "none") {
                onChange({ sortBy: "", sortOrder: "" });
                return;
              }
              const [sortBy, sortOrder] = value.split("-") as [
                "name" | "price",
                "asc" | "desc"
              ];
              onChange({ sortBy, sortOrder, page: 1 });
            }}
          >
            <SelectTrigger className="text-left">
              <SelectValue placeholder="Recommended order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Recommended</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-full">
          <Search className="mr-2 h-4 w-4" />
          Apply filters
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => clearAll(onAfterSubmit)}
        >
          Clear all
        </Button>
      </div>
    </form>
  );
};
