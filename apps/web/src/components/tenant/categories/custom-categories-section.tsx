"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Edit, Trash2 } from "lucide-react";
import type { CustomCategoryResponse } from "@repo/schemas";
interface CustomCategoriesSectionProps {
  categories: CustomCategoryResponse[];
  loading: boolean;
  error: string | null;
  onEdit: (c: CustomCategoryResponse) => void;
  onDelete: (c: CustomCategoryResponse) => void;
}

export function CustomCategoriesSection({
  categories,
  loading,
  error,
  onEdit,
  onDelete,
}: CustomCategoriesSectionProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Custom Categories
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
            <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Custom Categories</h3>
            <p className="text-muted-foreground">
              Create your first custom category to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Manage your personal property categories.
            </p>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(category)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
