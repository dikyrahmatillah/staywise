"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BookingProvider } from "./context/booking-context";
import { parseBookingDetailsFromParams } from "./lib/booking-helpers";
import { PaymentTypeStep } from "./payment-type-step";
import { PaymentMethodStep } from "./payment-method-step";
import { ReviewStep } from "./review-step";
import { BookingSummaryCard } from "./booking-summary-card";

export function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Redirect to login if not authenticated - use useEffect to avoid setState during render
  useEffect(() => {
    if (!session) {
      router.push("/signin");
    }
  }, [session, router]);

  // Show loading state while checking authentication
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const bookingDetails = parseBookingDetailsFromParams(searchParams);

  return (
    <BookingProvider bookingDetails={bookingDetails}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-3xl font-semibold">
              Request to book
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Booking Steps */}
            <div className="space-y-6">
              <PaymentTypeStep />
              <PaymentMethodStep />
              <ReviewStep />
            </div>

            {/* Right Column - Booking Summary */}
            <div className="space-y-6">
              <BookingSummaryCard />
            </div>
          </div>
        </div>

        {/* Payment Upload Modal is now handled inside BookingSummaryCard */}
      </div>
    </BookingProvider>
  );
}