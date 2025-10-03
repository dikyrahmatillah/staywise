"use client";

import { Star } from "lucide-react";
import { StatusBadge } from "@/components/guest/my-bookings/status-badge";
import { useBookingCardContext } from "./booking-card-context";

export const BookingCardStatus = () => {
  const { booking, review } = useBookingCardContext();

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">Status</span>
      <div>
        <StatusBadge status={booking.status} />
        {booking.status === "COMPLETED" && review && (
          <div className="flex items-center justify-end gap-1 text-xs text-yellow-600 mt-1">
            <Star className="h-3 w-3 fill-yellow-400" />
            <span>Reviewed</span>
          </div>
        )}
      </div>
    </div>
  );
};