"use client";

import { useSession } from "next-auth/react";
import { api } from "@/lib/axios";
import useApiQuery from "@/hooks/useApiQuery";
import { getErrorMessage } from "@/lib/errors";

import type { Property as PropertyType } from "@/schemas";

export function useProperty(propertyId: string) {
  const { status } = useSession();

  const queryKey = ["property", propertyId] as const;

  const { data, isPending, isFetching, error, refetch } = useApiQuery<
    PropertyType,
    Error
  >({
    queryKey,
    enabled: Boolean(propertyId),
    queryFn: async () => {
      const res = await api.get<{ message?: string; data: PropertyType }>(
        `/properties/id/${propertyId}`
      );
      return res.data.data;
    },
    errorMessage: "Failed to fetch property",
  });

  const loading = status === "loading" ? true : isPending || isFetching;

  return {
    property: data ?? null,
    loading,
    error: error ? getErrorMessage(error, "Failed to fetch property") : null,
    refetch,
  } as const;
}
