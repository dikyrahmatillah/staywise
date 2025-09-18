"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { BookingTransaction } from "@repo/types";
import { PropertyInfo } from "@/components/guest/my-bookings/property-info";
import { BookingInfo } from "@/components/guest/my-bookings/booking-info";
import { PaymentInfo } from "@/components/guest/my-bookings/payment-info";
import { StatusBadge } from "@/components/guest/my-bookings/status-badge";

interface BookingTableRowProps {
  booking: BookingTransaction;
  onViewDetails?: (booking: BookingTransaction) => void;
}

export const BookingTableRow = ({
  booking,
  onViewDetails,
}: BookingTableRowProps) => {
  if (!booking?.Property?.name || !booking?.Room?.name) {
    console.warn("BookingTableRow received incomplete data:", booking);
    return null; // Don't render this row
  }
  return (
    <TableRow className="hover:bg-muted/50">
      {/* Property & Room Info */}
      <TableCell colSpan={2} className="py-4">
        <PropertyInfo property={booking.Property} room={booking.Room} />
      </TableCell>

      {/* Booking Details */}
      <TableCell className="text-center py-4">
        <BookingInfo
          orderCode={booking.orderCode}
          checkInDate={booking.checkInDate}
          checkOutDate={booking.checkOutDate}
          nights={booking.nights}
        />
      </TableCell>

      {/* Total Amount */}
      <TableCell className="text-center py-4">
        <PaymentInfo
          totalAmount={booking.totalAmount}
          paymentMethod={booking.paymentMethod}
        />
      </TableCell>

      {/* Status */}
      <TableCell className="text-center py-4">
        <div className="flex justify-center">
          <StatusBadge status={booking.status} />
        </div>
      </TableCell>

      {/* Action */}
      <TableCell className="text-center py-4">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full px-6 h-10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
          onClick={() => onViewDetails?.(booking)}
        >
          Details
        </Button>
      </TableCell>
    </TableRow>
  );
};
