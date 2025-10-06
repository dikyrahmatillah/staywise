// apps/web/src/app/properties/[slug]/components/booking-sidebar/utils/price-calculators.ts

import { bookingValidationUtils } from "@/schemas";

/**
 * Calculate number of nights between check-in and check-out
 */
export const calculateNights = (
  checkInDate: Date | undefined,
  checkOutDate: Date | undefined
): number => {
  if (!checkInDate || !checkOutDate) return 0;
  return (
    bookingValidationUtils.calculateTotalPrice(checkInDate, checkOutDate, 1) / 1
  );
};

/**
 * Calculate total price for booking
 */
export const calculateTotalPrice = (
  checkInDate: Date | undefined,
  checkOutDate: Date | undefined,
  pricePerNight: number
): number => {
  if (!checkInDate || !checkOutDate) return 0;
  return bookingValidationUtils.calculateTotalPrice(
    checkInDate,
    checkOutDate,
    pricePerNight
  );
};

/**
 * Get effective price based on selected room or default
 */
export const getEffectivePrice = (
  selectedRoom: { basePrice: string | number } | null | undefined,
  defaultPrice: number
): number => {
  if (!selectedRoom) return defaultPrice;
  return Number(selectedRoom.basePrice);
};