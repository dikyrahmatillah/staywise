"use client";

import { Suspense } from "react";
import { AlertCircle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Ellipsis from "@/components/ui/ellipsis";
import { useProperties } from "@/hooks/useProperties";
import { FiltersBar } from "@/components/properties/filters-bar";
import { PropertiesSummary } from "@/components/properties/properties-summary";
import { PropertiesGrid } from "@/components/properties/properties-grid";
import { Pagination } from "@/components/properties/pagination";
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
      <div className="relative">
        <div className="container mx-auto px-4 pb-16 pt-10">
          <div className="sm:mt-10 space-y-10">
            <FiltersBar params={params} onChange={updateSearchParams} />

            <PropertiesSummary
              total={totalProperties}
              params={params}
              isLoading={isLoading}
              onChange={updateSearchParams}
              formatLocation={formatLocation}
              toTitleCase={toTitleCase}
            />

            {isLoading && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-3 text-sm font-medium text-muted-foreground">
                  <Ellipsis size={12} className="inline-block" />
                  <div className="mt-2 text-sm text-muted-foreground">
                    Searching for properties...
                  </div>
                </div>
              </div>
            )}

            {isError && (
              <div className="rounded-3xl border border-destructive/40 bg-destructive/10 p-8 text-center w-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive mx-auto">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-destructive">
                  Failed to load properties
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."}
                </p>
              </div>
            )}

            {!isLoading && !isError && properties.length === 0 && (
              <div className="rounded-3xl border border-border/60 bg-card/70 p-10 text-center shadow-sm backdrop-blur-sm w-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                  <SearchX className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">No properties found</h2>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>
            )}

            {!isLoading && !isError && properties.length > 0 && (
              <div className="space-y-10">
                <PropertiesGrid properties={properties} />
                <Pagination
                  totalPages={totalPages}
                  params={params}
                  onPage={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
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
