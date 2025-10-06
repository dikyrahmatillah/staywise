"use client";

import { CheckCircle } from "lucide-react";
import { useBookingSidebar } from "../context/booking-sidebar-context";
import { useBookingValidation } from "../hooks/use-booking-validation";
import { useDateAvailability } from "../hooks/use-date-availability";

export function BookingStatus() {
  const { checkInDate, checkOutDate, adults } = useBookingSidebar();
  const { hasErrors } = useBookingValidation();
  const { getRangeOverlap } = useDateAvailability();

  if (!checkInDate || !checkOutDate || adults === 0 || hasErrors()) {
    return null;
  }

  const overlapCheck = getRangeOverlap(checkInDate, checkOutDate);

  if (overlapCheck.hasOverlap) {
    return (
      <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
        <svg
          className="h-5 w-5 mt-0.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="text-xs">
          This room is already booked on:{" "}
          <span className="font-medium">
            {overlapCheck.conflictDates.join(", ")}
          </span>
          . Please select different dates.
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
      <CheckCircle className="h-5 w-5" />
      <span className="text-sm font-medium">Ready to book!</span>
    </div>
  );
}