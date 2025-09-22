"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import type {
  RoomAvailability,
  RoomAvailabilityApiResponse,
  BlockDatesRequest,
  UnblockDatesRequest,
} from "@/types/room";
import { api } from "@/lib/axios";
import { setAuthToken } from "@/lib/axios";

export function useRoomAvailability(roomId: string) {
  const { data: session, status } = useSession();
  const [blockedDates, setBlockedDates] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authToken = session?.user?.accessToken ?? null;

  const fetchBlockedDates = useCallback(
    async (startDate?: string, endDate?: string) => {
      if (!authToken || !roomId) return;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const res = await api.get<RoomAvailabilityApiResponse>(
          `/rooms/${roomId}/availability?${params.toString()}`
        );
        setBlockedDates(res.data.data);
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? (err.response.data.message as string)
            : "Failed to fetch blocked dates";
        console.error("fetchBlockedDates:", err);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [authToken, roomId]
  );

  const blockDates = useCallback(
    async (dates: string[]) => {
      if (!authToken) return toast.error("Authentication required");
      if (dates.length === 0) return toast.error("No dates provided to block");

      try {
        const res = await api.post<RoomAvailabilityApiResponse>(
          `/rooms/${roomId}/block`,
          { dates } as BlockDatesRequest
        );

        const newBlocked = res.data.data;
        setBlockedDates((prev) => {
          const merged = [...prev];
          newBlocked.forEach((b) => {
            const idx = merged.findIndex((m) => m.date === b.date);
            if (idx >= 0) merged[idx] = b;
            else merged.push(b);
          });
          return merged.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        });

        toast.success(
          `Blocked ${dates.length} date${dates.length > 1 ? "s" : ""}`
        );
        return newBlocked;
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? (err.response.data.message as string)
            : "Failed to block dates";
        console.error("blockDates:", err);
        toast.error(errorMessage);
        throw err;
      }
    },
    [authToken, roomId]
  );

  const unblockDates = useCallback(
    async (dates: string[]) => {
      if (!authToken) return toast.error("Authentication required");
      if (dates.length === 0)
        return toast.error("No dates provided to unblock");

      try {
        await api.post(`/rooms/${roomId}/unblock`, {
          dates,
        } as UnblockDatesRequest);
        setBlockedDates((prev) => prev.filter((p) => !dates.includes(p.date)));
        toast.success(
          `Unblocked ${dates.length} date${dates.length > 1 ? "s" : ""}`
        );
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? (err.response.data.message as string)
            : "Failed to unblock dates";
        console.error("unblockDates:", err);
        toast.error(errorMessage);
        throw err;
      }
    },
    [authToken, roomId]
  );

  const isDateBlocked = useCallback(
    (date: string) => blockedDates.some((b) => b.date === date),
    [blockedDates]
  );
  const isDateAvailable = useCallback(
    (date: string) => !isDateBlocked(date),
    [isDateBlocked]
  );

  useEffect(() => {
    setAuthToken(authToken);
    if (status === "authenticated" && authToken && roomId) {
      fetchBlockedDates();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, authToken, roomId, fetchBlockedDates]);

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
