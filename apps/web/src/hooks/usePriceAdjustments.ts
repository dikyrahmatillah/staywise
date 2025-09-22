"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import type {
  PriceAdjustment,
  PriceAdjustmentsApiResponse,
  PriceAdjustmentApiResponse,
  CreatePriceAdjustmentRequest,
} from "@/types/room";
import { setAuthToken } from "@/lib/axios";

function getErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return fallback;
}

export function usePriceAdjustments(roomId: string) {
  const { data: session, status } = useSession();
  const [priceAdjustments, setPriceAdjustments] = useState<PriceAdjustment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authToken = session?.user?.accessToken ?? null;

  const fetchPriceAdjustments = useCallback(async () => {
    if (!authToken || !roomId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get<PriceAdjustmentsApiResponse>(
        `/rooms/${roomId}/price-adjustments`
      );
      setPriceAdjustments(res.data.data);
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to fetch price adjustments");
      console.error("fetchPriceAdjustments:", err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [authToken, roomId]);

  const createPriceAdjustment = useCallback(
    async (adjustmentData: CreatePriceAdjustmentRequest) => {
      if (!authToken) return toast.error("Authentication required");

      try {
        const res = await api.post<PriceAdjustmentApiResponse>(
          `/rooms/${roomId}/price-adjustments`,
          adjustmentData
        );
        setPriceAdjustments((p) => [...p, res.data.data]);
        toast.success("Price adjustment created successfully");
        return res.data.data;
      } catch (err) {
        const msg = getErrorMessage(err, "Failed to create price adjustment");
        console.error("createPriceAdjustment:", err);
        toast.error(msg);
        throw err;
      }
    },
    [authToken, roomId]
  );

  const updatePriceAdjustment = useCallback(
    async (
      adjustmentId: string,
      adjustmentData: Partial<CreatePriceAdjustmentRequest>
    ) => {
      if (!authToken) return toast.error("Authentication required");

      try {
        const res = await api.put<PriceAdjustmentApiResponse>(
          `/rooms/price-adjustments/${adjustmentId}`,
          adjustmentData
        );
        setPriceAdjustments((prev) =>
          prev.map((adjustment) =>
            adjustment.id === adjustmentId ? res.data.data : adjustment
          )
        );
        toast.success("Price adjustment updated successfully");
        return res.data.data;
      } catch (err) {
        const msg = getErrorMessage(err, "Failed to update price adjustment");
        console.error("updatePriceAdjustment:", err);
        toast.error(msg);
        throw err;
      }
    },
    [authToken]
  );

  const deletePriceAdjustment = useCallback(
    async (adjustmentId: string) => {
      if (!authToken) return toast.error("Authentication required");

      try {
        await api.delete(`/rooms/price-adjustments/${adjustmentId}`);
        setPriceAdjustments((prev) =>
          prev.filter((adjustment) => adjustment.id !== adjustmentId)
        );
        toast.success("Price adjustment deleted successfully");
      } catch (err) {
        const msg = getErrorMessage(err, "Failed to delete price adjustment");
        console.error("deletePriceAdjustment:", err);
        toast.error(msg);
        throw err;
      }
    },
    [authToken]
  );

  useEffect(() => {
    if (status === "loading") return;

    setAuthToken(authToken);

    if (status === "authenticated" && authToken && roomId) {
      fetchPriceAdjustments();
    } else {
      setLoading(false);
    }
  }, [status, authToken, roomId, fetchPriceAdjustments]);

  return {
    priceAdjustments,
    loading,
    isEmpty: !loading && priceAdjustments.length === 0,
    error,
    fetchPriceAdjustments,
    createPriceAdjustment,
    updatePriceAdjustment,
    deletePriceAdjustment,
  };
}
