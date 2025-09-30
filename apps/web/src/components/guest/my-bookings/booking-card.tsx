// apps/web/src/components/guest/my-bookings/booking-card.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { BookingTransaction } from "@repo/types";
import type { CreateReviewInput } from "@/types/review";
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
      throw error;
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReviewSubmit = async (data: CreateReviewInput) => {
    await createReview(data);
    onBookingUpdate?.();
  };

  const renderActions = () => {
    // WAITING_PAYMENT actions
    if (booking.status === "WAITING_PAYMENT") {
      if (booking.paymentMethod === "MANUAL_TRANSFER") {
        return (
          <div className="flex flex-col gap-2">
            <Dialog
              open={paymentProofDialogOpen}
              onOpenChange={setPaymentProofDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Payment Proof
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
              className="w-full"
              onClick={() => setCancellationDialogOpen(true)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          </div>
        );
      }

      if (booking.paymentMethod === "PAYMENT_GATEWAY") {
        return (
          <div className="flex flex-col gap-2">
            <Button variant="default" size="sm" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => setCancellationDialogOpen(true)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          </div>
        );
      }
    }

    // WAITING_CONFIRMATION actions
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
            <Button variant="outline" size="sm" className="w-full">
              <FileImage className="h-4 w-4 mr-2" />
              View Payment Proof
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

    // COMPLETED actions - show review options
    if (booking.status === "COMPLETED") {
      const isPastCheckout = new Date() > new Date(booking.checkOutDate);

      if (review) {
        return (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50"
              onClick={() => setReviewDialogOpen(true)}
            >
              <Star className="h-4 w-4 mr-2 fill-yellow-400" />
              Rated {review.rating}/5 - View Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onViewDetails?.(booking)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        );
      }

      if (canReview && isPastCheckout) {
        return (
          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              size="sm"
              className="w-full bg-yellow-500 hover:bg-yellow-600"
              onClick={() => setReviewDialogOpen(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Leave a Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onViewDetails?.(booking)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        );
      }
    }

    // Default action
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onViewDetails?.(booking)}
      >
        <Eye className="h-4 w-4 mr-2" />
        View Details
      </Button>
    );
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Property Info */}
          <PropertyInfo property={booking.Property} room={booking.Room} />

          {/* Booking Info */}
          <div className="pt-3 border-t">
            <BookingInfo
              orderCode={booking.orderCode}
              checkInDate={booking.checkInDate}
              checkOutDate={booking.checkOutDate}
              nights={booking.nights}
            />
          </div>

          {/* Payment Info */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <PaymentInfo
              totalAmount={booking.totalAmount}
              paymentMethod={booking.paymentMethod}
            />
          </div>

          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <div>
              <StatusBadge status={booking.status} />
              {booking.status === "COMPLETED" && review && (
                <div className="flex items-center justify-end gap-1 text-xs text-yellow-600 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400" />
                  <span>Reviewed</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t">{renderActions()}</div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <BookingCancellationDialog
        booking={booking}
        open={cancellationDialogOpen}
        onOpenChange={setCancellationDialogOpen}
        onConfirmCancel={handleCancelBooking}
        isLoading={isCancelling}
      />

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
