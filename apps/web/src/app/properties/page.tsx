"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { FiltersBar } from "@/components/properties/FiltersBar";
import { PropertiesSummary } from "@/components/properties/PropertiesSummary";
import { PropertiesGrid } from "@/components/properties/PropertiesGrid";
import { Pagination } from "@/components/properties/Pagination";
import { usePropertySearchParams } from "@/hooks/usePropertySearchParams";

function formatLocation(location: string) {
  if (!location) return "";
  const parts = location.split(",").map((s) => s.trim());
  if (parts.length === 2) {
    return `${toTitleCase(parts[0])}, ${toTitleCase(parts[1])}`;
  }
  return toTitleCase(parts[0]);
}
function toTitleCase(str: string) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function PropertiesPageInner() {
  const [params, updateSearchParams] = usePropertySearchParams();

  const { data, isLoading, isError, error } = useProperties(params);
  const properties = data?.data ?? [];
  const totalProperties = data?.total ?? 0;
  const totalPages = Math.ceil(totalProperties / (params.limit || 12));

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage });
  };

  const clearFilters = () => {
    updateSearchParams({
      name: undefined,
      category: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      page: 1,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <FiltersBar params={params} onChange={updateSearchParams} />

        {/* Results summary */}
        <PropertiesSummary
          total={totalProperties}
          params={params}
          isLoading={isLoading}
          onChange={updateSearchParams}
          formatLocation={formatLocation}
          toTitleCase={toTitleCase}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-destructive font-medium mb-2">
                Failed to load properties
              </p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."}
              </p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !isError && properties.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-muted/30 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-lg font-medium mb-2">No properties found</p>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or clearing filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !isError && properties.length > 0 && (
          <>
            <PropertiesGrid properties={properties} />
            <Pagination
              totalPages={totalPages}
              params={params}
              onPage={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading properties...</div>}
    >
      <PropertiesPageInner />
    </Suspense>
  );
}
