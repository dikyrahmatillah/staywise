"use client";

import { useEffect, useState } from "react";
import useApiQuery from "@/hooks/useApiQuery";
import { api } from "@/lib/axios";
import type { DetailResponse, Room } from "@/types/property-detail";

async function fetchPropertyDetails(slug: string) {
  const res = await api.get(`/properties/${slug}`);
  return res.data.data as DetailResponse;
}

async function fetchUnavailableDates(roomId: string | undefined | null) {
  if (!roomId) return null;
  const res = await api.get(`/rooms/${roomId}/unavailable-dates`);
  return res.data.data as { unavailableDates: string[] } | null;
}

export default function usePropertyDetails(
  slug?: string | null,
  initialData?: DetailResponse | null
) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  const query = useApiQuery<DetailResponse, Error>({
    queryKey: ["property", slug],
    queryFn: () => fetchPropertyDetails(String(slug)),
    enabled: Boolean(slug),
    errorMessage: "Failed to fetch property details",
    ...(initialData && { initialData }),
  });

  useEffect(() => {
    if (!query.data) return;
    if (selectedRoom) return;

    const firstRoom =
      query.data.Rooms && query.data.Rooms.length > 0
        ? query.data.Rooms[0]
        : null;
    if (firstRoom) setSelectedRoom(firstRoom as Room);
  }, [query.data, selectedRoom]);

  const unavailableQuery = useApiQuery<
    { unavailableDates: string[] } | null,
    Error
  >({
    queryKey: ["unavailable-dates", selectedRoom?.id],
    queryFn: () => fetchUnavailableDates(selectedRoom?.id ?? undefined),
    enabled: Boolean(selectedRoom?.id),
    errorMessage: "Failed to fetch unavailable dates",
  });

  useEffect(() => {
    if (unavailableQuery.data?.unavailableDates) {
      const dates = unavailableQuery.data.unavailableDates.map(
        (dateStr: string) => new Date(dateStr + "T00:00:00")
      );
      setUnavailableDates(dates);
    } else {
      setUnavailableDates([]);
    }
  }, [unavailableQuery.data]);

  return {
    ...query,
    selectedRoom,
    setSelectedRoom,
    unavailableDates,
  };
}
