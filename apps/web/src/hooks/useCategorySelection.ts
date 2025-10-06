import { useState, useEffect, useMemo } from "react";
import {
  useDefaultCategories,
  useCustomCategories,
} from "@/hooks/useCategories";

type CategorySelectionOptions = {
  initialDefaultId?: string;
  initialCustomId?: string;
  onSelectionChange?: (selection: {
    propertyCategoryId?: string;
    propertyCategoryName?: string;
    customCategoryId?: string;
    customCategoryName?: string;
  }) => void;
};

export function useCategorySelection(options: CategorySelectionOptions = {}) {
  const {
    initialDefaultId = "",
    initialCustomId = "",
    onSelectionChange,
  } = options;

  const { categories: defaultCategories, loading: defaultLoading } =
    useDefaultCategories();
  const {
    categories: customCategories,
    loading: customLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: refetchCustom,
  } = useCustomCategories();

  const [selectedDefault, setSelectedDefault] =
    useState<string>(initialDefaultId);
  const [selectedCustom, setSelectedCustom] = useState<string>(initialCustomId);

  useEffect(() => {
    setSelectedDefault(initialDefaultId);
    setSelectedCustom(initialCustomId);
  }, [initialDefaultId, initialCustomId]);

  const sortedDefaultCategories = useMemo(
    () =>
      [...defaultCategories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [defaultCategories]
  );

  const sortedCustomCategories = useMemo(
    () =>
      [...customCategories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [customCategories]
  );

  const handleDefaultCategorySelect = (categoryId: string) => {
    setSelectedDefault(categoryId);

    const name = defaultCategories.find((c) => c.id === categoryId)?.name;

    onSelectionChange?.({
      propertyCategoryId: categoryId,
      propertyCategoryName: name,
      customCategoryId: selectedCustom,
      customCategoryName: selectedCustom
        ? customCategories.find((c) => c.id === selectedCustom)?.name
        : undefined,
    });
  };

  const handleCustomCategorySelect = (categoryId: string) => {
    const next = selectedCustom === categoryId ? "" : categoryId;
    setSelectedCustom(next);

    const name = next
      ? customCategories.find((c) => c.id === next)?.name
      : undefined;

    onSelectionChange?.({
      customCategoryId: next,
      customCategoryName: name,
      propertyCategoryId: selectedDefault,
      propertyCategoryName: selectedDefault
        ? defaultCategories.find((c) => c.id === selectedDefault)?.name
        : undefined,
    });
  };

  const handleCreateCategory = async (name: string) => {
    const created = await createCategory({ name });
    await refetchCustom();
    setSelectedCustom(created.id);
    onSelectionChange?.({
      customCategoryId: created.id,
      customCategoryName: created.name,
      propertyCategoryId: selectedDefault || undefined,
      propertyCategoryName: selectedDefault
        ? defaultCategories.find((c) => c.id === selectedDefault)?.name
        : undefined,
    });
  };

  return {
    defaultCategories: sortedDefaultCategories,
    customCategories: sortedCustomCategories,
    defaultLoading,
    customLoading,
    selectedDefault,
    selectedCustom,
    handleDefaultCategorySelect,
    handleCustomCategorySelect,
    handleCreateCategory,
    updateCustomCategory: updateCategory,
    deleteCustomCategory: deleteCategory,
  };
}
