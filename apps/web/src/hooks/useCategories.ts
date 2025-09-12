"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import {
  CustomCategoryResponse,
  DefaultPropertyCategory,
  CreateCustomCategoryInput,
  UpdateCustomCategoryInput,
  CustomCategoryListResponse,
  PropertyCategoryListResponse,
} from "@repo/schemas";

export function useCustomCategories() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<CustomCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!session?.user?.accessToken) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      const resp = await api.get<{
        message?: string;
        data: CustomCategoryListResponse;
      }>("/categories/custom", {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });

      setCategories(resp.data.data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.accessToken]);

  const createCategory = async (input: CreateCustomCategoryInput) => {
    try {
      if (!session?.user?.accessToken) throw new Error("Unauthorized");

      const resp = await api.post<{
        message?: string;
        data: CustomCategoryResponse;
      }>("/categories/custom", input, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setCategories((prev) => [...prev, resp.data.data]);
      return resp.data.data;
    } catch (err) {
      throw err;
    }
  };

  const updateCategory = async (
    id: string,
    input: UpdateCustomCategoryInput
  ) => {
    try {
      if (!session?.user?.accessToken) throw new Error("Unauthorized");

      const resp = await api.put<{
        message?: string;
        data: CustomCategoryResponse;
      }>(`/categories/custom/${id}`, input, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? resp.data.data : cat))
      );
      return resp.data.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      if (!session?.user?.accessToken) throw new Error("Unauthorized");

      await api.delete(`/categories/custom/${id}`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
  const { data: session } = useSession();
  const [categories, setCategories] = useState<DefaultPropertyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!session?.user?.accessToken) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }

      const resp = await api.get<{
        message?: string;
        data: PropertyCategoryListResponse;
      }>("/categories/default", {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setCategories(resp.data.data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.accessToken]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
