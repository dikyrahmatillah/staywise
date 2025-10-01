"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search } from "lucide-react";

interface RoomManagementFiltersProps {
  searchTerm: string;
  bedTypeFilter: string;
  bedTypes: string[];
  onSearchChange: (value: string) => void;
  onBedTypeChange: (value: string) => void;
  onRefresh: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  hasRooms: boolean;
  loading?: boolean;
}

export const RoomManagementFilters = ({
  searchTerm,
  bedTypeFilter,
  bedTypes,
  onSearchChange,
  onBedTypeChange,
  onRefresh,
  onResetFilters,
  hasActiveFilters,
  hasRooms,
}: RoomManagementFiltersProps) => {
  const formatBedType = (type: string) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  if (!hasRooms) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name or description"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={bedTypeFilter}
            onValueChange={onBedTypeChange}
            disabled={bedTypes.length === 0}
          >
            <SelectTrigger className="w-full rounded-full border border-border/70 bg-card/60 text-sm sm:w-60">
              <SelectValue placeholder="All bed types" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              <SelectItem value="all">All bed types</SelectItem>
              {bedTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {formatBedType(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Card className="border border-dashed border-border/70 bg-card/70 text-center">
          <CardContent className="space-y-4 p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">No rooms found</h3>
              <p className="text-sm text-muted-foreground">
                Try a different keyword or adjust your bed type filter to see
                your rooms.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={onRefresh} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh data
              </Button>
              <Button onClick={onResetFilters} className="sm:w-auto">
                Reset filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
