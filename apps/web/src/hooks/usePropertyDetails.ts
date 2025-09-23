"use client";

import useApiQuery from "@/hooks/useApiQuery";
import { api } from "@/lib/axios";

type DetailResponse = {
  averageRating?: number | null;
  reviewCount?: number;
};

async function fetchPropertyDetails(slug: string) {
  const res = await api.get<{ data: DetailResponse }>(`/properties/${slug}`);
  return res.data.data as DetailResponse;
}

export function usePropertyDetails(slug?: string | null) {
  return useApiQuery<DetailResponse, Error>({
    queryKey: ["property", slug],
    queryFn: () => fetchPropertyDetails(String(slug)),
    enabled: Boolean(slug),
    errorMessage: "Failed to fetch property details",
  });
}

export default usePropertyDetails;
