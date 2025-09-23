"use client";

import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type {
  RoomAvailability,
  RoomAvailabilityApiResponse,
  MarkDatesUnavailableRequest,
  UnmarkDatesUnavailableRequest,
} from "@/types/room";
import { api } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApiQuery from "@/hooks/useApiQuery";

export function useRoomAvailability(roomId: string) {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const [range, setRange] = useState<{ startDate?: string; endDate?: string }>(
    {}
  );

  const enabled = Boolean(roomId);
  const baseKey = useMemo(
    () => ["roomAvailability", roomId] as const,
    [roomId]
  );
  const queryKey = useMemo(
    () =>
      range.startDate || range.endDate
        ? ([...baseKey, range] as const)
        : baseKey,
    [baseKey, range]
  );

  const {
    data: availabilityData,
    isPending,
    isFetching,
    error: availabilityError,
    refetch,
  } = useApiQuery<RoomAvailability[], Error>({
    queryKey,
    enabled,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (range.startDate) params.append("startDate", range.startDate);
      if (range.endDate) params.append("endDate", range.endDate);
      const suffix = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<RoomAvailabilityApiResponse>(
        `/rooms/${roomId}/availability${suffix}`
      );
      return res.data.data;
    },
    errorMessage: "Failed to fetch unavailable dates",
  });

  const unavailableDates: RoomAvailability[] = useMemo(
    () => availabilityData ?? [],
    [availabilityData]
  );
  const loading =
    status === "loading"
      ? true
      : isPending || (isFetching && unavailableDates.length === 0);
  const error = availabilityError
    ? getErrorMessage(availabilityError, "Failed to fetch unavailable dates")
    : null;

  const invalidateAllAvailability = () =>
    queryClient.invalidateQueries({ queryKey: baseKey, exact: false });

  const markUnavailableDatesMutation = useMutation<
    RoomAvailability[],
    unknown,
    string[]
  >({
    mutationFn: async (dates) => {
      if (!dates?.length)
        throw new Error("No dates provided to mark unavailable");
      const res = await api.post<RoomAvailabilityApiResponse>(
        `/rooms/${roomId}/block`,
        { dates } as MarkDatesUnavailableRequest
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      const count = variables?.length ?? 0;
      toast.success(`Marked ${count} date${count > 1 ? "s" : ""} unavailable`);
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Failed to mark dates unavailable")),
    onSettled: () => {
      invalidateAllAvailability();
    },
  });

  const unmarkUnavailableDatesMutation = useMutation<void, unknown, string[]>({
    mutationFn: async (dates) => {
      if (!dates?.length)
        throw new Error("No dates provided to unmark unavailable");
      await api.post(`/rooms/${roomId}/unblock`, {
        dates,
      } as UnmarkDatesUnavailableRequest);
    },
    onSuccess: (_data, variables) => {
      const count = variables?.length ?? 0;
      toast.success(`Marked ${count} date${count > 1 ? "s" : ""} available`);
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Failed to unmark dates unavailable")),
    onSettled: () => {
      invalidateAllAvailability();
    },
  });

  const fetchUnavailableDates = useCallback(
    (startDate?: string, endDate?: string) => {
      setRange({ startDate, endDate });
      return refetch();
    },
    [refetch]
  );

  const markDatesUnavailable = (dates: string[]) =>
    markUnavailableDatesMutation.mutateAsync(dates);
  const unmarkDatesUnavailable = (dates: string[]) =>
    unmarkUnavailableDatesMutation.mutateAsync(dates);

  const isDateUnavailable = useCallback(
    (date: string) => unavailableDates.some((b) => b.date === date),
    [unavailableDates]
  );
  const isDateAvailable = useCallback(
    (date: string) => !isDateUnavailable(date),
    [isDateUnavailable]
  );

  return {
    unavailableDates,
    loading,
    isEmpty: !loading && unavailableDates.length === 0,
    error,
    fetchUnavailableDates,
    markDatesUnavailable,
    unmarkDatesUnavailable,
    isDateUnavailable,
    isDateAvailable,
  };
}
