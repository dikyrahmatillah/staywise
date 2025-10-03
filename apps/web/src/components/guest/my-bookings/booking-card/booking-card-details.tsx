"use client";

import { BookingInfo } from "@/components/guest/my-bookings/booking-info";
import { PaymentInfo } from "@/components/guest/my-bookings/payment-info";
import { useBookingCardContext } from "./booking-card-context";

export const BookingCardDetails = () => {
  const { booking } = useBookingCardContext();

  return (
    <>
      {/* Booking Info */}
      <div className="pt-3 border-t">
        <BookingInfo
          orderCode={booking.orderCode}
          checkInDate={booking.checkInDate}
          checkOutDate={booking.checkOutDate}
          nights={booking.nights}
        />
      </div>

      {/* Payment Info */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total Amount</span>
        <PaymentInfo
          totalAmount={booking.totalAmount}
          paymentMethod={booking.paymentMethod}
        />
      </div>
    </>
  );
};