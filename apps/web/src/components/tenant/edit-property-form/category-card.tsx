import CategorySelector from "@/components/tenant/categories/category-selector";
import { useCategorySelection } from "@/hooks/useCategorySelection";
import type { Property } from "./types";

type Props = {
  property: Property;
};

export function CategoryCard({ property }: Props) {
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
