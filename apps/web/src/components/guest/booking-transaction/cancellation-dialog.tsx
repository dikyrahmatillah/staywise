// apps/web/src/components/guest/booking/booking-cancellation-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Calendar, Clock, CreditCard } from "lucide-react";
import type { BookingTransaction } from "@repo/types";
import { formatCurrency } from "@/lib/booking-formatters";

interface BookingCancellationDialogProps {
  booking: BookingTransaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmCancel: (bookingId: string) => Promise<void>;
  isLoading?: boolean;
}

export const BookingCancellationDialog = ({
  booking,
  open,
  onOpenChange,
  onConfirmCancel,
  isLoading = false,
}: BookingCancellationDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  const handleInitialCancel = () => {
    setShowConfirmAlert(true);
  };

  const handleConfirmCancel = async () => {
    setIsProcessing(true);
    try {
      await onConfirmCancel(booking.id);
      setShowConfirmAlert(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeRemaining = () => {
    if (!booking.expiresAt) return null;

    const now = new Date().getTime();
    const expiry = new Date(booking.expiresAt).getTime();
    const difference = expiry - now;

    if (difference <= 0) return "Expired";

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-sans">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancel Booking
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 font-sans">
            {/* Warning Card */}
            <Card className="p-4 border-destructive bg-destructive/10">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium font-sans">Cancellation Warning</span>
              </div>
              <p className="text-destructive text-sm mt-1">
                This action cannot be undone. Please review your booking details
                below.
              </p>
            </Card>

            {/* Booking Details */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="font-medium font-sans">Booking Details</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">Property:</span>
                  <span className="font-medium font-sans">{booking.Property.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room:</span>
                  <span>{booking.Room.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">Check-in:</span>
                  <span>{formatDate(booking.checkInDate)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">Check-out:</span>
                  <span>{formatDate(booking.checkOutDate)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">Nights:</span>
                  <span>
                    {booking.nights} night{booking.nights > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex justify-between font-medium font-sans">
                  <span className="text-muted-foreground font-sans">Total Amount:</span>
                  <span>{formatCurrency(booking.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {booking.status === "WAITING_PAYMENT" && (
              <Card className="p-3 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2 text-blue-800 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium font-sans">Payment Timer</span>
                </div>
                <div className="text-blue-700 text-sm mt-1">
                  {booking.expiresAt ? getTimeRemaining() : "No time limit"}
                </div>
              </Card>
            )}

            {/* Cancellation Policy */}
            <Card className="p-3 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2 text-yellow-800 text-sm">
                <CreditCard className="h-4 w-4" />
                <span className="font-medium font-sans">Cancellation Policy</span>
              </div>
              <div className="text-yellow-700 text-sm mt-1">
                {booking.status === "WAITING_PAYMENT"
                  ? "No charges will be applied for cancellation before payment."
                  : "Cancellation charges may apply based on property policy."}
              </div>
            </Card>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleInitialCancel}
              disabled={isProcessing || isLoading}
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation AlertDialog */}
      <DeleteConfirmDialog
        open={showConfirmAlert}
        onOpenChange={setShowConfirmAlert}
        onConfirm={handleConfirmCancel}
        title={
          <span className="flex items-center gap-2 font-sans">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirm Cancellation
          </span>
        }
        description={
          <>
            Are you absolutely sure you want to cancel this booking for{" "}
            <span className="font-semibold font-sans">{booking.Property.name}</span>?
            <br />
            <br />
            Check-in: {formatDate(booking.checkInDate)}
            <br />
            Total Amount: {formatCurrency(booking.totalAmount)}
            <br />
            <br />
            This action cannot be undone and your booking will be permanently
            cancelled.
          </>
        }
        cancelLabel="No, Keep Booking"
        confirmLabel="Yes, Cancel Booking"
        isProcessing={isProcessing}
        processingLabel="Cancelling..."
        confirmClassName="bg-destructive hover:bg-destructive/90"
      />
    </>
  );
};
