// apps/web/src/components/tenant/transaction/utils/booking-helpers.ts

import type { BookingTransaction } from "@repo/types";

/**
 * Format date range for display
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = new Date(startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = new Date(endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${start} → ${end}`;
};

/**
 * Format nights text with proper pluralization
 */
export const formatNightsText = (nights: number): string => {
  return `${nights} night${nights > 1 ? "s" : ""}`;
};

/**
 * Format payment method for display
 */
export const formatPaymentMethod = (paymentMethod: string): string => {
  return paymentMethod === "MANUAL_TRANSFER"
    ? "Manual Transfer"
    : "Payment Gateway";
};

/**
 * Check if booking needs payment confirmation
 */
export const needsPaymentConfirmation = (
  booking: BookingTransaction
): boolean => {
  return (
    booking.status === "WAITING_CONFIRMATION" &&
    booking.paymentMethod === "MANUAL_TRANSFER" &&
    !!booking.paymentProof &&
    !booking.paymentProof.acceptedAt &&
    !booking.paymentProof.rejectedAt
  );
};

/**
 * Check if booking is waiting for payment with no proof
 */
export const isWaitingPaymentNoproof = (
  booking: BookingTransaction
): boolean => {
  return (
    booking.status === "WAITING_PAYMENT" &&
    booking.paymentMethod === "MANUAL_TRANSFER" &&
    !booking.paymentProof
  );
};

/**
 * Check if booking has uploaded payment proof but not processed
 */
export const hasUnprocessedPaymentProof = (
  booking: BookingTransaction
): boolean => {
  return (
    booking.status === "WAITING_PAYMENT" &&
    booking.paymentMethod === "MANUAL_TRANSFER" &&
    !!booking.paymentProof
  );
};

/**
 * Get payment proof status text
 */
export const getPaymentProofStatusText = (
  booking: BookingTransaction
): string | null => {
  if (booking.paymentMethod !== "MANUAL_TRANSFER" || !booking.paymentProof) {
    return null;
  }

  if (booking.paymentProof.rejectedAt) {
    return "Proof Rejected";
  }
  if (booking.paymentProof.acceptedAt) {
    return "Proof Approved";
  }
  return "Proof Uploaded";
};
