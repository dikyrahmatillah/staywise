"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import type { BookingTransaction } from "@repo/types";
import { PropertyInfo } from "@/components/guest/my-bookings/property-info";
import { BookingInfo } from "@/components/guest/my-bookings/booking-info";
import { PaymentInfo } from "@/components/guest/my-bookings/payment-info";
import { BookingCancellationDialog } from "@/components/guest/booking-transaction/cancellation-dialog";
import { ReviewDialog } from "@/components/guest/reviews/review-dialog";
import { useCanReview, useBookingReview } from "@/hooks/useReview";
import { BookingTableRowProvider } from "./booking-table-row-context";
import { BookingTableRowStatus } from "./booking-table-row-status";
import { BookingTableRowActions } from "./booking-table-row-actions";
import { useBookingTableRowDialogs } from "./hooks/use-booking-table-row-dialogs";
import { useBookingTableRowActions } from "./hooks/use-booking-table-row-actions";

interface BookingTableRowProps {
  booking: BookingTransaction;
  onViewDetails?: (booking: BookingTransaction) => void;
  onBookingUpdate?: () => void;
}

export const BookingTableRow = ({
  booking,
  onViewDetails,
  onBookingUpdate,
}: BookingTableRowProps) => {
  const dialogs = useBookingTableRowDialogs();
  const { canReview } = useCanReview(booking.id);
  const { review } = useBookingReview(booking.id);
  const {
    handleCancelBooking,
    handlePaymentProofExpire,
    handleReviewSubmit,
    isCancelling,
    isSubmitting,
  } = useBookingTableRowActions(onBookingUpdate);

  const contextValue = {
    booking,
    review,
    canReview,
    onViewDetails,
    onBookingUpdate,
  };

  return (
    <BookingTableRowProvider value={contextValue}>
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
            <BookingTableRowStatus />
          </div>
        </TableCell>

        {/* Action */}
        <TableCell className="text-center py-4">
          <BookingTableRowActions
            paymentProofDialog={dialogs.paymentProofDialog}
            paymentProofViewDialog={dialogs.paymentProofViewDialog}
            cancellationDialog={dialogs.cancellationDialog}
            reviewDialog={dialogs.reviewDialog}
            onPaymentProofExpire={() => handlePaymentProofExpire(booking.id)}
          />
        </TableCell>
      </TableRow>

      {/* Dialogs */}
      <BookingCancellationDialog
        booking={booking}
        open={dialogs.cancellationDialog.open}
        onOpenChange={dialogs.cancellationDialog.setOpen}
        onConfirmCancel={handleCancelBooking}
        isLoading={isCancelling}
      />

      <ReviewDialog
        open={dialogs.reviewDialog.open}
        onOpenChange={dialogs.reviewDialog.setOpen}
        bookingId={booking.id}
        propertyName={booking.Property?.name || "Property"}
        onSubmit={handleReviewSubmit}
        isSubmitting={isSubmitting}
      />
    </BookingTableRowProvider>
  );
};