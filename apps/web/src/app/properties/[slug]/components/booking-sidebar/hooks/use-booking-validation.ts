// apps/web/src/app/properties/[slug]/components/booking-sidebar/hooks/use-booking-validation.ts

"use client";

import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  validateBookingDataSafe,
  bookingValidationUtils,
  type BookingFormData,
} from "@repo/schemas";
import { useBookingSidebar } from "../context/booking-sidebar-context";
import { getEffectivePrice } from "../utils/price-calculators";

export function useBookingValidation() {
  const {
    checkInDate,
    checkOutDate,
    adults,
    childrenCount,
    pets,
    propertyId,
    pricePerNight,
    maxGuests,
    selectedRoom,
    errors,
    setErrors,
  } = useBookingSidebar();

  const validateCurrentData = useCallback(() => {
    if (!checkInDate || !checkOutDate || !propertyId) {
      setErrors({});
      return;
    }

    const currentPrice = getEffectivePrice(selectedRoom, pricePerNight);

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
    setErrors,
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

  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return errors[fieldName];
    },
    [errors]
  );

  const hasErrors = useCallback((): boolean => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  const showValidationErrors = useCallback(() => {
    const errorMessages = bookingValidationUtils.formatValidationErrors(errors);

    if (errorMessages.length === 1) {
      toast.error(errorMessages[0]);
    } else if (errorMessages.length > 1) {
      toast.error("Please fix the following issues:", {
        description: errorMessages.join(", "),
      });
    }
  }, [errors]);

  return {
    validateCurrentData,
    getFieldError,
    hasErrors,
    showValidationErrors,
  };
}