"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useBookingSidebar } from "../context/booking-sidebar-context";
import {
  isDateDisabled as checkDateDisabled,
  isCheckoutDisabled as checkCheckoutDisabled,
  checkRangeOverlap,
} from "../utils/validation-helpers";

export function useDateAvailability() {
  const { unavailableDates, checkInDate, setCheckOutDate } = useBookingSidebar();

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      return checkDateDisabled(date, unavailableDates);
    },
    [unavailableDates]
  );

  const isCheckoutDisabled = useCallback(
    (date: Date): boolean => {
      return checkCheckoutDisabled(date, unavailableDates, checkInDate);
    },
    [unavailableDates, checkInDate]
  );

  const handleCheckInChange = useCallback(
    (date: Date | undefined) => {
      if (date && checkInDate && checkInDate <= date) {
        setCheckOutDate(undefined);
        toast.info("Check-out date reset. Please select a new check-out date.");
      }
    },
    [checkInDate, setCheckOutDate]
  );

  const getRangeOverlap = useCallback(
    (startDate: Date, endDate: Date) => {
      return checkRangeOverlap(startDate, endDate, unavailableDates);
    },
    [unavailableDates]
  );

  return {
    isDateDisabled,
    isCheckoutDisabled,
    handleCheckInChange,
    getRangeOverlap,
  };
}