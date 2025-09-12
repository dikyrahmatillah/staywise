"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Tag } from "lucide-react";
import React from "react";
import type { DefaultPropertyCategory } from "@repo/schemas";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Default Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-600">Error</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Default Categories
            </h3>
            <p className="text-muted-foreground">
              No default categories are available at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              These are system-provided categories available to all users.
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
