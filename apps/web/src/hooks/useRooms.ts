"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import type { Room, RoomsApiResponse, RoomApiResponse } from "@/types/room";
import { CreateRoomInput, UpdateRoomInput } from "@repo/schemas";

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
      api.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;
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
      delete api.defaults.headers.common.Authorization;
      setLoading(false);
    }
  }, [propertyId, session?.user?.accessToken]);

  const createRoom = useCallback(
    async (roomData: CreateRoomInput | FormData) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        api.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;
        let response;
        if (roomData instanceof FormData) {
          response = await api.post<RoomApiResponse>(
            `/rooms/property/${propertyId}`,
            roomData
          );
        } else {
          response = await api.post<RoomApiResponse>(
            `/rooms/property/${propertyId}`,
            roomData
          );
        }
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
      } finally {
        delete api.defaults.headers.common.Authorization;
      }
    },
    [propertyId, session?.user?.accessToken]
  );

  const updateRoom = useCallback(
    async (roomId: string, roomData: UpdateRoomInput | FormData) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        api.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;
        let response;
        if (roomData instanceof FormData) {
          response = await api.put<RoomApiResponse>(
            `/rooms/${roomId}`,
            roomData
          );
        } else {
          response = await api.put<RoomApiResponse>(
            `/rooms/${roomId}`,
            roomData
          );
        }
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
      } finally {
        delete api.defaults.headers.common.Authorization;
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
        api.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;
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
      } finally {
        delete api.defaults.headers.common.Authorization;
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
