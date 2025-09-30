// apps/web/src/hooks/useReviews.ts
"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useApiQuery } from "./useApiQuery";
import { getErrorMessage } from "@/lib/errors";
import axios from "axios";
import type {
  Review,
  CreateReviewInput,
  UpdateReviewInput,
  ReviewStats,
  CanReviewResponse,
} from "@/types/review";

interface ReviewsApiResponse {
  success: boolean;
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ReviewApiResponse {
  success: boolean;
  data: Review;
  message?: string;
}

interface ReviewStatsApiResponse {
  success: boolean;
  data: ReviewStats;
}

interface CanReviewApiResponse {
  success: boolean;
  data: CanReviewResponse;
}

export function useReviews(propertyId?: string, userId?: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const queryKey = ["reviews", propertyId, userId] as const;

  const {
    data: reviewsData,
    isLoading: loading,
    error,
    refetch,
  } = useApiQuery<ReviewsApiResponse, Error>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (propertyId) params.set("propertyId", propertyId);
      if (userId) params.set("userId", userId);

      const url = `/reviews?${params.toString()}`;
      const response = await api.get<ReviewsApiResponse>(url);
      return response.data;
    },
    enabled: !!session?.user?.accessToken,
    errorMessage: "Failed to fetch reviews",
  });

  const reviews = reviewsData?.data ?? [];
  const pagination = reviewsData?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  const createReviewMutation = useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      if (!session?.user?.accessToken) {
        throw new Error("Authentication required");
      }

      const response = await api.post<ReviewApiResponse>("/reviews", input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Review submitted successfully");
    },
    onError: (err: unknown) => {
      const errorMessage = getErrorMessage(err, "Failed to submit review");
      toast.error(errorMessage);
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: UpdateReviewInput;
    }) => {
      if (!session?.user?.accessToken) {
        throw new Error("Authentication required");
      }

      const response = await api.put<ReviewApiResponse>(
        `/reviews/${reviewId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review updated successfully");
    },
    onError: (err: unknown) => {
      const errorMessage = getErrorMessage(err, "Failed to update review");
      toast.error(errorMessage);
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!session?.user?.accessToken) {
        throw new Error("Authentication required");
      }

      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Review deleted successfully");
    },
    onError: (err: unknown) => {
      const errorMessage = getErrorMessage(err, "Failed to delete review");
      toast.error(errorMessage);
    },
  });

  const createReview = useCallback(
    (input: CreateReviewInput): Promise<void> => {
      return new Promise((resolve, reject) => {
        createReviewMutation.mutate(input, {
          onSuccess: () => resolve(),
          onError: (error: unknown) => reject(error),
        });
      });
    },
    [createReviewMutation]
  );

  const updateReview = useCallback(
    (reviewId: string, data: UpdateReviewInput): Promise<void> => {
      return new Promise((resolve, reject) => {
        updateReviewMutation.mutate(
          { reviewId, data },
          {
            onSuccess: () => resolve(),
            onError: (error: unknown) => reject(error),
          }
        );
      });
    },
    [updateReviewMutation]
  );

  const deleteReview = useCallback(
    (reviewId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        deleteReviewMutation.mutate(reviewId, {
          onSuccess: () => resolve(),
          onError: (error: unknown) => reject(error),
        });
      });
    },
    [deleteReviewMutation]
  );

  return {
    reviews,
    loading,
    error: error?.message || null,
    pagination,
    createReview,
    updateReview,
    deleteReview,
    isSubmitting: createReviewMutation.isPending,
    isUpdating: updateReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending,
    refetch,
  };
}

export function useBookingReview(bookingId: string) {
  const { data: session } = useSession();
  const queryKey = ["review", "booking", bookingId] as const;

  const {
    data: reviewData,
    isLoading: loading,
    error,
    refetch,
  } = useApiQuery<Review | null, Error>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await api.get<ReviewApiResponse>(
          `/reviews/booking/${bookingId}`
        );
        return response.data.data;
      } catch (err: unknown) {
        // Use axios error checker - cleaner and type-safe
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          return null;
        }
        throw err;
      }
    },
    enabled: !!session?.user?.accessToken && !!bookingId,
    errorMessage: "Failed to fetch review",
  });

  return {
    review: reviewData ?? null,
    loading,
    error: error?.message || null,
    refetch,
  };
}

export function useCanReview(bookingId: string) {
  const { data: session } = useSession();
  const queryKey = ["can-review", bookingId] as const;

  const {
    data: canReviewData,
    isLoading: loading,
    error,
  } = useApiQuery<CanReviewResponse, Error>({
    queryKey,
    queryFn: async () => {
      const response = await api.get<CanReviewApiResponse>(
        `/reviews/booking/${bookingId}/can-review`
      );
      return response.data.data;
    },
    enabled: !!session?.user?.accessToken && !!bookingId,
    errorMessage: "Failed to check review eligibility",
  });

  return {
    canReview: canReviewData?.canReview ?? false,
    reason: canReviewData?.reason,
    loading,
    error: error?.message || null,
  };
}

export function usePropertyReviewStats(propertyId: string) {
  const queryKey = ["review-stats", propertyId] as const;

  const {
    data: statsData,
    isLoading: loading,
    error,
  } = useApiQuery<ReviewStats, Error>({
    queryKey,
    queryFn: async () => {
      const response = await api.get<ReviewStatsApiResponse>(
        `/reviews/property/${propertyId}/stats`
      );
      return response.data.data;
    },
    enabled: !!propertyId,
    errorMessage: "Failed to fetch review stats",
  });

  return {
    stats: statsData ?? null,
    loading,
    error: error?.message || null,
  };
}