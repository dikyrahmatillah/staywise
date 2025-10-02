// apps/web/src/app/booking/components/payment-method-step.tsx

"use client";

import { Card } from "@/components/ui/card";
import { Building2, CreditCard } from "lucide-react";
import { useBookingContext } from "./context/booking-context";
import type { PaymentMethod } from "./types/booking.types";

export function PaymentMethodStep() {
  const { currentStep, selectedPaymentMethod, setSelectedPaymentMethod } =
    useBookingContext();

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            currentStep >= 2
              ? "bg-foreground text-background"
              : "border-2 border-muted-foreground text-muted-foreground"
          }`}
        >
          2
        </div>
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold mb-2 ${
              currentStep < 2 ? "text-muted-foreground" : ""
            }`}
          >
            Add payment method
          </h3>

          {currentStep >= 2 && (
            <div className="space-y-4 mt-4">
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPaymentMethod === "bank"
                    ? "border-foreground bg-muted/50"
                    : "border-muted-foreground hover:border-foreground/50"
                }`}
                onClick={() => handleMethodSelect("bank")}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Manual Transfer via Bank</div>
                    <div className="text-sm text-muted-foreground">
                      Upload payment proof after transfer
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPaymentMethod === "midtrans"
                    ? "border-foreground bg-muted/50"
                    : "border-muted-foreground hover:border-foreground/50"
                }`}
                onClick={() => handleMethodSelect("midtrans")}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <div className="font-medium">
                      Payment Gateway (Midtrans)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Pay instantly with credit card or e-wallet
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}