"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { FiltersForm } from "./filters-form";
import type { GetPropertiesQuery } from "@/schemas";

export interface FiltersBarProps {
  params: GetPropertiesQuery;
  onChange: (updates: Partial<GetPropertiesQuery>) => void;
}

export function FiltersBar({ params, onChange }: FiltersBarProps) {
  const [nameFilter, setNameFilter] = useState(params.name || "");
  const [categoryFilter, setCategoryFilter] = useState(params.category || "");

  useEffect(() => {
    setNameFilter(params.name || "");
    setCategoryFilter(params.category || "");
  }, [params.name, params.category]);

  return (
    <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center ">
              <Filter className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Refine your search
              </h2>
              <p className="text-sm text-muted-foreground">
                Filter by category, name, or sort order.
              </p>
            </div>
          </div>
        </div>
        <FiltersForm
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          params={params}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
