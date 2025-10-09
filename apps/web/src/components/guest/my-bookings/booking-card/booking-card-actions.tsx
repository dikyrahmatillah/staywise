"use client";

import { Button } from "@/components/ui/button";
import { PaymentProofUploadModal } from "@/components/guest/booking-transaction/payment-proof-upload-modal";
import { Upload, CreditCard, Eye, X, FileImage, Star } from "lucide-react";
import { useBookingCardContext } from "./booking-card-context";

interface BookingCardActionsProps {
  paymentProofDialog: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
  paymentProofViewDialog: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
  cancellationDialog: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
  reviewDialog: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
}

export const BookingCardActions = ({
  paymentProofDialog,
  paymentProofViewDialog,
  cancellationDialog,
  reviewDialog,
}: BookingCardActionsProps) => {
  const { booking, review, canReview, onViewDetails, onBookingUpdate } =
    useBookingCardContext();

  // WAITING_PAYMENT actions
  if (booking.status === "WAITING_PAYMENT") {
    if (booking.paymentMethod === "MANUAL_TRANSFER") {
      return (
        <div className="flex flex-col gap-2">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => paymentProofDialog.setOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Payment Proof
          </Button>

          {/* Unified Upload Modal with Timer */}
          <PaymentProofUploadModal
            open={paymentProofDialog.open}
            onOpenChange={paymentProofDialog.setOpen}
            bookingId={booking.id}
            orderCode={booking.orderCode}
            totalAmount={booking.totalAmount}
            expiresAt={booking.expiresAt}
            mode="upload"
            onUploadComplete={() => {
              paymentProofDialog.setOpen(false);
              onBookingUpdate?.();
            }}
            onExpire={() => {
              paymentProofDialog.setOpen(false);
              onBookingUpdate?.();
            }}
          />

          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => cancellationDialog.setOpen(true)}
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
            onClick={() => cancellationDialog.setOpen(true)}
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
      <>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => paymentProofViewDialog.setOpen(true)}
        >
          <FileImage className="h-4 w-4 mr-2" />
          View Payment Proof
        </Button>

        {/* Unified View Modal */}
        <PaymentProofUploadModal
          open={paymentProofViewDialog.open}
          onOpenChange={paymentProofViewDialog.setOpen}
          bookingId={booking.id}
          orderCode={booking.orderCode}
          totalAmount={booking.totalAmount}
          existingProofUrl={booking.paymentProof?.imageUrl}
          mode="view"
          showUploadButton={false}
        />
      </>
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
            onClick={() => reviewDialog.setOpen(true)}
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
            onClick={() => reviewDialog.setOpen(true)}
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
