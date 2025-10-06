// hooks/useBookings.ts
"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BookingTransaction } from "@/types";
import { useApiQuery } from "./useApiQuery";
import api from "@/lib/axios"; // Use your centralized axios instance
import { getErrorMessage } from "@/lib/errors";

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

// Using centralized axios instance with automatic auth handling

export function useBookings(
  propertyId?: string,
  initialParams: PaginationParams = { page: 1, limit: 10 }
) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Store current params in state to allow dynamic updates
  const [params, setParams] = useState<PaginationParams>(initialParams);

  // Create query key that changes when params change - this triggers automatic refetch
  const queryKey = ["bookings", propertyId, params] as const;

  // Fetch function for useApiQuery
  const fetchBookingsData =
    useCallback(async (): Promise<BookingsApiResponse> => {
      if (!session?.user?.accessToken) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 10),
      });

      if (propertyId) {
        queryParams.set("propertyId", propertyId);
      }

      if (params.search) {
        queryParams.set("search", params.search);
      }

      if (params.status && params.status !== "all") {
        queryParams.set("status", params.status);
      }

      const url = `/bookings?${queryParams.toString()}`;
      const response = await api.get<BookingsApiResponse>(url);

      return response.data;
    }, [propertyId, params, session?.user?.accessToken]);

  // Use the custom useApiQuery hook
  const {
    data: bookingsData,
    isLoading: loading,
    error,
    refetch,
  } = useApiQuery({
    queryKey,
    queryFn: fetchBookingsData,
    enabled: !!session?.user?.accessToken,
    errorMessage: "Failed to fetch bookings",
  });

  // Extract data from response
  const bookings = bookingsData?.data ?? [];
  const pagination = bookingsData?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // Mutation for canceling booking
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      if (!session?.user?.accessToken) {
        throw new Error("Authentication required");
      }

      await api.patch(`/bookings/${bookingId}/cancel`);
      return bookingId;
    },
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking cancelled successfully");
    },
    onError: (err) => {
      const errorMessage = getErrorMessage(err, "Failed to cancel booking");
      toast.error(errorMessage);
    },
  });

  // Mutation for approving payment proof
  const approvePaymentProofMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      if (!session?.user?.accessToken) {
        throw new Error("Authentication required");
      }

      await api.patch(`/bookings/${bookingId}/payment-proof/approve`);
      return bookingId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Payment proof approved successfully");
    },
    onError: (err) => {
      const errorMessage = getErrorMessage(
        err,
        "Failed to approve payment proof"
      );
      toast.error(errorMessage);
    },
  });

  // Mutation for rejecting payment proof
  const rejectPaymentProofMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      if (!session?.user?.accessToken) {
        throw new Error("Authentication required");
      }

      await api.patch(`/bookings/${bookingId}/payment-proof/reject`);
      return bookingId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Payment proof rejected successfully");
    },
    onError: (err) => {
      const errorMessage = getErrorMessage(
        err,
        "Failed to reject payment proof"
      );
      toast.error(errorMessage);
    },
  });

  // Wrapper function that maintains backward compatibility for fetchBookings
  const fetchBookings = useCallback(
    (newParams?: PaginationParams) => {
      if (newParams) {
        // Update params state, which will trigger queryKey change and auto-refetch
        setParams((prev) => ({ ...prev, ...newParams }));
      } else {
        // Force refetch with current params
        refetch();
      }
    },
    [refetch]
  );

  // Wrapper functions for mutations that return Promises for backward compatibility
  const cancelBooking = useCallback(
    (bookingId: string): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        cancelBookingMutation.mutate(bookingId, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    [cancelBookingMutation]
  );

  const approvePaymentProof = useCallback(
    (bookingId: string): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        approvePaymentProofMutation.mutate(bookingId, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    [approvePaymentProofMutation]
  );

  const rejectPaymentProof = useCallback(
    (bookingId: string): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        rejectPaymentProofMutation.mutate(bookingId, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    [rejectPaymentProofMutation]
  );

  return {
    bookings,
    loading,
    error: error?.message || null,
    pagination,
    fetchBookings,
    cancelBooking,
    approvePaymentProof,
    rejectPaymentProof,
    // Additional loading states for mutations
    cancellingBooking: cancelBookingMutation.isPending,
    approvingPayment: approvePaymentProofMutation.isPending,
    rejectingPayment: rejectPaymentProofMutation.isPending,
  };
}
