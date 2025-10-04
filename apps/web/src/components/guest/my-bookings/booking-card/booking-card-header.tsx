import { PropertyBookingInfo } from "@/components/guest/my-bookings/property-booking-info";
import { useBookingCardContext } from "./booking-card-context";

export const BookingCardHeader = () => {
  const { booking } = useBookingCardContext();

  return (
    <PropertyBookingInfo
      propertyId={booking.propertyId}
      propertyName={booking.Property?.name || "Unknown Property"}
      roomName={booking.Room?.name || "Unknown Room"}
      nights={booking.nights}
      truncate={true}
    />
  );
};
