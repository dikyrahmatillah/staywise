"use client";

import { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
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
import type { GetPropertiesQuery } from "@repo/schemas";

export interface FiltersBarProps {
  params: GetPropertiesQuery;
  onChange: (updates: Partial<GetPropertiesQuery>) => void;
}

export function FiltersBar({ params, onChange }: FiltersBarProps) {
  const [nameFilter, setNameFilter] = useState(params.name || "");
  const [categoryFilter, setCategoryFilter] = useState(
    params.categoryName || ""
  );

  useEffect(() => {
    setNameFilter(params.name || "");
    setCategoryFilter(params.categoryName || "");
  }, [params.name, params.categoryName]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      name: nameFilter,
      categoryName: categoryFilter,
    });
  };

  const clear = () => {
    setNameFilter("");
    setCategoryFilter("");
    onChange({
      name: "",
      categoryName: "",
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
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              type="text"
              placeholder="Search by category..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
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
