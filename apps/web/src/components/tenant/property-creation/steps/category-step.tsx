"use client";

import { useState, useEffect } from "react";
import { usePropertyCreation } from "../property-creation-context";
import {
  useCustomCategories,
  useDefaultCategories,
} from "@/hooks/useCategories";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Check } from "lucide-react";

export function CategoryStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const { categories: customCategories, loading: customLoading } =
    useCustomCategories();
  const { categories: defaultCategories, loading: defaultLoading } =
    useDefaultCategories();
  const [selectedOption, setSelectedOption] = useState<
    "default" | "custom" | "new"
  >("default");
  const [selectedDefaultCategory, setSelectedDefaultCategory] =
    useState<string>("");
  const [selectedCustomCategory, setSelectedCustomCategory] =
    useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState("");

  // Initialize selection based on existing form data
  useEffect(() => {
    if (formData.propertyCategoryId) {
      setSelectedOption("default");
      setSelectedDefaultCategory(formData.propertyCategoryId);
    } else if (formData.customCategoryId) {
      setSelectedOption("custom");
      setSelectedCustomCategory(formData.customCategoryId);
    } else if (formData.customCategory) {
      setSelectedOption("new");
      setNewCategoryName(formData.customCategory.name);
    }
  }, [formData]);

  const handleOptionChange = (option: "default" | "custom" | "new") => {
    setSelectedOption(option);

    // Clear previous selections in form data
    updateFormData({
      propertyCategoryId: undefined,
      customCategoryId: undefined,
      customCategory: undefined,
    });
  };

  const handleDefaultCategorySelect = (categoryId: string) => {
    setSelectedDefaultCategory(categoryId);
    updateFormData({
      propertyCategoryId: categoryId,
      customCategoryId: undefined,
      customCategory: undefined,
    });
  };

  const handleCustomCategorySelect = (categoryId: string) => {
    setSelectedCustomCategory(categoryId);
    updateFormData({
      propertyCategoryId: undefined,
      customCategoryId: categoryId,
      customCategory: undefined,
    });
  };

  const handleNewCategoryChange = (name: string) => {
    setNewCategoryName(name);
    if (name.trim()) {
      updateFormData({
        propertyCategoryId: undefined,
        customCategoryId: undefined,
        customCategory: {
          name: name.trim(),
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Option Selection Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={selectedOption === "default" ? "default" : "outline"}
            onClick={() => handleOptionChange("default")}
            className="flex items-center gap-2"
          >
            {selectedOption === "default" && <Check className="w-4 h-4" />}
            Default Categories
          </Button>
          <Button
            type="button"
            variant={selectedOption === "custom" ? "default" : "outline"}
            onClick={() => handleOptionChange("custom")}
            className="flex items-center gap-2"
          >
            {selectedOption === "custom" && <Check className="w-4 h-4" />}
            My Categories
          </Button>
          <Button
            type="button"
            variant={selectedOption === "new" ? "default" : "outline"}
            onClick={() => handleOptionChange("new")}
            className="flex items-center gap-2"
          >
            {selectedOption === "new" && <Check className="w-4 h-4" />}
            Create New
          </Button>
        </div>

        {/* Default Categories */}
        {selectedOption === "default" && (
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
        )}

        {/* Custom Categories */}
        {selectedOption === "custom" && (
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Choose from your categories:
            </Label>
            {customLoading ? (
              <p className="text-sm text-gray-500">
                Loading custom categories...
              </p>
            ) : customCategories.length === 0 ? (
              <p className="text-sm text-gray-500">
                No custom categories yet. Create one by selecting &quot;Create
                New&quot;!
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
        )}

        {/* New Category */}
        {selectedOption === "new" && (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Create a new category:
            </Label>

            <div className="space-y-2">
              <Label htmlFor="newCategoryName">Category Name *</Label>
              <Input
                id="newCategoryName"
                value={newCategoryName}
                onChange={(e) => handleNewCategoryChange(e.target.value)}
                placeholder="e.g., Boutique Hotel"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
