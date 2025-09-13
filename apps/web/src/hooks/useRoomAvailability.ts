"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import type {
  RoomAvailability,
  RoomAvailabilityApiResponse,
  BlockDatesRequest,
  UnblockDatesRequest,
} from "@/types/room";

const createApiInstance = (accessToken?: string) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  });

  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return api;
};

export function useRoomAvailability(roomId: string) {
  const { data: session } = useSession();
  const [blockedDates, setBlockedDates] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlockedDates = useCallback(
    async (startDate?: string, endDate?: string) => {
      if (!session?.user?.accessToken || !roomId) return;

      setLoading(true);
      setError(null);

      try {
        const api = createApiInstance(session.user.accessToken);
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response = await api.get<RoomAvailabilityApiResponse>(
          `/rooms/${roomId}/availability?${params.toString()}`
        );
        console.log("Fetched blocked dates:", response.data.data);
        setBlockedDates(response.data.data);
      } catch (err) {
        console.error("Error fetching blocked dates:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to fetch blocked dates";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [roomId, session?.user?.accessToken]
  );

  const blockDates = useCallback(
    async (dates: string[]) => {
      if (!session?.user?.accessToken || !roomId) {
        toast.error("Authentication required");
        return;
      }

      if (dates.length === 0) {
        toast.error("No dates provided to block");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        const response = await api.post<RoomAvailabilityApiResponse>(
          `/rooms/${roomId}/block`,
          { dates } as BlockDatesRequest
        );

        // Update local state with newly blocked dates
        const newBlockedDates = response.data.data;
        console.log("New blocked dates from API:", newBlockedDates);
        setBlockedDates((prev) => {
          const updated = [...prev];

          newBlockedDates.forEach((blocked) => {
            const existingIndex = updated.findIndex(
              (item) => item.date === blocked.date
            );

            if (existingIndex >= 0) {
              updated[existingIndex] = blocked;
            } else {
              updated.push(blocked);
            }
          });

          const result = updated.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          console.log("Updated blocked dates state:", result);
          return result;
        });

        toast.success(
          `Blocked ${dates.length} date${dates.length > 1 ? "s" : ""}`
        );
        return newBlockedDates;
      } catch (err) {
        console.error("Error blocking dates:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to block dates";
        toast.error(errorMessage);
        throw err;
      }
    },
    [roomId, session?.user?.accessToken]
  );

  const unblockDates = useCallback(
    async (dates: string[]) => {
      if (!session?.user?.accessToken || !roomId) {
        toast.error("Authentication required");
        return;
      }

      if (dates.length === 0) {
        toast.error("No dates provided to unblock");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        await api.post(`/rooms/${roomId}/unblock`, {
          dates,
        } as UnblockDatesRequest);

        // Remove unblocked dates from local state
        setBlockedDates((prev) =>
          prev.filter((item) => !dates.includes(item.date))
        );

        toast.success(
          `Unblocked ${dates.length} date${dates.length > 1 ? "s" : ""}`
        );
      } catch (err) {
        console.error("Error unblocking dates:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to unblock dates";
        toast.error(errorMessage);
        throw err;
      }
    },
    [roomId, session?.user?.accessToken]
  );

  const isDateBlocked = useCallback(
    (date: string) => {
      const result = blockedDates.some((item) => item.date === date);
      console.log(`Checking if ${date} is blocked:`, result);
      console.log(
        "Available blocked dates:",
        blockedDates.map((d) => d.date)
      );
      return result;
    },
    [blockedDates]
  );

  const isDateAvailable = useCallback(
    (date: string) => {
      return !isDateBlocked(date);
    },
    [isDateBlocked]
  );

  return {
    blockedDates,
    loading,
    error,
    fetchBlockedDates,
    blockDates,
    unblockDates,
    isDateBlocked,
    isDateAvailable,
  };
}
