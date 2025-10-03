"use client";

import { PropertyInfo } from "@/components/guest/my-bookings/property-info";
import { useBookingCardContext } from "./booking-card-context";

export const BookingCardHeader = () => {
  const { booking } = useBookingCardContext();

  return <PropertyInfo property={booking.Property} room={booking.Room} />;
};