// apps/web/src/app/booking/components/payment-type-step.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/booking-formatters";
import { useBookingContext } from "./context/booking-context";

export function PaymentTypeStep() {
  const {
    currentStep,
    selectedPaymentType,
    setSelectedPaymentType,
    setCurrentStep,
    totalPrice,
  } = useBookingContext();

  const handleContinue = () => {
    setCurrentStep(2);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-sans ${
            currentStep >= 1
              ? "bg-foreground text-background"
              : "border-2 border-muted-foreground text-muted-foreground"
          }`}
        >
          1
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold font-sans mb-2">
            Choose how to pay
          </h3>

          <RadioGroup
            value={selectedPaymentType}
            onValueChange={(value) =>
              setSelectedPaymentType(value as "full" | "partial")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="full" />
              <label
                htmlFor="full"
                className="cursor-pointer font-medium font-sans"
              >
                Pay {formatCurrency(totalPrice)} now
              </label>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <RadioGroupItem value="partial" id="partial" disabled />
              <label
                htmlFor="partial"
                className="cursor-not-allowed font-medium font-sans"
              >
                <div>Pay part now, part later</div>
                <div className="text-sm text-muted-foreground font-sans">
                  {formatCurrency(totalPrice * 0.5)} now,{" "}
                  {formatCurrency(totalPrice * 0.5)} on arrival. No extra fees.
                </div>
              </label>
            </div>
          </RadioGroup>

          <Button
            className="w-full mt-4 bg-foreground text-background font-sans hover:bg-foreground/90"
            onClick={handleContinue}
            disabled={currentStep > 1}
          >
            {currentStep > 1 ? "Completed" : "Continue"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
