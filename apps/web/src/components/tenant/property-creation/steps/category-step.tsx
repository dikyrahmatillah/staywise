import { usePropertyCreation } from "../property-creation-context";
import CategorySelector from "@/components/tenant/categories/category-selector";
import { useCategorySelection } from "@/hooks/useCategorySelection";

export function CategoryStep() {
  const { formData, updateFormData } = usePropertyCreation();

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
    initialDefaultId: formData.propertyCategoryId ?? "",
    initialCustomId: formData.customCategoryId ?? "",
    onSelectionChange: (selection) => {
      updateFormData(selection);
    },
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
