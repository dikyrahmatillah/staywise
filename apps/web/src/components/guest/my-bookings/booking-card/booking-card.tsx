// apps/web/src/components/guest/my-bookings/booking-card/booking-card.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookingCancellationDialog } from "@/components/guest/booking-transaction/cancellation-dialog";
import { ReviewDialog } from "@/components/guest/reviews/review-dialog";
import type { BookingTransaction } from "@repo/types";
import { useCanReview, useBookingReview } from "@/hooks/useReview";
import { BookingCardProvider } from "./booking-card-context";
import { BookingCardHeader } from "./booking-card-header";
import { BookingCardDetails } from "./booking-card-details";
import { BookingCardStatus } from "./booking-card-status";
import { BookingCardActions } from "./booking-card-actions";
import { useBookingCardDialogs } from "./hooks/use-booking-card-dialogs";
import { useBookingCardActions } from "./hooks/use-booking-card-actions";

interface BookingCardProps {
  booking: BookingTransaction;
  onViewDetails?: (booking: BookingTransaction) => void;
  onBookingUpdate?: () => void;
}

export const BookingCard = ({
  booking,
  onViewDetails,
  onBookingUpdate,
}: BookingCardProps) => {
  const dialogs = useBookingCardDialogs();
  const { canReview } = useCanReview(booking.id);
  const { review } = useBookingReview(booking.id);
  const { handleCancelBooking, handleReviewSubmit, isCancelling, isSubmitting } =
    useBookingCardActions(onBookingUpdate);

  const contextValue = {
    booking,
    review,
    canReview,
    onViewDetails,
    onBookingUpdate,
  };

  return (
    <BookingCardProvider value={contextValue}>
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Property Info */}
          <BookingCardHeader />

          {/* Booking Details */}
          <BookingCardDetails />

          {/* Status */}
          <BookingCardStatus />

          {/* Actions */}
          <div className="pt-3 border-t">
            <BookingCardActions
              paymentProofDialog={dialogs.paymentProofDialog}
              paymentProofViewDialog={dialogs.paymentProofViewDialog}
              cancellationDialog={dialogs.cancellationDialog}
              reviewDialog={dialogs.reviewDialog}
            />
          </div>
        </CardContent>
      </Card>

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
    </BookingCardProvider>
  );
};