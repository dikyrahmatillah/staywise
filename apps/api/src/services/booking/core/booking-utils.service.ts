import {
  validateBookingDataSafe,
  bookingValidationUtils,
  type BookingFormData,
  type BookingValidationResult,
} from "../../../schemas/index.js";
import type { BookingTotals } from "../../../types/booking.js";

export class BookingUtilsService {
  /**
   * Validate booking data for updates or new bookings
   */
  async validateBookingData(data: {
    checkInDate: Date;
    checkOutDate: Date;
    adults?: number;
    children?: number;
    pets?: number;
    propertyId: string;
    pricePerNight: number;
  }): Promise<BookingValidationResult> {
    const bookingData: Partial<BookingFormData> = {
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      adults: data.adults || 1,
      children: data.children || 0,
      pets: data.pets || 0,
      propertyId: data.propertyId,
      pricePerNight: data.pricePerNight,
    };

    return validateBookingDataSafe(bookingData, 10);
  }

  /**
   * Calculate booking totals using validation utilities
   */
  calculateBookingTotals(
    checkInDate: Date,
    checkOutDate: Date,
    pricePerNight: number
  ): BookingTotals {
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = bookingValidationUtils.calculateTotalPrice(
      checkInDate,
      checkOutDate,
      pricePerNight
    );

    return {
      nights,
      totalPrice,
      isValidPeriod: bookingValidationUtils.isValidBookingPeriod(
        checkInDate,
        checkOutDate
      ),
    };
  }

  /**
   * Generate a unique order code
   */
  generateOrderCode(): string {
    return `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;
  }

  /**
   * Calculate booking expiration time
   */
  calculateExpirationTime(hoursFromNow: number = 1): Date {
    return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
  }

  /**
   * Validate guest count against property limits
   */
  validateGuestCount(
    adults: number,
    children: number,
    maxGuests?: number | null
  ): { valid: boolean; message?: string } {
    const totalGuests = adults + children;

    if (maxGuests && totalGuests > maxGuests) {
      return {
        valid: false,
        message: `Total guests (${totalGuests}) exceeds property maximum (${maxGuests})`,
      };
    }

    return { valid: true };
  }

  /**
   * Check if booking period is valid
   */
  isValidBookingPeriod(checkInDate: Date, checkOutDate: Date): boolean {
    return bookingValidationUtils.isValidBookingPeriod(
      checkInDate,
      checkOutDate
    );
  }

  /**
   * Calculate the number of nights between two dates
   */
  calculateNights(checkInDate: Date, checkOutDate: Date): number {
    return Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  /**
   * Format validation errors into readable messages
   * Handle both string[] and string types for compatibility
   */
  formatValidationErrors(errors: Record<string, string[] | string>): string[] {
    const formattedErrors: string[] = [];

    for (const [field, messages] of Object.entries(errors)) {
      if (Array.isArray(messages)) {
        formattedErrors.push(...messages);
      } else {
        formattedErrors.push(messages);
      }
    }

    return formattedErrors;
  }

  /**
   * Validate total amount calculation
   */
  validateTotalAmount(
    providedAmount: number,
    checkInDate: Date,
    checkOutDate: Date,
    pricePerNight: number,
    tolerance: number = 0.01
  ): { valid: boolean; expectedAmount?: number; message?: string } {
    const calculatedAmount = bookingValidationUtils.calculateTotalPrice(
      checkInDate,
      checkOutDate,
      pricePerNight
    );

    if (Math.abs(providedAmount - calculatedAmount) > tolerance) {
      return {
        valid: false,
        expectedAmount: calculatedAmount,
        message: `Total amount mismatch. Expected: ${calculatedAmount}, Provided: ${providedAmount}`,
      };
    }

    return { valid: true };
  }
}
