"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import type {
  PriceAdjustment,
  PriceAdjustmentsApiResponse,
  PriceAdjustmentApiResponse,
  CreatePriceAdjustmentRequest,
} from "@/types/room";

const createApiInstance = (accessToken?: string) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  });

  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return api;
};

export function usePriceAdjustments(roomId: string) {
  const { data: session } = useSession();
  const [priceAdjustments, setPriceAdjustments] = useState<PriceAdjustment[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceAdjustments = useCallback(async () => {
    if (!session?.user?.accessToken || !roomId) return;

    setLoading(true);
    setError(null);

    try {
      const api = createApiInstance(session.user.accessToken);
      const response = await api.get<PriceAdjustmentsApiResponse>(
        `/rooms/${roomId}/price-adjustments`
      );
      setPriceAdjustments(response.data.data);
    } catch (err) {
      console.error("Error fetching price adjustments:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch price adjustments";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [roomId, session?.user?.accessToken]);

  const createPriceAdjustment = useCallback(
    async (adjustmentData: CreatePriceAdjustmentRequest) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        const response = await api.post<PriceAdjustmentApiResponse>(
          `/rooms/${roomId}/price-adjustments`,
          adjustmentData
        );
        setPriceAdjustments((prev) => [...prev, response.data.data]);
        toast.success("Price adjustment created successfully");
        return response.data.data;
      } catch (err) {
        console.error("Error creating price adjustment:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to create price adjustment";
        toast.error(errorMessage);
        throw err;
      }
    },
    [roomId, session?.user?.accessToken]
  );

  const updatePriceAdjustment = useCallback(
    async (
      adjustmentId: string,
      adjustmentData: Partial<CreatePriceAdjustmentRequest>
    ) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        const response = await api.put<PriceAdjustmentApiResponse>(
          `/rooms/price-adjustments/${adjustmentId}`,
          adjustmentData
        );
        setPriceAdjustments((prev) =>
          prev.map((adjustment) =>
            adjustment.id === adjustmentId ? response.data.data : adjustment
          )
        );
        toast.success("Price adjustment updated successfully");
        return response.data.data;
      } catch (err) {
        console.error("Error updating price adjustment:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to update price adjustment";
        toast.error(errorMessage);
        throw err;
      }
    },
    [session?.user?.accessToken]
  );

  const deletePriceAdjustment = useCallback(
    async (adjustmentId: string) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        await api.delete(`/rooms/price-adjustments/${adjustmentId}`);
        setPriceAdjustments((prev) =>
          prev.filter((adjustment) => adjustment.id !== adjustmentId)
        );
        toast.success("Price adjustment deleted successfully");
      } catch (err) {
        console.error("Error deleting price adjustment:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to delete price adjustment";
        toast.error(errorMessage);
        throw err;
      }
    },
    [session?.user?.accessToken]
  );

  return {
    priceAdjustments,
    loading,
    error,
    fetchPriceAdjustments,
    createPriceAdjustment,
    updatePriceAdjustment,
    deletePriceAdjustment,
  };
}
