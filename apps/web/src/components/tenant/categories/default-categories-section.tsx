"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Tag } from "lucide-react";
import Ellipsis from "@/components/ui/ellipsis";
import React from "react";
import type { DefaultPropertyCategory } from "@/schemas";

interface DefaultCategoriesSectionProps {
  categories: DefaultPropertyCategory[];
  loading: boolean;
  error: string | null;
}

export function DefaultCategoriesSection({
  categories,
  loading,
  error,
}: DefaultCategoriesSectionProps) {
  const hasCategories = categories.length > 0;

  return (
    <Card className="h-full border border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold tracking-tight">
              <span className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Default Categories
              </span>
            </CardTitle>
            <CardDescription>
              These curated tags come ready-made to help you get started
              instantly.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="self-start rounded-full px-3 py-1 text-xs font-medium"
          >
            {categories.length} Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Ellipsis size={8} className="text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-destructive">
                Unable to load categories
              </h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : !hasCategories ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/30 p-8 text-center">
            <Tag className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">No Default Categories</h3>
              <p className="text-sm text-muted-foreground">
                Default categories are not available at the moment. Check back
                soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Available presets
            </p>
            <ScrollArea className="max-h-64 pr-1">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-sm"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
