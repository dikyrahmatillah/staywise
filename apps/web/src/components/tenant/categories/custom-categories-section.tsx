"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
  const hasCategories = categories.length > 0;

  return (
    <Card className="h-full border border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-semibold tracking-tight">
              <span className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Custom Categories
              </span>
            </CardTitle>
            <CardDescription>
              Craft personalised tags that match the unique features of your
              listings.
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="self-start rounded-full px-3 py-1 text-xs font-medium"
          >
            {categories.length} Created
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-destructive">
                Unable to load custom categories
              </h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : !hasCategories ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/30 p-8 text-center">
            <Edit className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                No Custom Categories yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your first custom category to highlight what makes your
                properties special.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Your collection
            </p>
            <ScrollArea className="max-h-72 pr-1">
              <div className="space-y-3">
                {categories.map((category) => {
                  const initials =
                    category.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase() ?? "")
                      .join("") || category.name.slice(0, 2).toUpperCase();

                  return (
                    <div
                      key={category.id}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 border border-border/60 bg-primary/5 text-primary">
                          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="font-medium leading-none">
                            {category.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Custom category
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 rounded-full text-muted-foreground hover:text-primary"
                          onClick={() => onEdit(category)}
                          aria-label={`Edit ${category.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 rounded-full text-muted-foreground hover:text-destructive"
                          onClick={() => onDelete(category)}
                          aria-label={`Delete ${category.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
