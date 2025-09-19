"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

type DetailResponse = {
  averageRating?: number | null;
  reviewCount?: number;
};

async function fetchPropertyDetails(slug: string) {
  const res = await api.get(`/properties/${slug}`);
  return res.data.data as DetailResponse;
}

export function usePropertyDetails(slug?: string | null) {
  return useQuery<DetailResponse, Error>({
    queryKey: ["property", slug],
    queryFn: () => fetchPropertyDetails(String(slug)),
    enabled: Boolean(slug),
  });
}

export default usePropertyDetails;
