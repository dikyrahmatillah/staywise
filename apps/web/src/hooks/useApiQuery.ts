"use client";

import { useEffect } from "react";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import defaultQueryOptions from "@/lib/query";

type Params<TData, TError> = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  errorMessage?: string;
  options?: UseQueryOptions<TData, TError, TData, readonly unknown[]>;
};

export function useApiQuery<TData, TError = Error>({
  queryKey,
  queryFn,
  enabled = true,
  errorMessage,
  options,
}: Params<TData, TError>) {
  const baseOptions = defaultQueryOptions as UseQueryOptions<
    TData,
    TError,
    TData,
    readonly unknown[]
  >;

  const mergedOptions = {
    ...(baseOptions ?? {}),
    ...(options ?? {}),
  } as unknown as Omit<
    UseQueryOptions<TData, TError, TData, readonly unknown[]>,
    "queryKey"
  >;

  const res = useQuery<TData, TError, TData, readonly unknown[]>({
    queryKey,
    queryFn,
    enabled,
    ...mergedOptions,
  });

  const queryError = res.error;

  useEffect(() => {
    if (queryError) {
      try {
        toast.error(
          getErrorMessage(
            queryError as unknown,
            errorMessage ?? "Failed to load data"
          )
        );
      } catch {}
    }
  }, [queryError, errorMessage]);

  return res;
}

export default useApiQuery;
