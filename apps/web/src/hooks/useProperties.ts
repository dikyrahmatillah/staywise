"use client";

import useApiQuery from "@/hooks/useApiQuery";
import { api } from "@/lib/axios";
import type { Property } from "@/types/property";
import type { ApiListResponse } from "@/types/api";
import type { GetPropertiesQuery } from "@repo/schemas";

async function fetchProperties(params: GetPropertiesQuery = {}) {
  const res = await api.get<ApiListResponse<Property>>("/properties", {
    params,
  });
  return res.data;
}

export function useProperties(params: GetPropertiesQuery = {}) {
  return useApiQuery<ApiListResponse<Property>, Error>({
    queryKey: ["properties", params],
    queryFn: () => fetchProperties(params),
    silent: true,
  });
}
