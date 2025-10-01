"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Plus, RefreshCw, Search } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onRefresh: () => void;
  onResetFilters: () => void;
}

export const LoadingState = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Loading Properties
        </h3>
        <p className="text-muted-foreground text-sm">
          Fetching your property listings...
        </p>
      </div>
    </div>
  );
};

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-8 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Something went wrong
          </h3>
          <p className="text-destructive text-sm">{error}</p>
          <p className="text-muted-foreground text-sm">
            We couldn&apos;t load your properties. Please try again.
          </p>
        </div>
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export const NoPropertiesState = () => {
  return (
    <Card className="border-dashed border-2 border-border/60 bg-gradient-to-br from-muted/30 to-muted/10 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-12 text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Building2 className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-4 max-w-md mx-auto">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              No Properties Yet
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              You haven&apos;t added any properties to your portfolio yet. Start
              building your rental business today and reach thousands of
              potential guests.
            </p>
          </div>
          <div className="pt-2">
            <Button
              asChild
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-300 gap-2 px-8"
            >
              <Link href="/dashboard/tenant/properties/add">
                <Plus className="h-5 w-5" />
                Add Your First Property
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const EmptyState = ({
  hasActiveFilters,
  onRefresh,
  onResetFilters,
}: EmptyStateProps) => {
  return (
    <Card className="border border-dashed border-border/70 bg-gradient-to-br from-muted/20 to-muted/5">
      <CardContent className="space-y-6 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
          <Search className="h-8 w-8" />
        </div>
        <div className="space-y-3 max-w-md mx-auto">
          <h3 className="text-xl font-semibold">No properties found</h3>
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? "We couldn't find any properties matching your search criteria. Try adjusting your filters or search terms."
              : "No properties available at the moment."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={onRefresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh data
          </Button>
          {hasActiveFilters && (
            <Button onClick={onResetFilters} className="gap-2">
              Reset filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
