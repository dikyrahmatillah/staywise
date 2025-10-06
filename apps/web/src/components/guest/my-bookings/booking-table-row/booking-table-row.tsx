"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import type { BookingTransaction } from "@/types";
import { PropertyBookingInfo } from "@/components/guest/my-bookings/property-booking-info";
import { DateTimeInfo } from "@/components/guest/my-bookings/date-time-info";
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
        {/* Booking Info: Property Name (clickable), Room, Nights */}
        <TableCell className="py-4 pr-4">
          <PropertyBookingInfo
            propertyId={booking.propertyId}
            propertyName={booking.Property?.name || "Unknown Property"}
            roomName={booking.Room?.name || "Unknown Room"}
            nights={booking.nights}
            truncate={true} // Enable truncation with tooltip
          />
        </TableCell>

        {/* Date & Time: Created At */}
        <TableCell className="text-center py-4 px-2">
          <DateTimeInfo createdAt={booking.createdAt} />
        </TableCell>

        {/* Status: With Tooltip */}
        <TableCell className="text-center py-4 px-2">
          <div className="flex justify-center">
            <BookingTableRowStatus />
          </div>
        </TableCell>

        {/* Action */}
        <TableCell className="text-center py-4 pl-2">
          <div className="flex justify-center">
            <BookingTableRowActions
              paymentProofDialog={dialogs.paymentProofDialog}
              paymentProofViewDialog={dialogs.paymentProofViewDialog}
              cancellationDialog={dialogs.cancellationDialog}
              reviewDialog={dialogs.reviewDialog}
              onPaymentProofExpire={() => handlePaymentProofExpire(booking.id)}
            />
          </div>
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