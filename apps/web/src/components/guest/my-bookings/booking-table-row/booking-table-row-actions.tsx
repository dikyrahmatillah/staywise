"use client";

import { Button } from "@/components/ui/button";
import { PaymentProofUploadModal } from "@/components/guest/booking-transaction/payment-proof-upload-modal";
import { Upload, CreditCard, Eye, X, FileImage, Star } from "lucide-react";
import { useBookingTableRowContext } from "./booking-table-row-context";

interface BookingTableRowActionsProps {
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
  onPaymentProofExpire: () => void;
}

export const BookingTableRowActions = ({
  paymentProofDialog,
  paymentProofViewDialog,
  cancellationDialog,
  reviewDialog,
  onPaymentProofExpire,
}: BookingTableRowActionsProps) => {
  const { booking, review, canReview, onViewDetails, onBookingUpdate } =
    useBookingTableRowContext();

  // WAITING_PAYMENT actions
  if (booking.status === "WAITING_PAYMENT") {
    if (booking.paymentMethod === "MANUAL_TRANSFER") {
      return (
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="rounded-full px-4 h-10 bg-blue-600 hover:bg-blue-700"
            onClick={() => paymentProofDialog.setOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Proof
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
              onPaymentProofExpire();
            }}
          />

          <Button
            variant="destructive"
            size="sm"
            className="rounded-full px-4 h-10"
            onClick={() => cancellationDialog.setOpen(true)}
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
            onClick={() => cancellationDialog.setOpen(true)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
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
          className="rounded-full px-4 h-10"
          onClick={() => paymentProofViewDialog.setOpen(true)}
        >
          <FileImage className="h-4 w-4 mr-2" />
          View Proof
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-4 h-10 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
            onClick={() => reviewDialog.setOpen(true)}
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
      return (
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="rounded-full px-4 h-10 bg-yellow-500 hover:bg-yellow-600"
            onClick={() => reviewDialog.setOpen(true)}
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

  // Default action
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
