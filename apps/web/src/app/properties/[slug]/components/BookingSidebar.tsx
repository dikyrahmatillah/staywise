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
import { formatCurrency } from "@/lib/booking-formatters";

type Room = {
  id: string;
  name: string;
  basePrice: string | number;
  bedCount?: number;
  bedType?: string | null;
  capacity?: number;
  imageUrl?: string | null;
};

interface BookingSidebarProps {
  pricePerNight: number;
  maxGuests?: number;
  propertyId?: string;
  unavailableDates?: Date[];
  selectedRoom?: Room | null;
  propertyName?: string;
  propertyCity?: string;
  propertyRating?: number;
  reviewCount?: number;
}

export function BookingSidebar({
  pricePerNight,
  maxGuests = 10,
  propertyId,
  unavailableDates = [],
  selectedRoom,
  propertyName,
  propertyCity,
  propertyRating,
  reviewCount,
}: BookingSidebarProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [pets, setPets] = useState(0);
  // effective max depends on selected room, falling back to property max
  const effectiveMaxGuests = selectedRoom?.capacity ?? maxGuests;
  const [guestSelectorOpen, setGuestSelectorOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isBooking, setIsBooking] = useState(false);

  const validateCurrentData = useCallback(() => {
    if (!checkInDate || !checkOutDate || !propertyId) {
      setErrors({});
      return;
    }

    // Use selected room price if available, otherwise fall back to pricePerNight
    const currentPrice = selectedRoom
      ? Number(selectedRoom.basePrice)
      : pricePerNight;

    const bookingData: Partial<BookingFormData> = {
      checkInDate,
      checkOutDate,
      adults,
      children: childrenCount,
      pets,
      propertyId,
      pricePerNight: currentPrice,
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
    selectedRoom,
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

  // When selected room changes, clamp guest values to the effective max
  useEffect(() => {
    const total = adults + childrenCount;
    if (total > effectiveMaxGuests) {
      const overflow = total - effectiveMaxGuests;
      setChildrenCount((c) => {
        if (c >= overflow) return c - overflow;
        return 0;
      });
      setAdults((a) => Math.max(1, a - Math.max(0, overflow - childrenCount)));
      toast.info(`Guest count adjusted to room max: ${effectiveMaxGuests}`);
    }
  }, [selectedRoom, adults, childrenCount, effectiveMaxGuests]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return (
      bookingValidationUtils.calculateTotalPrice(checkInDate, checkOutDate, 1) /
      1
    );
  };

  const nights = calculateNights();
  // Use selected room price if available, otherwise fall back to pricePerNight
  const currentPrice = selectedRoom
    ? Number(selectedRoom.basePrice)
    : pricePerNight;
  const totalPrice = bookingValidationUtils.calculateTotalPrice(
    checkInDate || new Date(),
    checkOutDate || new Date(),
    currentPrice
  );

  // Check if a date range overlaps with any booked dates
  const checkRangeOverlap = (
    startDate: Date,
    endDate: Date
  ): { hasOverlap: boolean; conflictDates: string[] } => {
    const conflicts: string[] = [];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current < end) {
      const isConflict = unavailableDates.some((unavailableDate) => {
        const unavailableDay = new Date(unavailableDate);
        unavailableDay.setHours(0, 0, 0, 0);
        return current.getTime() === unavailableDay.getTime();
      });

      if (isConflict) {
        conflicts.push(
          current.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        );
      }

      current.setDate(current.getDate() + 1);
    }

    return {
      hasOverlap: conflicts.length > 0,
      conflictDates: conflicts,
    };
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) return true;

    // Disable unavailable dates from bookings
    const isUnavailable = unavailableDates.some((unavailableDate) => {
      const unavailableDay = new Date(unavailableDate);
      unavailableDay.setHours(0, 0, 0, 0);
      const currentDay = new Date(date);
      currentDay.setHours(0, 0, 0, 0);
      return unavailableDay.getTime() === currentDay.getTime();
    });

    return isUnavailable;
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

      const currentUrl = window.location.pathname + window.location.search;
      const returnUrl = encodeURIComponent(currentUrl);

      setTimeout(() => {
        router.push(`/signin?callbackUrl=${returnUrl}`);
      }, 1500);
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (!selectedRoom) {
      toast.error("Please select a room");
      return;
    }

    if (adults === 0) {
      toast.error("Please select at least one adult guest");
      return;
    }

    // 🚨 CHECK FOR DATE RANGE OVERLAP BEFORE PROCEEDING
    const overlapCheck = checkRangeOverlap(checkInDate, checkOutDate);
    if (overlapCheck.hasOverlap) {
      toast.error("Cannot Book: Date Conflict", {
        description: `This room is already booked on: ${overlapCheck.conflictDates.join(
          ", "
        )}. Please select different dates.`,
        duration: 8000,
      });
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

      const loadingToast = toast.loading("Processing your booking...");

      const formatDateForBooking = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const bookingParams = new URLSearchParams({
        propertyId: propertyId || "1",
        roomId: selectedRoom?.id || "",
        roomName: selectedRoom?.name || "",
        propertyName: propertyName || "",
        propertyCity: propertyCity || "",
        propertyRating: propertyRating?.toString() || "0",
        reviewCount: reviewCount?.toString() || "0",
        checkIn: formatDateForBooking(checkInDate!),
        checkOut: formatDateForBooking(checkOutDate!),
        adults: adults.toString(),
        children: childrenCount.toString(),
        pets: pets.toString(),
        pricePerNight: currentPrice.toString(),
        totalPrice: totalPrice.toString(),
        nights: nights.toString(),
        userId: session.user.id,
        userEmail: session.user.email,
      });

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
      <Card className="border-slate-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="font-sans text-3xl font-bold">
              {formatCurrency(currentPrice)}
            </span>
            <span className="font-sans text-muted-foreground text-sm">
              /night
            </span>
          </div>
          {selectedRoom && (
            <div className="text-sm font-medium text-slate-600">
              {selectedRoom.name}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn" className="text-sm font-medium">
                Check-in
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal mt-1.5 bg-white border-slate-200 hover:bg-slate-50 px-3 py-3 sm:py-2 min-h-[44px] ${
                      getFieldError("checkInDate")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-slate-500" />
                    {formatDateDisplay(checkInDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-auto max-w-[420px] p-0 border-slate-200 left-0 right-0 mx-0 sm:mx-0">
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
              <Label htmlFor="checkOut" className="text-sm font-medium">
                Check-out
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal mt-1.5 bg-white border-slate-200 hover:bg-slate-50 px-3 py-3 sm:py-2 min-h-[44px] ${
                      getFieldError("checkOutDate")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-slate-500" />
                    {formatDateDisplay(checkOutDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-auto max-w-[420px] p-0 border-slate-200 left-0 right-0 mx-0 sm:mx-0">
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
          <div className="pb-2">
            <div className="flex flex-row justify-between mb-1.5">
              <Label className="text-sm font-medium">Guests</Label>
              <span className="text-xs text-slate-500 font-normal">
                Max: {effectiveMaxGuests} guests
              </span>
            </div>
            <div
              className={`border rounded-md bg-white border-slate-200 ${
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
                maxGuests={effectiveMaxGuests}
              />
            </div>
            {getFieldError("adults") && (
              <p className="text-sm text-red-500 mt-1">
                {getFieldError("adults")}
              </p>
            )}
          </div>

          {checkInDate &&
            checkOutDate &&
            adults > 0 &&
            !hasErrors() &&
            (() => {
              const overlapCheck = checkRangeOverlap(checkInDate, checkOutDate);

              if (overlapCheck.hasOverlap) {
                return (
                  <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <svg
                      className="h-5 w-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div className="text-xs">
                      This room is already booked on:{" "}
                      <span className="font-medium">
                        {overlapCheck.conflictDates.join(", ")}
                      </span>
                      . Please select different dates.
                    </div>
                  </div>
                );
              }

              return (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Ready to book!</span>
                </div>
              );
            })()}

          {nights > 0 && (
            <>
              {/* Desktop / tablet layout */}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg ">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    × {nights} night{nights > 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Total
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <div className="font-bold text-lg">
                    {formatCurrency(totalPrice)}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Book Now Button */}
          <Button
            className="w-full text-base font-semibold rounded-lg py-6  shadow-md hover:shadow-lg transition-all duration-300"
            onClick={handleBookNow}
            disabled={status === "loading" || isBooking}
          >
            {isBooking ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : !session ? (
              "Log in to Book"
            ) : (
              "Book Now"
            )}
          </Button>

          {!session && (
            <p className="text-xs text-center text-slate-500 mt-2">
              You&apos;ll need to log in before completing your booking
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
