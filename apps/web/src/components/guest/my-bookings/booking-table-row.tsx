// apps/web/src/components/guest/my-bookings/booking-table-row.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CreateReviewInput } from "@/types/review";
import type { BookingTransaction } from "@repo/types";
import { PropertyInfo } from "@/components/guest/my-bookings/property-info";
import { BookingInfo } from "@/components/guest/my-bookings/booking-info";
import { PaymentInfo } from "@/components/guest/my-bookings/payment-info";
import { StatusBadge } from "@/components/guest/my-bookings/status-badge";
import { PaymentProofUpload } from "@/components/guest/booking-transaction/payment-proof-upload";
import { BookingCancellationDialog } from "@/components/guest/booking-transaction/cancellation-dialog";
import { ReviewDialog } from "@/components/guest/reviews/review-dialog";
import { Upload, CreditCard, Eye, X, FileImage, Star } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useReviews, useCanReview, useBookingReview } from "@/hooks/useReview";
import { toast } from "sonner";

interface BookingTableRowProps {
  booking: BookingTransaction;
  onViewDetails?: (booking: BookingTransaction) => void;
  onBookingUpdate?: () => void; // Callback to refresh booking list
}

export const BookingTableRow = ({
  booking,
  onViewDetails,
  onBookingUpdate,
}: BookingTableRowProps) => {
  const [paymentProofDialogOpen, setPaymentProofDialogOpen] = useState(false);
  const [paymentProofViewDialogOpen, setPaymentProofViewDialogOpen] =
    useState(false);
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { cancelBooking } = useBookings();
  const { createReview, isSubmitting } = useReviews();
  const { canReview } = useCanReview(booking.id);
  const { review } = useBookingReview(booking.id);

  const handleCancelBooking = async (bookingId: string) => {
    setIsCancelling(true);
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      onBookingUpdate?.();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
      throw error; // Re-throw to let dialog handle it
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePaymentProofExpire = async () => {
    try {
      await handleCancelBooking(booking.id);
      toast.error("Booking automatically cancelled due to timeout");
    } catch (error) {
      console.error("Error auto-cancelling booking:", error);
    }
  };

  const handleReviewSubmit = async (data: CreateReviewInput) => {
    await createReview(data);
    onBookingUpdate?.(); // Refresh to show review status
  };

  const renderPaymentAction = () => {
    // For WAITING_PAYMENT status, show upload proof and cancel buttons
    if (booking.status === "WAITING_PAYMENT") {
      if (booking.paymentMethod === "MANUAL_TRANSFER") {
        return (
          <div className="flex gap-2">
            <Dialog
              open={paymentProofDialogOpen}
              onOpenChange={setPaymentProofDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full px-4 h-10 bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Proof
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload Payment Proof</DialogTitle>
                </DialogHeader>
                <PaymentProofUpload
                  bookingId={booking.id}
                  orderCode={booking.orderCode}
                  expiresAt={booking.expiresAt}
                  onExpire={handlePaymentProofExpire}
                  onUploadComplete={() => {
                    setPaymentProofDialogOpen(false);
                    onBookingUpdate?.();
                  }}
                />
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              size="sm"
              className="rounded-full px-4 h-10"
              onClick={() => setCancellationDialogOpen(true)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        );
      }

      if (booking.paymentMethod === "PAYMENT_GATEWAY") {
        return (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="rounded-full px-4 h-10 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // TODO: Implement Midtrans payment redirect
                console.log("Redirect to payment gateway:", booking.id);
              }}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="rounded-full px-4 h-10"
              onClick={() => setCancellationDialogOpen(true)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        );
      }
    }

    // For WAITING_CONFIRMATION with MANUAL_TRANSFER, show payment proof view
    if (
      booking.status === "WAITING_CONFIRMATION" &&
      booking.paymentMethod === "MANUAL_TRANSFER"
    ) {
      return (
        <Dialog
          open={paymentProofViewDialogOpen}
          onOpenChange={setPaymentProofViewDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 h-10"
            >
              <FileImage className="h-4 w-4 mr-2" />
              View Proof
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Payment Proof - {booking.orderCode}</DialogTitle>
            </DialogHeader>
            <PaymentProofUpload
              bookingId={booking.id}
              orderCode={booking.orderCode}
              onUploadComplete={() => {
                setPaymentProofViewDialogOpen(false);
                onBookingUpdate?.();
              }}
            />
          </DialogContent>
        </Dialog>
      );
    }

    // For COMPLETED status, show review button or review status
    if (booking.status === "COMPLETED") {
      const isPastCheckout = new Date() > new Date(booking.checkOutDate);

      if (review) {
        // Already reviewed - show review indicator and details button
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 h-10 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
              onClick={() => setReviewDialogOpen(true)}
            >
              <Star className="h-4 w-4 mr-2 fill-yellow-400" />
              {review.rating}/5
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 h-10"
              onClick={() => onViewDetails?.(booking)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        );
      }

      if (canReview && isPastCheckout) {
        // Can leave review - show review button
        return (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="rounded-full px-4 h-10 bg-yellow-500 hover:bg-yellow-600"
              onClick={() => setReviewDialogOpen(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Leave Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 h-10"
              onClick={() => onViewDetails?.(booking)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        );
      }
    }

    // For other statuses, show details button
    return (
      <Button
        variant="outline"
        size="sm"
        className="rounded-full px-6 h-10"
        onClick={() => onViewDetails?.(booking)}
      >
        <Eye className="h-4 w-4 mr-2" />
        Details
      </Button>
    );
  };

  const getStatusDisplay = () => {
    // Show review status for completed bookings
    if (booking.status === "COMPLETED" && review) {
      return (
        <div className="flex flex-col items-center gap-1">
          <StatusBadge status="COMPLETED" />
          <div className="flex items-center gap-1 text-xs text-yellow-600">
            <Star className="h-3 w-3 fill-yellow-400" />
            <span>Reviewed</span>
          </div>
        </div>
      );
    }

    // Show payment proof status for manual transfers
    if (booking.paymentMethod === "MANUAL_TRANSFER" && booking.paymentProof) {
      if (booking.paymentProof.rejectedAt) {
        return <StatusBadge status="WAITING_PAYMENT" />;
      }
      if (booking.paymentProof.acceptedAt) {
        return <StatusBadge status="PROCESSING" />;
      }
      return (
        <div className="flex flex-col items-center gap-1">
          <StatusBadge status={booking.status} />
          <span className="text-xs text-blue-600">Proof Uploaded</span>
        </div>
      );
    }

    return <StatusBadge status={booking.status} />;
  };

  return (
    <>
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
          <div className="flex justify-center">{getStatusDisplay()}</div>
        </TableCell>

        {/* Action */}
        <TableCell className="text-center py-4">
          {renderPaymentAction()}
        </TableCell>
      </TableRow>

      {/* Cancellation Dialog */}
      <BookingCancellationDialog
        booking={booking}
        open={cancellationDialogOpen}
        onOpenChange={setCancellationDialogOpen}
        onConfirmCancel={handleCancelBooking}
        isLoading={isCancelling}
      />

      {/* Review Dialog */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        bookingId={booking.id}
        propertyName={booking.Property?.name || "Property"}
        onSubmit={handleReviewSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
};
