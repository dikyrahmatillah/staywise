"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { bookingValidationUtils } from "@repo/schemas";
import { useBookingSidebar } from "../context/booking-sidebar-context";
import { useBookingValidation } from "./use-booking-validation";
import { useDateAvailability } from "./use-date-availability";
import { formatDateForBooking } from "../utils/date-formatters";
import { calculateNights, getEffectivePrice } from "../utils/price-calculators";

export function useBookingNavigation() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    checkInDate,
    checkOutDate,
    adults,
    childrenCount,
    pets,
    propertyId,
    selectedRoom,
    pricePerNight,
    propertyName,
    propertyCity,
    propertyRating,
    reviewCount,
    setIsBooking,
  } = useBookingSidebar();

  const { validateCurrentData, hasErrors, showValidationErrors } =
    useBookingValidation();
  const { getRangeOverlap } = useDateAvailability();

  const handleBookNow = useCallback(async () => {
    // Check authentication status
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

    // Validate required fields
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

    // Check for date range overlap
    const overlapCheck = getRangeOverlap(checkInDate, checkOutDate);
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

    if (hasErrors()) {
      showValidationErrors();
      return;
    }

    setIsBooking(true);

    try {
      // Final availability check
      const isAvailable = bookingValidationUtils.checkDateAvailability(
        checkInDate,
        checkOutDate
      );

      if (!isAvailable) {
        toast.error("Selected dates are no longer available", {
          description: "Please choose different dates.",
        });
        setIsBooking(false);
        return;
      }

      const loadingToast = toast.loading("Processing your booking...");

      const currentPrice = getEffectivePrice(selectedRoom, pricePerNight);
      const nights = calculateNights(checkInDate, checkOutDate);
      const totalPrice = nights * currentPrice;

      const bookingParams = new URLSearchParams({
        propertyId: propertyId || "",
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        propertyName: propertyName || "",
        propertyCity: propertyCity || "",
        propertyRating: propertyRating?.toString() || "0",
        reviewCount: reviewCount?.toString() || "0",
        checkIn: formatDateForBooking(checkInDate),
        checkOut: formatDateForBooking(checkOutDate),
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
  }, [
    status,
    session,
    checkInDate,
    checkOutDate,
    adults,
    childrenCount,
    pets,
    propertyId,
    selectedRoom,
    pricePerNight,
    propertyName,
    propertyCity,
    propertyRating,
    reviewCount,
    router,
    validateCurrentData,
    hasErrors,
    showValidationErrors,
    getRangeOverlap,
    setIsBooking,
  ]);

  return {
    handleBookNow,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}