import type { BookingTransaction } from "@/types";
import type { Review } from "@/types/review";

export type ActionType =
  | "UPLOAD_PAYMENT_PROOF"
  | "PAY_NOW"
  | "VIEW_PAYMENT_PROOF"
  | "LEAVE_REVIEW"
  | "VIEW_REVIEW"
  | "VIEW_DETAILS";

interface GetActionTypeParams {
  booking: BookingTransaction;
  review: Review | null;
  canReview: boolean;
}

export const getActionType = ({
  booking,
  review,
  canReview,
}: GetActionTypeParams): ActionType => {
  // WAITING_PAYMENT status
  if (booking.status === "WAITING_PAYMENT") {
    if (booking.paymentMethod === "MANUAL_TRANSFER") {
      return "UPLOAD_PAYMENT_PROOF";
    }
    if (booking.paymentMethod === "PAYMENT_GATEWAY") {
      return "PAY_NOW";
    }
  }

  // WAITING_CONFIRMATION status
  if (
    booking.status === "WAITING_CONFIRMATION" &&
    booking.paymentMethod === "MANUAL_TRANSFER"
  ) {
    return "VIEW_PAYMENT_PROOF";
  }

  // COMPLETED status
  if (booking.status === "COMPLETED") {
    const isPastCheckout = new Date() > new Date(booking.checkOutDate);

    if (review) {
      return "VIEW_REVIEW";
    }

    if (canReview && isPastCheckout) {
      return "LEAVE_REVIEW";
    }
  }

  // Default
  return "VIEW_DETAILS";
};

export const canCancelBooking = (booking: BookingTransaction): boolean => {
  return (
    booking.status === "WAITING_PAYMENT" &&
    (booking.paymentMethod === "MANUAL_TRANSFER" ||
      booking.paymentMethod === "PAYMENT_GATEWAY")
  );
};