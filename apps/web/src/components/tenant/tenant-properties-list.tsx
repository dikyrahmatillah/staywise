"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useTenantProperties } from "@/hooks/useTenantProperties";
import PropertyCard from "@/components/ui/property-card";
import { PropertiesListFilters } from "./properties-list-filters";
import {
  LoadingState,
  ErrorState,
  NoPropertiesState,
  EmptyState,
} from "./properties-list-states";

interface TenantPropertiesListProps {
  tenantId: string;
}

const PAGE_SIZE = 3;

type CategorySelection = {
  type: "default" | "custom";
  name: string;
};

export function TenantPropertiesList({ tenantId }: TenantPropertiesListProps) {
  const { properties, loading, error, deleteProperty, refetch } =
    useTenantProperties(tenantId);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleDeleteProperty = async (propertyId: string) => {
    await deleteProperty(propertyId);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedCategory]);

  const categorySelectGroups = useMemo(() => {
    const defaultCategories = new Set<string>();
    const customCategories = new Set<string>();

    properties.forEach((property) => {
      const defaultName = property.PropertyCategory?.name;
      const customName = property.CustomCategory?.name;

      if (defaultName) defaultCategories.add(defaultName);
      if (customName) customCategories.add(customName);
    });

    return [
      {
        type: "default" as const,
        label: "Default categories",
        options: Array.from(defaultCategories).sort((a, b) =>
          a.localeCompare(b)
        ),
      },
      {
        type: "custom" as const,
        label: "Custom categories",
        options: Array.from(customCategories).sort((a, b) =>
          a.localeCompare(b)
        ),
      },
    ];
  }, [properties]);

  const hasCategoryOptions = useMemo(
    () => categorySelectGroups.some((group) => group.options.length > 0),
    [categorySelectGroups]
  );

  const filteredProperties = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return properties.filter((property) => {
      let parsedCategory: CategorySelection | null = null;
      if (selectedCategory !== "all") {
        try {
          const parsed = JSON.parse(selectedCategory) as CategorySelection;
          if (
            parsed &&
            (parsed.type === "default" || parsed.type === "custom") &&
            typeof parsed.name === "string" &&
            parsed.name.length > 0
          ) {
            parsedCategory = parsed;
          }
        } catch {
          parsedCategory = null;
        }
      }

      const matchesCategory = parsedCategory
        ? parsedCategory.type === "default"
          ? property.PropertyCategory?.name === parsedCategory.name
          : property.CustomCategory?.name === parsedCategory.name
        : true;

      if (!matchesCategory) return false;

      if (!query) return true;

      const searchableText = [
        property.name,
        property.city,
        property.country,
        property.PropertyCategory?.name,
        property.CustomCategory?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [properties, searchTerm, selectedCategory]);

  const visibleProperties = useMemo(
    () => filteredProperties.slice(0, visibleCount),
    [filteredProperties, visibleCount]
  );

  const showViewMore = visibleCount < filteredProperties.length;
  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "all";

  if (loading) return <LoadingState />;

  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;

  if (properties.length === 0) return <NoPropertiesState />;

  return (
    <div className="space-y-6">
      <PropertiesListFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        categoryGroups={categorySelectGroups}
        hasCategoryOptions={hasCategoryOptions}
      />

      {filteredProperties.length === 0 ? (
        <EmptyState
          hasActiveFilters={hasActiveFilters}
          onRefresh={() => void refetch()}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {visibleProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={handleDeleteProperty}
              />
            ))}
          </div>

          {showViewMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setVisibleCount((previous) => previous + PAGE_SIZE)
                }
                className="gap-2 rounded-full px-8 h-11 border-border/60 bg-background/80 hover:bg-muted/50 transition-all duration-200"
              >
                Load more properties
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
