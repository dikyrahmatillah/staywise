"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarIcon, Loader2, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { GuestSelector } from "@/components/booking-card/guest-selector";
import {
  bookingValidationUtils,
  validateBookingDataSafe,
  type BookingFormData,
} from "@repo/schemas";

interface BookingSidebarProps {
  pricePerNight: number;
  maxGuests?: number;
  propertyId?: string;
  unavailableDates?: Date[];
}

export function BookingSidebar({
  pricePerNight,
  maxGuests = 10,
  propertyId,
  unavailableDates = [],
}: BookingSidebarProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [pets, setPets] = useState(0);
  const [guestSelectorOpen, setGuestSelectorOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isBooking, setIsBooking] = useState(false);

  const validateCurrentData = useCallback(() => {
    if (!checkInDate || !checkOutDate || !propertyId) {
      setErrors({});
      return;
    }

    const bookingData: Partial<BookingFormData> = {
      checkInDate,
      checkOutDate,
      adults,
      children: childrenCount,
      pets,
      propertyId,
      pricePerNight,
    };

    const result = validateBookingDataSafe(bookingData, maxGuests);
    setErrors(result.errors || {});
  }, [
    checkInDate,
    checkOutDate,
    adults,
    childrenCount,
    pets,
    propertyId,
    pricePerNight,
    maxGuests,
  ]);

  // Real-time validation
  useEffect(() => {
    if (checkInDate || checkOutDate || adults || childrenCount || pets) {
      validateCurrentData();
    }
  }, [
    checkInDate,
    checkOutDate,
    adults,
    childrenCount,
    pets,
    pricePerNight,
    propertyId,
    validateCurrentData,
  ]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return (
      bookingValidationUtils.calculateTotalPrice(checkInDate, checkOutDate, 1) /
      1
    );
  };

  const nights = calculateNights();
  const totalPrice = bookingValidationUtils.calculateTotalPrice(
    checkInDate || new Date(),
    checkOutDate || new Date(),
    pricePerNight
  );

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) return true;

    // Disable unavailable dates
    return unavailableDates.some(
      (unavailableDate) =>
        date.toDateString() === unavailableDate.toDateString()
    );
  };

  const isCheckoutDisabled = (date: Date) => {
    if (isDateDisabled(date)) return true;

    // If check-in is selected, disable dates before or equal to check-in
    if (checkInDate) {
      return date <= checkInDate;
    }

    return false;
  };

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckInDate(date);
    // Reset checkout if it's before the new checkin date
    if (date && checkOutDate && checkOutDate <= date) {
      setCheckOutDate(undefined);
      toast.info("Check-out date reset. Please select a new check-out date.");
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  const hasErrors = useCallback((): boolean => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  const showValidationErrors = () => {
    const errorMessages = bookingValidationUtils.formatValidationErrors(errors);

    if (errorMessages.length === 1) {
      toast.error(errorMessages[0]);
    } else if (errorMessages.length > 1) {
      toast.error("Please fix the following issues:", {
        description: errorMessages.join(", "),
      });
    }
  };

  const handleBookNow = async () => {
    if (status === "loading") {
      toast.info("Checking authentication...");
      return;
    }

    if (status === "unauthenticated" || !session) {
      toast.error("Please log in to continue with your booking");

      // Build return URL for post-login redirect
      const currentUrl = window.location.pathname + window.location.search;
      const returnUrl = encodeURIComponent(currentUrl);

      // Delay redirect slightly to let user see the toast
      setTimeout(() => {
        router.push(`/guest-signin?callbackUrl=${returnUrl}`);
      }, 1500);
      return;
    }

    // Always allow booking attempt, but validate first
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (adults === 0) {
      toast.error("Please select at least one adult guest");
      return;
    }

    // Validate booking data
    validateCurrentData();

    // Show validation errors if any exist
    if (hasErrors()) {
      showValidationErrors();
      return;
    }

    setIsBooking(true);

    try {
      // Additional availability check (you can integrate with your backend here)
      const isAvailable = bookingValidationUtils.checkDateAvailability(
        checkInDate!,
        checkOutDate!
      );

      if (!isAvailable) {
        toast.error("Selected dates are no longer available", {
          description: "Please choose different dates.",
        });
        setIsBooking(false);
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Processing your booking...");

      const bookingParams = new URLSearchParams({
        propertyId: propertyId || "1",
        checkIn: checkInDate!.toISOString(),
        checkOut: checkOutDate!.toISOString(),
        adults: adults.toString(),
        children: childrenCount.toString(),
        pets: pets.toString(),
        pricePerNight: pricePerNight.toString(),
        totalPrice: totalPrice.toString(),
        nights: nights.toString(),
        userId: session.user.id,
        userEmail: session.user.email,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      router.push(`/booking?${bookingParams.toString()}`);
    } catch (error) {
      console.error("Booking processing error:", error);
      toast.error("Booking Error", {
        description:
          "An error occurred while processing your booking. Please try again.",
      });
      setIsBooking(false);
    }
  };

  const formatDateDisplay = (date: Date | undefined) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="sticky top-20">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-baseline gap-0.5">
            <span className="font-sans text-3xl font-bold">
              ${pricePerNight}
            </span>
            <span className="font-sans text-muted-foreground">/night</span>
          </div>
          {nights > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              ${pricePerNight} x {nights} night{nights > 1 ? "s" : ""} ={" "}
              <span className="font-semibold text-foreground">
                ${totalPrice}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal bg-transparent ${
                      getFieldError("checkInDate")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateDisplay(checkInDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={checkInDate}
                    onSelect={handleCheckInChange}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {getFieldError("checkInDate") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("checkInDate")}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="checkOut">Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal bg-transparent ${
                      getFieldError("checkOutDate")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateDisplay(checkOutDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={isCheckoutDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {getFieldError("checkOutDate") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("checkOutDate")}
                </p>
              )}
            </div>
          </div>

          {/* Guest Selection */}
          <div>
            <div className="flex flex-row justify-between">
              <Label>Guests</Label>
              <Label className="text-sm text-muted-foreground">
                Max: {maxGuests} guests
              </Label>
            </div>
            <div
              className={`border rounded-md ${
                getFieldError("adults") ? "border-red-500" : ""
              }`}
            >
              <GuestSelector
                adults={adults}
                childrenCount={childrenCount}
                pets={pets}
                onAdultsChange={setAdults}
                onChildrenChange={setChildrenCount}
                onPetsChange={setPets}
                isOpen={guestSelectorOpen}
                onOpenChange={setGuestSelectorOpen}
                maxGuests={maxGuests}
              />
            </div>
            {getFieldError("adults") && (
              <p className="text-sm text-red-500 mt-1">
                {getFieldError("adults")}
              </p>
            )}
          </div>

          {/* Success Indicator - simplified logic */}
          {checkInDate && checkOutDate && adults > 0 && !hasErrors() && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Ready to book!</span>
            </div>
          )}

          {/* Book Now Button */}
          <Button
            className="w-full text-[16px] rounded-full py-6"
            onClick={handleBookNow}
            disabled={status === "loading"}
          >
            {isBooking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : !session ? (
              "Log in to Book"
            ) : (
              "Book Now"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
