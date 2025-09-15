// hooks/useBookings.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import type { BookingTransaction } from "@/types/booking";

interface BookingsApiResponse {
  success: boolean;
  count: number;
  data: BookingTransaction[];
  propertyId?: string | null;
}

const createApiInstance = (accessToken?: string) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  });

  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return api;
};

export function useBookings(propertyId?: string) {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<BookingTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    console.log("=== DEBUGGING useBookings ===");
    console.log("Session data:", session);
    console.log("Access token:", session?.user?.accessToken);
    console.log("User ID:", session?.user?.id);
    console.log("User role:", session?.user?.role);

    if (!session?.user?.accessToken) {
      console.log("No access token found!");
      setError("Authentication required. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const api = createApiInstance(session.user.accessToken);
      const url = propertyId
        ? `/bookings?propertyId=${propertyId}`
        : "/bookings";

      console.log("📡 Making API call to:", url);
      console.log(
        "🔑 Using token:",
        session.user.accessToken.substring(0, 20) + "..."
      );

      const response = await api.get<BookingsApiResponse>(url);
      console.log("✅ API Response received:");
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      console.log("Number of bookings:", response.data.data?.length || 0);
      console.log("First booking:", response.data.data?.[0]);

      setBookings(response.data.data);
    } catch (err) {
      console.error("❌ API Error:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
      }

      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch bookings";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [propertyId, session]);
  const cancelBooking = useCallback(
    async (bookingId: string) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        await api.delete(`/bookings/${bookingId}`);

        // Update local state
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "CANCELLED" as const }
              : booking
          )
        );

        toast.success("Booking cancelled successfully");
      } catch (err) {
        console.error("Error cancelling booking:", err);
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to cancel booking";
        toast.error(errorMessage);
        throw err;
      }
    },
    [session?.user?.accessToken]
  );

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchBookings();
    }
  }, [fetchBookings, session?.user?.accessToken]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    cancelBooking,
  };
}
