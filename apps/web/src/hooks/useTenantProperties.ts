"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import useApiQuery from "@/hooks/useApiQuery";
import { toast } from "sonner";
import type { PropertyResponse, RoomResponse } from "@repo/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";

type TenantProperty = PropertyResponse & {
  Pictures?: { imageUrl: string; note?: string }[];
  Rooms?: RoomResponse[];
  _count?: { Bookings?: number; Reviews?: number };
};

export function useTenantProperties(tenantId: string) {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const enabled = Boolean(tenantId);
  const queryKey = ["tenant-properties", tenantId] as const;

  const {
    data: propertiesData,
    isPending,
    isFetching,
    error: queryError,
    refetch,
  } = useApiQuery<TenantProperty[], Error>({
    queryKey,
    enabled,
    queryFn: async () => {
      const res = await api.get<{ message?: string; data: TenantProperty[] }>(
        `/properties/tenant/${tenantId}`
      );
      return res.data.data || [];
    },
    errorMessage: "Failed to load properties",
  });

  const properties: TenantProperty[] = useMemo(
    () => propertiesData ?? [],
    [propertiesData]
  );
  const loading =
    status === "loading"
      ? true
      : isPending || (isFetching && properties.length === 0);
  const error = queryError
    ? getErrorMessage(queryError, "Failed to load properties")
    : null;

  const deleteMutation = useMutation<void, unknown, string>({
    mutationFn: async (propertyId) => {
      await api.delete(`/properties/id/${propertyId}`);
    },
    onSuccess: () => {
      toast.success("Property deleted successfully");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to delete property"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteProperty = (propertyId: string) =>
    deleteMutation.mutateAsync(propertyId);

  return {
    properties,
    loading,
    error,
    refetch,
    deleteProperty,
  };
}
