"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
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
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => fetchProperties(params),
  });
}
