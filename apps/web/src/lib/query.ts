"use client";

import type { UseQueryOptions } from "@tanstack/react-query";

export const defaultQueryOptions: Partial<UseQueryOptions> = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
};

export default defaultQueryOptions;
