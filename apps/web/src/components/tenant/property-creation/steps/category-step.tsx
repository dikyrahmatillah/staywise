"use client";

import { useState, useEffect } from "react";
import { usePropertyCreation } from "../property-creation-context";
import {
  useCustomCategories,
  useDefaultCategories,
} from "@/hooks/useCategories";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export function CategoryStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const { categories: customCategories, loading: customLoading } =
    useCustomCategories();
  const { categories: defaultCategories, loading: defaultLoading } =
    useDefaultCategories();
  const [selectedDefaultCategory, setSelectedDefaultCategory] =
    useState<string>("");
  const [selectedCustomCategory, setSelectedCustomCategory] =
    useState<string>("");

  useEffect(() => {
    if (formData.propertyCategoryId) {
      setSelectedDefaultCategory(formData.propertyCategoryId);
    }
    if (formData.customCategoryId) {
      setSelectedCustomCategory(formData.customCategoryId);
    }
  }, [formData]);

  const handleDefaultCategorySelect = (categoryId: string) => {
    const next = selectedDefaultCategory === categoryId ? "" : categoryId;
    setSelectedDefaultCategory(next);
    const name = next
      ? defaultCategories.find((c) => c.id === next)?.name
      : undefined;
    updateFormData({
      propertyCategoryId: next || undefined,
      propertyCategoryName: name,
    });
  };

  const handleCustomCategorySelect = (categoryId: string) => {
    const next = selectedCustomCategory === categoryId ? "" : categoryId;
    setSelectedCustomCategory(next);
    const name = next
      ? customCategories.find((c) => c.id === next)?.name
      : undefined;
    updateFormData({
      customCategoryId: next || undefined,
      customCategoryName: name,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Categories */}
        <div className="space-y-3">
          <div className="space-y-3">
            <Label className="text-base font-medium">Choose a category:</Label>
            {defaultLoading ? (
              <p className="text-sm text-gray-500">Loading categories...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {defaultCategories.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={
                      selectedDefaultCategory === category.id
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleDefaultCategorySelect(category.id)}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm">{category.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Categories */}
          <div className="space-y-3">
            <Label className="text-base font-medium">My categories:</Label>
            {customLoading ? (
              <p className="text-sm text-gray-500">
                Loading custom categories...
              </p>
            ) : customCategories.length === 0 ? (
              <p className="text-sm text-gray-500">
                No custom categories yet. Create them in the Categories
                management page.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {customCategories.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={
                      selectedCustomCategory === category.id
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleCustomCategorySelect(category.id)}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm">{category.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
