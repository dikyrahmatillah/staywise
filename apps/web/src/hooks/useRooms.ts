"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { Room, RoomsApiResponse, RoomApiResponse } from "@/types/room";
import { CreateRoomInput, UpdateRoomInput } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errors";
import { api } from "@/lib/axios";

export function useRooms(propertyId: string) {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const enabled = Boolean(propertyId);
  const queryKey = ["rooms", propertyId] as const;

  const {
    data: roomsData,
    isPending,
    isFetching,
    error: roomsError,
    refetch,
  } = useQuery<Room[], Error>({
    queryKey,
    enabled,
    queryFn: async () => {
      const res = await api.get<RoomsApiResponse>(
        `/rooms/property/${propertyId}`
      );
      return res.data.data;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (roomsError) {
      toast.error(getErrorMessage(roomsError, "Failed to fetch rooms"));
    }
  }, [roomsError]);

  const rooms: Room[] = roomsData ?? [];
  const loading =
    status === "loading"
      ? true
      : isPending || (isFetching && rooms.length === 0);
  const error = roomsError
    ? getErrorMessage(roomsError, "Failed to fetch rooms")
    : null;

  const createRoomMutation = useMutation<
    Room,
    unknown,
    CreateRoomInput | FormData
  >({
    mutationFn: async (roomData) => {
      const res = await api.post<RoomApiResponse>(
        `/rooms/property/${propertyId}`,
        roomData
      );
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Room created successfully");
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Failed to create room")),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateRoomMutation = useMutation<
    Room,
    unknown,
    { roomId: string; data: UpdateRoomInput | FormData }
  >({
    mutationFn: async ({ roomId, data }) => {
      const res = await api.put<RoomApiResponse>(`/rooms/${roomId}`, data);
      return res.data.data;
    },
    onSuccess: () => toast.success("Room updated successfully"),
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Failed to update room")),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteRoomMutation = useMutation<void, unknown, string>({
    mutationFn: async (roomId) => {
      await api.delete(`/rooms/${roomId}`);
    },
    onSuccess: () => toast.success("Room deleted successfully"),
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Failed to delete room")),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const fetchRooms = () => refetch();

  const createRoom = (roomData: CreateRoomInput | FormData) =>
    createRoomMutation.mutateAsync(roomData);

  const updateRoom = (roomId: string, roomData: UpdateRoomInput | FormData) =>
    updateRoomMutation.mutateAsync({ roomId, data: roomData });

  const deleteRoom = (roomId: string) => deleteRoomMutation.mutateAsync(roomId);

  return {
    rooms,
    loading,
    isEmpty: !loading && rooms.length === 0,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  };
}
