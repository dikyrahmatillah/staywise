// apps/web/src/components/guest/my-bookings/booking-card/hooks/use-booking-card-actions.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useBookings } from "@/hooks/useBookings";
import { useReviews } from "@/hooks/useReview";
import type { CreateReviewInput } from "@/types/review";

export const useBookingCardActions = (onBookingUpdate?: () => void) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const { cancelBooking } = useBookings();
  const { createReview, isSubmitting } = useReviews();

  const handleCancelBooking = async (bookingId: string) => {
    setIsCancelling(true);
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      onBookingUpdate?.();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
      throw error;
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReviewSubmit = async (data: CreateReviewInput) => {
    await createReview(data);
    onBookingUpdate?.();
  };

  return {
    handleCancelBooking,
    handleReviewSubmit,
    isCancelling,
    isSubmitting,
  };
};