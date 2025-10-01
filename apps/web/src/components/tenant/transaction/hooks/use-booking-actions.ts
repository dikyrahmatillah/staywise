// apps/web/src/components/tenant/transaction/use-booking-actions.ts
// NOTE: This file should be moved to hooks/ folder for better organization

import { useState } from "react";
import { toast } from "sonner";
import type { BookingActionsState } from "@/components/tenant/transaction/table-row/booking-table-row.types";

interface UseBookingActionsProps {
  bookingId: string;
  onApprovePayment?: (bookingId: string) => Promise<void>;
  onRejectPayment?: (bookingId: string) => Promise<void>;
  onCancelBooking?: (bookingId: string) => Promise<void>;
  onBookingUpdate?: () => void;
}

interface UseBookingActionsReturn {
  actionsState: BookingActionsState;
  handleApprove: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleCancel: () => Promise<void>;
}

export const useBookingActions = ({
  bookingId,
  onApprovePayment,
  onRejectPayment,
  onCancelBooking,
  onBookingUpdate,
}: UseBookingActionsProps): UseBookingActionsReturn => {
  const [actionsState, setActionsState] = useState<BookingActionsState>({
    isApproving: false,
    isRejecting: false,
    isCancelling: false,
  });

  const handleApprove = async () => {
    if (!onApprovePayment) return;

    setActionsState((prev: BookingActionsState) => ({ ...prev, isApproving: true }));
    try {
      await onApprovePayment(bookingId);
      toast.success("Payment proof approved successfully");
      onBookingUpdate?.();
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("Failed to approve payment proof");
    } finally {
      setActionsState((prev: BookingActionsState) => ({ ...prev, isApproving: false }));
    }
  };

  const handleReject = async () => {
    if (!onRejectPayment) return;

    setActionsState((prev: BookingActionsState) => ({ ...prev, isRejecting: true }));
    try {
      await onRejectPayment(bookingId);
      toast.success("Payment proof rejected successfully");
      onBookingUpdate?.();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error("Failed to reject payment proof");
    } finally {
      setActionsState((prev: BookingActionsState) => ({ ...prev, isRejecting: false }));
    }
  };

  const handleCancel = async () => {
    if (!onCancelBooking) return;

    setActionsState((prev: BookingActionsState) => ({ ...prev, isCancelling: true }));
    try {
      await onCancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      onBookingUpdate?.();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setActionsState((prev: BookingActionsState) => ({ ...prev, isCancelling: false }));
    }
  };

  return {
    actionsState,
    handleApprove,
    handleReject,
    handleCancel,
  };
};