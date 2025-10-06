"use client";

import { Star } from "lucide-react";
import { StatusBadge } from "@/components/guest/my-bookings/status-badge";
import { useBookingTableRowContext } from "./booking-table-row-context";

export const BookingTableRowStatus = () => {
  const { booking, review } = useBookingTableRowContext();

  // Show review status for completed bookings
  if (booking.status === "COMPLETED" && review) {
    return (
      <div className="flex flex-col items-center gap-1">
        <StatusBadge status="COMPLETED" />
        <div className="flex items-center gap-1 text-xs text-yellow-600">
          <Star className="h-3 w-3 fill-yellow-400" />
          <span>Reviewed</span>
        </div>
      </div>
    );
  }

  // Show payment proof status for manual transfers
  if (booking.paymentMethod === "MANUAL_TRANSFER" && booking.paymentProof) {
    if (booking.paymentProof.rejectedAt) {
      return <StatusBadge status="WAITING_PAYMENT" />;
    }
    if (booking.paymentProof.acceptedAt) {
      return <StatusBadge status="PROCESSING" />;
    }
    return (
      <div className="flex flex-col items-center gap-1">
        <StatusBadge status={booking.status} />
        <span className="text-xs text-blue-600">Proof Uploaded</span>
      </div>
    );
  }

  return <StatusBadge status={booking.status} />;
};
