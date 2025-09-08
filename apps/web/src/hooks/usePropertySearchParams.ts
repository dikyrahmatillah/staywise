"use client";
import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { GetPropertiesQuery } from "@repo/schemas";

export function usePropertySearchParams(): [
  GetPropertiesQuery,
  (u: Partial<GetPropertiesQuery>) => void
] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchString = searchParams.toString();

  const params = useMemo<GetPropertiesQuery>(() => {
    const sp = new URLSearchParams(searchString);
    const toInt = (v: string | null) =>
      v == null || v === "" ? undefined : Number.parseInt(v, 10);
    return {
      page: toInt(sp.get("page")) || 1,
      limit: toInt(sp.get("limit")) || 12,
      location: sp.get("location") ?? undefined,
      checkIn: sp.get("checkIn") ?? undefined,
      checkOut: sp.get("checkOut") ?? undefined,
      adults: toInt(sp.get("adults")),
      children: toInt(sp.get("children")),
      guest: toInt(sp.get("guest")),
      pets: toInt(sp.get("pets")),
      name: sp.get("name") ?? undefined,
      categoryName: sp.get("categoryName") ?? undefined,
      sortBy: (sp.get("sortBy") as "name" | "price") ?? undefined,
      sortOrder: (sp.get("sortOrder") as "asc" | "desc") ?? undefined,
    };
  }, [searchString]);

  const update = useCallback(
    (updates: Partial<GetPropertiesQuery>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "")
          newParams.delete(key);
        else newParams.set(key, String(value));
      });
      if (!updates.hasOwnProperty("page")) newParams.set("page", "1");
      router.replace(`${pathname}?${newParams.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return [params, update];
}
