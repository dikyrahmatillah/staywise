"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useBookingSidebar } from "../context/booking-sidebar-context";
import { useBookingNavigation } from "../hooks/use-booking-navigation";

export function BookingButton() {
  const { isBooking } = useBookingSidebar();
  const { handleBookNow, isAuthenticated, isLoading } = useBookingNavigation();

  return (
    <>
      <Button
        className="w-full text-base font-semibold rounded-lg py-6 shadow-md hover:shadow-lg transition-all duration-300"
        onClick={handleBookNow}
        disabled={isLoading || isBooking}
      >
        {isBooking ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading...
          </>
        ) : !isAuthenticated ? (
          "Log in to Book"
        ) : (
          "Book Now"
        )}
      </Button>

      {!isAuthenticated && (
        <p className="text-xs text-center text-slate-500 mt-2">
          You&apos;ll need to log in before completing your booking
        </p>
      )}
    </>
  );
}