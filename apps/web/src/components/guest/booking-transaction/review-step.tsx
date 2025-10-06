// apps/web/src/app/booking/components/review-step.tsx

"use client";

import { Card } from "@/components/ui/card";
import { useBookingContext } from "./context/booking-context";

export function ReviewStep() {
  const { currentStep, selectedPaymentMethod, createdBooking } =
    useBookingContext();

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            currentStep >= 3
              ? "bg-foreground text-background"
              : "border-2 border-muted-foreground text-muted-foreground"
          }`}
        >
          3
        </div>
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold font-sans ${
              currentStep < 3 ? "text-muted-foreground font-sans" : ""
            }`}
          >
            Review your request
          </h3>
          {currentStep >= 3 && (
            <div className="mt-4">
              <p className="text-green-600 font-medium font-sans">
                {selectedPaymentMethod === "midtrans"
                  ? "Payment completed successfully!"
                  : "Booking created successfully!"}
              </p>
              <p className="text-sm font-sans text-muted-foreground mt-2">
                {createdBooking && (
                  <>
                    Booking ID: {createdBooking.orderCode}
                    <br />
                    {selectedPaymentMethod === "bank"
                      ? "Please upload payment proof to complete your booking."
                      : "Your booking has been confirmed."}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
