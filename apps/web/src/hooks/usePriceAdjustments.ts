"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import type {
  PriceAdjustment,
  PriceAdjustmentsApiResponse,
  PriceAdjustmentApiResponse,
  CreatePriceAdjustmentRequest,
} from "@/types/room";
import useAuthToken from "@/hooks/useAuthToken";
import useApiQuery from "@/hooks/useApiQuery";
import { getErrorMessage } from "@/lib/errors";

export function usePriceAdjustments(roomId: string) {
  const { data: session, status } = useSession();
  const authToken = session?.user?.accessToken ?? null;

  useAuthToken(session);

  const queryKey = useMemo(
    () => ["rooms", roomId, "price-adjustments"] as const,
    [roomId]
  );

  const query = useApiQuery<PriceAdjustment[], Error>({
    queryKey,
    queryFn: async () => {
      const res = await api.get<PriceAdjustmentsApiResponse>(
        `/rooms/${roomId}/price-adjustments`
      );
      return res.data.data;
    },
    enabled: status === "authenticated" && !!authToken && !!roomId,
    errorMessage: "Failed to fetch price adjustments",
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation<
    PriceAdjustment,
    unknown,
    CreatePriceAdjustmentRequest
  >({
    mutationFn: async (adjustmentData: CreatePriceAdjustmentRequest) => {
      if (!authToken) throw new Error("Authentication required");
      const res = await api.post<PriceAdjustmentApiResponse>(
        `/rooms/${roomId}/price-adjustments`,
        adjustmentData
      );
      return res.data.data;
    },
    onSuccess(newItem: PriceAdjustment) {
      queryClient.setQueryData<PriceAdjustment[] | undefined>(queryKey, (old) =>
        old ? [...old, newItem] : [newItem]
      );
      toast.success("Price adjustment created successfully");
    },
    onError(err: unknown) {
      const msg = getErrorMessage(err, "Failed to create price adjustment");
      toast.error(msg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation<
    PriceAdjustment,
    unknown,
    {
      adjustmentId: string;
      adjustmentData: Partial<CreatePriceAdjustmentRequest>;
    }
  >({
    mutationFn: async ({ adjustmentId, adjustmentData }) => {
      if (!authToken) throw new Error("Authentication required");
      const res = await api.put<PriceAdjustmentApiResponse>(
        `/rooms/price-adjustments/${adjustmentId}`,
        adjustmentData
      );
      return res.data.data;
    },
    onSuccess(updated: PriceAdjustment) {
      queryClient.setQueryData<PriceAdjustment[] | undefined>(
        queryKey,
        (old) =>
          old?.map((item) => (item.id === updated.id ? updated : item)) ?? [
            updated,
          ]
      );
      toast.success("Price adjustment updated successfully");
    },
    onError(err: unknown) {
      const msg = getErrorMessage(err, "Failed to update price adjustment");
      toast.error(msg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation<string, unknown, string>({
    mutationFn: async (adjustmentId: string) => {
      if (!authToken) throw new Error("Authentication required");
      await api.delete(`/rooms/price-adjustments/${adjustmentId}`);
      return adjustmentId;
    },
    onSuccess(deletedId: string) {
      queryClient.setQueryData<PriceAdjustment[] | undefined>(queryKey, (old) =>
        old?.filter((a) => a.id !== deletedId)
      );
      toast.success("Price adjustment deleted successfully");
    },
    onError(err: unknown) {
      const msg = getErrorMessage(err, "Failed to delete price adjustment");
      toast.error(msg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    priceAdjustments: query.data ?? [],
    loading: query.isLoading,
    error: query.error
      ? getErrorMessage(query.error, "Failed to fetch price adjustments")
      : null,
    refetch: query.refetch,
    createPriceAdjustment: createMutation.mutateAsync,
    updatePriceAdjustment: (
      adjustmentId: string,
      adjustmentData: Partial<CreatePriceAdjustmentRequest>
    ) => updateMutation.mutateAsync({ adjustmentId, adjustmentData }),
    deletePriceAdjustment: deleteMutation.mutateAsync,
  };
}
