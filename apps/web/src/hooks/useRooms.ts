"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import type { Room, RoomsApiResponse, RoomApiResponse } from "@/types/room";
import { CreateRoomInput, UpdateRoomInput } from "@repo/schemas";
import { setAuthToken } from "@/lib/axios";

function getErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return fallback;
}

export function useRooms(propertyId: string) {
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authToken = session?.user?.accessToken ?? null;

  const fetchRooms = useCallback(async () => {
    if (!authToken) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get<RoomsApiResponse>(
        `/rooms/property/${propertyId}`
      );
      setRooms(res.data.data);
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to fetch rooms");
      console.error("fetchRooms:", err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [authToken, propertyId]);

  const createRoom = useCallback(
    async (roomData: CreateRoomInput | FormData) => {
      if (!authToken) return toast.error("Authentication required");

      try {
        const res = await api.post<RoomApiResponse>(
          `/rooms/property/${propertyId}`,
          roomData
        );
        setRooms((p) => [...p, res.data.data]);
        toast.success("Room created successfully");
        return res.data.data;
      } catch (err) {
        const msg = getErrorMessage(err, "Failed to create room");
        console.error("createRoom:", err);
        toast.error(msg);
        throw err;
      }
    },
    [authToken, propertyId]
  );

  const updateRoom = useCallback(
    async (roomId: string, roomData: UpdateRoomInput | FormData) => {
      if (!authToken) return toast.error("Authentication required");

      try {
        const res = await api.put<RoomApiResponse>(
          `/rooms/${roomId}`,
          roomData
        );
        setRooms((prev) =>
          prev.map((r) => (r.id === roomId ? res.data.data : r))
        );
        toast.success("Room updated successfully");
        return res.data.data;
      } catch (err) {
        const msg = getErrorMessage(err, "Failed to update room");
        console.error("updateRoom:", err);
        toast.error(msg);
        throw err;
      }
    },
    [authToken]
  );

  const deleteRoom = useCallback(
    async (roomId: string) => {
      if (!authToken) return toast.error("Authentication required");

      try {
        await api.delete(`/rooms/${roomId}`);
        setRooms((p) => p.filter((r) => r.id !== roomId));
        toast.success("Room deleted successfully");
      } catch (err) {
        const msg = getErrorMessage(err, "Failed to delete room");
        console.error("deleteRoom:", err);
        toast.error(msg);
        throw err;
      }
    },
    [authToken]
  );

  useEffect(() => {
    if (status === "loading") return;

    setAuthToken(authToken);

    if (status === "authenticated" && authToken && propertyId) {
      fetchRooms();
    } else {
      setLoading(false);
    }
  }, [status, authToken, propertyId, fetchRooms]);

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
