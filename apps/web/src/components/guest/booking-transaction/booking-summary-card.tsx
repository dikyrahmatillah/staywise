// apps/web/src/app/booking/components/booking-summary-card.tsx

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/booking-formatters";
import { toast } from "sonner";
import { useBookingContext } from "./context/booking-context";
import { useBookingCreation } from "./hooks/use-booking-creation";
import { useMidtrans } from "./hooks/use-midtrans";

export function BookingSummaryCard() {
  const router = useRouter();
  const {
    currentStep,
    selectedPaymentMethod,
    selectedPaymentType,
    bookingDetails,
    nights,
    totalPrice,
    totalGuests,
    isProcessing,
    setIsProcessing,
    setCreatedBooking,
    setCurrentStep,
    setIsUploadModalOpen,
    createdBooking,
  } = useBookingContext();

  const { createBooking, handleError } = useBookingCreation();
  const { processMidtransPayment } = useMidtrans();

  const handlePayNow = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      const booking = await createBooking();
      setCreatedBooking(booking);

      if (selectedPaymentMethod === "midtrans" && booking.snapToken) {
        processMidtransPayment(booking.snapToken);
      } else if (selectedPaymentMethod === "bank") {
        toast.success(
          "Booking created! Please upload payment proof within 1 hour."
        );
        setIsUploadModalOpen(true);
        setCurrentStep(3);
      }
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Luxury Villa in Bali</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>★ 4.83 (92)</span>
            <span>•</span>
            <span>Superhost</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="text-sm font-medium">Free cancellation</div>
        <div className="text-sm text-muted-foreground">
          Cancel before October 10 for a full refund. Cancellation policy
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Dates</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm underline p-0 h-auto"
            disabled={currentStep >= 3}
          >
            Edit
          </Button>
        </div>
        <div className="text-sm">
          {bookingDetails.checkIn.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}{" "}
          -{" "}
          {bookingDetails.checkOut.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium">Guests</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm underline p-0 h-auto"
            disabled={currentStep >= 3}
          >
            Edit
          </Button>
        </div>
        <div className="text-sm">
          {totalGuests} guest{totalGuests > 1 ? "s" : ""}
          {bookingDetails.pets > 0 &&
            `, ${bookingDetails.pets} pet${bookingDetails.pets > 1 ? "s" : ""}`}
        </div>
      </div>

      <div className="border-t pt-4 mt-6">
        <h4 className="font-medium mb-4">Price details</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>
              {nights} night{nights > 1 ? "s" : ""} x Rp
              {bookingDetails.pricePerNight.toLocaleString()}
            </span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-semibold">
            <span>Total (IDR)</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        {currentStep >= 2 && selectedPaymentMethod && currentStep < 3 && (
          <div className="mt-4">
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              onClick={handlePayNow}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </div>
        )}

        {currentStep >= 3 && (
          <div className="mt-4">
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard/guest")}
            >
              View My Bookings
            </Button>
          </div>
        )}
      </div>

      {currentStep >= 3 && createdBooking && (
        <div className="border-t pt-4 mt-6">
          <h4 className="font-medium mb-4">Booking Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Booking ID:</span>
              <span className="font-mono">{createdBooking.orderCode}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="capitalize">{createdBooking.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>{formatCurrency(createdBooking.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}