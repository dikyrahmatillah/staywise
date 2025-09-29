"use client";

import { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
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
import type { GetPropertiesQuery } from "@repo/schemas";

export interface FiltersBarProps {
  params: GetPropertiesQuery;
  onChange: (updates: Partial<GetPropertiesQuery>) => void;
}

export function FiltersBar({ params, onChange }: FiltersBarProps) {
  const [nameFilter, setNameFilter] = useState(params.name || "");
  const [categoryFilter, setCategoryFilter] = useState(params.category || "");

  const { categories: defaultCategories, loading: categoriesLoading } =
    useDefaultCategories();

  useEffect(() => {
    setNameFilter(params.name || "");
    setCategoryFilter(params.category || "");
  }, [params.name, params.category]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      name: nameFilter,
      category: categoryFilter,
    });
  };

  const clear = () => {
    setNameFilter("");
    setCategoryFilter("");
    onChange({
      name: "",
      category: "",
      sortBy: "",
      sortOrder: "",
      page: 1,
    });
  };

  return (
    <div className="bg-card border rounded-lg p-6 mb-8 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Filters & Search</h2>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Property Name</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center text-muted-foreground cursor-pointer"
                  onClick={() => {
                    setNameFilter("");
                    onChange({ name: "" });
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
                  onChange({ category: mapped });
                }}
              >
                <SelectTrigger>
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
              {categoryFilter && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center text-muted-foreground cursor-pointer"
                  onClick={() => {
                    setCategoryFilter("");
                    onChange({ category: "" });
                  }}
                  aria-label="Clear category"
                >
                  <IoClose className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort">Sort By</Label>
            <Select
              value={
                params.sortBy && params.sortOrder
                  ? `${params.sortBy}-${params.sortOrder}`
                  : ""
              }
              onValueChange={(value) => {
                if (!value || value === "none") {
                  onChange({ sortBy: "", sortOrder: "" });
                  return;
                }
                const [sortBy, sortOrder] = value.split("-") as [
                  "name" | "price",
                  "asc" | "desc"
                ];
                onChange({ sortBy, sortOrder });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
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
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button type="button" variant="outline" onClick={clear}>
            Clear All
          </Button>
        </div>
      </form>
    </div>
  );
}
