// apps/web/src/components/tenant/transaction/components/booking-status-display.tsx

import { StatusBadge } from "@/components/guest/my-bookings/status-badge";
import { getPaymentProofStatusText } from "@/components/tenant/transaction/booking-helpers";
import { useBookingRow } from "../context/booking-row-context";
import { tenantStatusTooltips } from "@/components/tenant/transaction/components/booking-status-tooltips";

export const BookingStatusDisplay = () => {
  const { booking } = useBookingRow();
  const statusDisplay = (
    <StatusBadge status={booking.status} tooltips={tenantStatusTooltips} />
  );
  const proofStatusText = getPaymentProofStatusText(booking);

  // For manual transfers with payment proof, show additional info
  if (proofStatusText) {
    return (
      <div className="flex flex-col items-center gap-1">
        {statusDisplay}
        <span className="text-xs text-blue-600">{proofStatusText}</span>
      </div>
    );
  }

  return statusDisplay;
};
