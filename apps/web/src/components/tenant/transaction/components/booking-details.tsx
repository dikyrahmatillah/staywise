// apps/web/src/components/tenant/transaction/components/booking-details.tsx

import { formatDateRange, formatNightsText } from "@/components/tenant/transaction/booking-helpers";
import { useBookingRow } from "../context/booking-row-context";

export const BookingDetails = () => {
  const { booking } = useBookingRow();
  const { orderCode, checkInDate, checkOutDate, nights } = booking;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-mono text-muted-foreground">
        {orderCode}
      </span>
      <span className="text-sm font-medium">
        {formatDateRange(checkInDate, checkOutDate)}
      </span>
      <span className="text-xs text-muted-foreground">
        {formatNightsText(nights)}
      </span>
    </div>
  );
};