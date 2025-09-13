"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import type { Room, RoomsApiResponse, RoomApiResponse } from "@/types/room";
import { CreateRoomInput, UpdateRoomInput } from "@repo/schemas";

const createApiInstance = (accessToken?: string) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  });

  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return api;
};

export function useRooms(propertyId: string) {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const api = createApiInstance(session.user.accessToken);
      const response = await api.get<RoomsApiResponse>(
        `/rooms/property/${propertyId}`
      );
      setRooms(response.data.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch rooms";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [propertyId, session?.user?.accessToken]);

  const createRoom = useCallback(
    async (roomData: CreateRoomInput) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        const response = await api.post<RoomApiResponse>(
          `/rooms/property/${propertyId}`,
          roomData
        );
        setRooms((prevRooms) => [...prevRooms, response.data.data]);
        toast.success("Room created successfully");
        return response.data.data;
      } catch (err) {
        console.error("Error creating room:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to create room";
        toast.error(errorMessage);
        throw err;
      }
    },
    [propertyId, session?.user?.accessToken]
  );

  const updateRoom = useCallback(
    async (roomId: string, roomData: UpdateRoomInput) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        const response = await api.put<RoomApiResponse>(
          `/rooms/${roomId}`,
          roomData
        );
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === roomId ? response.data.data : room
          )
        );
        toast.success("Room updated successfully");
        return response.data.data;
      } catch (err) {
        console.error("Error updating room:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to update room";
        toast.error(errorMessage);
        throw err;
      }
    },
    [session?.user?.accessToken]
  );

  const deleteRoom = useCallback(
    async (roomId: string) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        await api.delete(`/rooms/${roomId}`);
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
        toast.success("Room deleted successfully");
      } catch (err) {
        console.error("Error deleting room:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to delete room";
        toast.error(errorMessage);
        throw err;
      }
    },
    [session?.user?.accessToken]
  );

  useEffect(() => {
    if (session?.user?.accessToken && propertyId) {
      fetchRooms();
    }
  }, [fetchRooms, session?.user?.accessToken, propertyId]);

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  };
}
