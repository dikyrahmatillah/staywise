"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentProofUpload } from "@/components/guest/booking-transaction/payment-proof-upload";
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
          <Dialog
            open={paymentProofDialog.open}
            onOpenChange={paymentProofDialog.setOpen}
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
                  paymentProofDialog.setOpen(false);
                  onBookingUpdate?.();
                }}
              />
            </DialogContent>
          </Dialog>

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
      <Dialog
        open={paymentProofViewDialog.open}
        onOpenChange={paymentProofViewDialog.setOpen}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <FileImage className="h-4 w-4 mr-2" />
            View Payment Proof
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* <DialogHeader>
            <DialogTitle>Payment Proof - {booking.orderCode}</DialogTitle>
          </DialogHeader> */}
          <PaymentProofUpload
            bookingId={booking.id}
            orderCode={booking.orderCode}
            onUploadComplete={() => {
              paymentProofViewDialog.setOpen(false);
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
