"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Diamond } from "lucide-react";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getBookingDetails = () => {
    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");

    return {
      propertyId: searchParams.get("propertyId") || "1",
      checkIn: checkInParam ? new Date(checkInParam) : new Date("2024-10-11"),
      checkOut: checkOutParam
        ? new Date(checkOutParam)
        : new Date("2024-10-12"),
      adults: Number.parseInt(searchParams.get("adults") || "2"),
      children: Number.parseInt(searchParams.get("children") || "0"),
      pets: Number.parseInt(searchParams.get("pets") || "0"),
      pricePerNight: Number.parseInt(
        searchParams.get("pricePerNight") || "xxxxx"
      ),
    };
  };

  const bookingDetails = getBookingDetails();

  const nights = Math.ceil(
    (bookingDetails.checkOut.getTime() - bookingDetails.checkIn.getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const totalPrice = bookingDetails.pricePerNight * nights;
  const totalGuests = bookingDetails.adults + bookingDetails.children;

  return (
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
            {/* Step 1 - Payment Selection */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Choose how to pay
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Pay ${totalPrice.toLocaleString()} now
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-foreground rounded-full bg-foreground"></div>
                      <span>Pay ${totalPrice.toLocaleString()} now</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-muted-foreground rounded-full"></div>
                      <div>
                        <div>Pay part now, part later</div>
                        <div className="text-sm text-muted-foreground">
                          ${Math.round(totalPrice * 0.5).toLocaleString()} now,
                          ${Math.round(totalPrice * 0.5).toLocaleString()} on
                          Oct 2. No extra fees.
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-foreground text-background hover:bg-foreground/90">
                    Continue
                  </Button>
                </div>
              </div>
            </Card>

            {/* Step 2 - Payment Method */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 border-2 border-muted-foreground rounded-full flex items-center justify-center text-sm font-semibold text-muted-foreground">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    Add payment method
                  </h3>
                </div>
              </div>
            </Card>

            {/* Step 3 - Review Request */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 border-2 border-muted-foreground rounded-full flex items-center justify-center text-sm font-semibold text-muted-foreground">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    Review your request
                  </h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <img
                  src="/luxury-villa-pool.png"
                  alt="Villa Bali"
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    Luxury Villa in Bali
                  </h3>
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
                  Cancel before October 10 for a full refund. Cancellation
                  policy
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dates</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm underline p-0 h-auto"
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
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-sm">
                  {totalGuests} guest{totalGuests > 1 ? "s" : ""}
                  {bookingDetails.pets > 0 &&
                    `, ${bookingDetails.pets} pet${
                      bookingDetails.pets > 1 ? "s" : ""
                    }`}
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h4 className="font-medium mb-4">Price details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {nights} night{nights > 1 ? "s" : ""} x $
                      {bookingDetails.pricePerNight.toLocaleString()}
                    </span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total (USD)</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
