"use client";

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApiQuery from "@/hooks/useApiQuery";
import { api } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import {
  CustomCategoryResponse,
  DefaultPropertyCategory,
  CreateCustomCategoryInput,
  UpdateCustomCategoryInput,
  CustomCategoryListResponse,
  PropertyCategoryListResponse,
} from "@repo/schemas";

export function useCustomCategories() {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const queryKey = ["customCategories"] as const;

  const {
    data: categoriesData,
    isPending,
    isFetching,
    error: categoriesError,
    refetch,
  } = useApiQuery<CustomCategoryResponse[], Error>({
    queryKey,
    enabled: status !== "loading",
    queryFn: async () => {
      const res = await api.get<{
        message?: string;
        data: CustomCategoryListResponse;
      }>("/categories/custom");
      return res.data.data.categories;
    },
    errorMessage: "Failed to fetch categories",
  });

  const categories: CustomCategoryResponse[] = categoriesData ?? [];
  const loading =
    status === "loading"
      ? true
      : isPending || (isFetching && categories.length === 0);
  const error = categoriesError
    ? getErrorMessage(categoriesError, "Failed to fetch categories")
    : null;

  const createMutation = useMutation<
    CustomCategoryResponse,
    unknown,
    CreateCustomCategoryInput
  >({
    mutationFn: async (input) => {
      const res = await api.post<{
        message?: string;
        data: CustomCategoryResponse;
      }>("/categories/custom", input);
      return res.data.data;
    },
    onSuccess: () => toast.success("Category created successfully"),
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Failed to create category")),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation<
    CustomCategoryResponse,
    unknown,
    { id: string; data: UpdateCustomCategoryInput }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await api.put<{
        message?: string;
        data: CustomCategoryResponse;
      }>(`/categories/custom/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => toast.success("Category updated successfully"),
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Failed to update category")),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation<void, unknown, string>({
    mutationFn: async (id) => {
      await api.delete(`/categories/custom/${id}`);
    },
    onSuccess: () => toast.success("Category deleted successfully"),
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Failed to delete category")),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const fetchCategories = () => refetch();

  const createCategory = async (input: CreateCustomCategoryInput) => {
    try {
      return await createMutation.mutateAsync(input);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to create category"));
    }
  };

  const updateCategory = async (
    id: string,
    input: UpdateCustomCategoryInput
  ) => {
    try {
      return await updateMutation.mutateAsync({ id, data: input });
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to update category"));
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      return await deleteMutation.mutateAsync(id);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to delete category"));
    }
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}

export function useDefaultCategories() {
  const { status } = useSession();
  const queryKey = ["defaultCategories"] as const;

  const {
    data: categoriesData,
    isPending,
    isFetching,
    error: categoriesError,
    refetch,
  } = useApiQuery<DefaultPropertyCategory[], Error>({
    queryKey,
    enabled: status !== "loading",
    queryFn: async () => {
      const res = await api.get<{
        message?: string;
        data: PropertyCategoryListResponse;
      }>("/categories/default");
      return res.data.data.categories;
    },
    errorMessage: "Failed to fetch categories",
  });

  const categories: DefaultPropertyCategory[] = categoriesData ?? [];
  const loading =
    status === "loading"
      ? true
      : isPending || (isFetching && categories.length === 0);
  const error = categoriesError
    ? getErrorMessage(categoriesError, "Failed to fetch categories")
    : null;

  return {
    categories,
    loading,
    error,
    refetch: () => refetch(),
  };
}
