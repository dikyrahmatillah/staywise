import CategorySelector from "@/components/tenant/categories/category-selector";
import { useCategorySelection } from "@/hooks/useCategorySelection";
import type { Property } from "./types";

type Props = {
  property: Property;
  onChange?: (selection: {
    propertyCategoryId?: string;
    propertyCategoryName?: string;
    customCategoryId?: string;
    customCategoryName?: string;
  }) => void;
};

export function CategoryCard({ property, onChange }: Props) {
  const {
    defaultCategories,
    customCategories,
    defaultLoading,
    customLoading,
    selectedDefault,
    selectedCustom,
    handleDefaultCategorySelect,
    handleCustomCategorySelect,
    handleCreateCategory,
    updateCustomCategory,
    deleteCustomCategory,
  } = useCategorySelection({
    initialDefaultId: property.propertyCategoryId ?? "",
    initialCustomId: property.customCategoryId ?? "",
    onSelectionChange: onChange,
  });

  return (
    <CategorySelector
      defaultCategories={defaultCategories}
      customCategories={customCategories}
      defaultLoading={defaultLoading}
      customLoading={customLoading}
      selectedDefault={selectedDefault}
      selectedCustom={selectedCustom}
      onDefaultSelect={handleDefaultCategorySelect}
      onCustomSelect={handleCustomCategorySelect}
      onCreate={handleCreateCategory}
      updateCustomCategory={updateCustomCategory}
      deleteCustomCategory={deleteCustomCategory}
    />
  );
}
