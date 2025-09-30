"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import defaultQueryOptions from "@/lib/query";

type Params<TData, TError> = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  errorMessage?: string;
  silent?: boolean;
  options?: UseQueryOptions<TData, TError, TData, readonly unknown[]>;
};

export function useApiQuery<TData, TError = Error>({
  queryKey,
  queryFn,
  enabled = true,
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

  return res;
}

export default useApiQuery;
