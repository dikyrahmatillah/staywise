"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface PropertiesListFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  categoryGroups: CategoryGroup[];
  hasCategoryOptions: boolean;
}

interface CategoryGroup {
  type: "default" | "custom";
  label: string;
  options: string[];
}

export const PropertiesListFilters = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  categoryGroups,
  hasCategoryOptions,
}: PropertiesListFiltersProps) => {
  return (
    <div className="border-border/60 bg-card/60 backdrop-blur-sm rounded-md">
      <div className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search properties by name, location, or category..."
              className="pl-10 pr-4 h-11 border-border/60 bg-background/80 focus:bg-background transition-colors"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => onSearchChange("")}
              >
                ×
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter by:</span>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={onCategoryChange}
              disabled={!hasCategoryOptions}
            >
              <SelectTrigger className="w-64 h-11 border-border/60 bg-background/80">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                    All categories
                  </div>
                </SelectItem>
                {categoryGroups.map((group) =>
                  group.options.length ? (
                    <SelectGroup key={group.type}>
                      <SelectLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {group.label}
                      </SelectLabel>
                      {group.options.map((name) => {
                        const value = JSON.stringify({
                          type: group.type,
                          name,
                        });

                        return (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  group.type === "default"
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                                }`}
                              ></div>
                              {name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  ) : null
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
