// hooks/useBookings.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import type { BookingTransaction } from "@repo/types";

interface BookingsApiResponse {
  success: boolean;
  count: number;
  data: BookingTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  propertyId?: string | null;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchBookings = useCallback(async (params: PaginationParams = {}) => {
    console.log("=== DEBUGGING useBookings ===");
    console.log("Session data:", session);
    console.log("Pagination params:", params);

    if (!session?.user?.accessToken) {
      console.log("No access token found!");
      setError("Authentication required. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const api = createApiInstance(session.user.accessToken);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 10),
      });

      if (propertyId) {
        queryParams.set('propertyId', propertyId);
      }

      if (params.search) {
        queryParams.set('search', params.search);
      }

      if (params.status && params.status !== 'all') {
        queryParams.set('status', params.status);
      }

      const url = `/bookings?${queryParams.toString()}`;

      console.log("📡 Making API call to:", url);

      const response = await api.get<BookingsApiResponse>(url);
      console.log("✅ API Response received:");
      console.log("Response data:", response.data);

      setBookings(response.data.data);
      setPagination(response.data.pagination);
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
      console.log("Cancelling booking with ID:", bookingId);

      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        await api.patch(`/bookings/${bookingId}/cancel`);

        // Update local state
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "CANCELED" as const }
              : booking
          )
        );

        toast.success("Booking cancelled successfully");
      } catch (err) {
        console.error("Cancel booking error details:", {
          bookingId,
          url: `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`,
          error: err
        });

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

  const approvePaymentProof = useCallback(
    async (bookingId: string) => {
      console.log("Approving payment proof for booking ID:", bookingId);

      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        await api.patch(`/bookings/${bookingId}/payment-proof/approve`);

        // Update local state based on your service logic
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status: "COMPLETED" as const,
                  paymentProof: booking.paymentProof
                    ? {
                        ...booking.paymentProof,
                        acceptedAt: new Date(),
                        rejectedAt: null
                      }
                    : booking.paymentProof
                }
              : booking
          )
        );

        toast.success("Payment proof approved successfully");
      } catch (err) {
        console.error("Approve payment proof error details:", {
          bookingId,
          error: err
        });

        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to approve payment proof";
        toast.error(errorMessage);
        throw err;
      }
    },
    [session?.user?.accessToken]
  );

  const rejectPaymentProof = useCallback(
    async (bookingId: string) => {
      console.log("Rejecting payment proof for booking ID:", bookingId);

      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        const api = createApiInstance(session.user.accessToken);
        await api.patch(`/bookings/${bookingId}/payment-proof/reject`);

        // Update local state based on your service logic
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status: "WAITING_PAYMENT" as const,
                  paymentProof: booking.paymentProof
                    ? {
                        ...booking.paymentProof,
                        rejectedAt: new Date(),
                        acceptedAt: null
                      }
                    : booking.paymentProof
                }
              : booking
          )
        );

        toast.success("Payment proof rejected successfully");
      } catch (err) {
        console.error("Reject payment proof error details:", {
          bookingId,
          error: err
        });

        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to reject payment proof";
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
  }, [session?.user?.accessToken]);

  return {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    cancelBooking,
    approvePaymentProof,
    rejectPaymentProof,
  };
}