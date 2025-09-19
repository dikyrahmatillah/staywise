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
import type { BookingTransaction } from "@repo/types";
import { PropertyInfo } from "@/components/guest/my-bookings/property-info";
import { BookingInfo } from "@/components/guest/my-bookings/booking-info";
import { PaymentInfo } from "@/components/guest/my-bookings/payment-info";
import { StatusBadge } from "@/components/guest/my-bookings/status-badge";
import { PaymentProofUpload } from "@/components/guest/payment-proof-upload";
import { Upload, CreditCard, Eye } from "lucide-react";

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

  const renderPaymentAction = () => {
    // Only show payment actions for WAITING_PAYMENT status
    if (booking.status !== "WAITING_PAYMENT") {
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
    }

    // Show different actions based on payment method
    if (booking.paymentMethod === "MANUAL_TRANSFER") {
      return (
        <div className="flex gap-2">
          <Dialog
            open={paymentProofDialogOpen}
            onOpenChange={setPaymentProofDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-4 h-10"
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
                onUploadComplete={() => {
                  setPaymentProofDialogOpen(false);
                  onBookingUpdate?.();
                }}
              />
            </DialogContent>
          </Dialog>

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

    return null;
  };

  const getStatusDisplay = () => {
    // Show payment proof status for manual transfers
    if (booking.paymentMethod === "MANUAL_TRANSFER" && booking.paymentProof) {
      if (booking.paymentProof.rejectedAt) {
        return <StatusBadge status="CANCELED" />;
      }
      if (booking.paymentProof.acceptedAt) {
        return <StatusBadge status="WAITING_CONFIRMATION" />;
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
  );
};
