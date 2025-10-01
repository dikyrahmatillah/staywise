// apps/web/src/components/tenant/transaction/components/payment-info.tsx

import { formatCurrency } from "@/lib/booking-formatters";
import { formatPaymentMethod } from "@/components/tenant/transaction/booking-helpers";
import { useBookingRow } from "../context/booking-row-context";

export const PaymentInfo = () => {
  const { booking } = useBookingRow();
  const { totalAmount, paymentMethod } = booking;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-base">
        {formatCurrency(totalAmount)}
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          {formatPaymentMethod(paymentMethod)}
        </span>
      </div>
    </div>
  );
};