// apps/web/src/app/booking/components/booking-content.tsx

"use client";

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
import { PaymentUploadModal } from "./payment-upload-modal";

export function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Redirect to login if not authenticated
  if (!session) {
    router.push("/signin");
    return <div>Redirecting to login...</div>;
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
            <h1 className="text-3xl font-semibold">Request to book</h1>
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

        {/* Payment Upload Modal */}
        <PaymentUploadModal />
      </div>
    </BookingProvider>
  );
}