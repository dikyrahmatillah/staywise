// apps/web/src/app/booking/lib/booking-helpers.ts

import type { BookingDetails } from "../types/booking.types";

export function parseBookingDetailsFromParams(
  searchParams: URLSearchParams
): BookingDetails {
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  return {
    propertyId: searchParams.get("propertyId") || "1",
    propertyName: searchParams.get("propertyName") || "",
    roomId: searchParams.get("roomId") || "1",
    checkIn: checkInParam ? new Date(checkInParam) : new Date("2024-10-11"),
    checkOut: checkOutParam ? new Date(checkOutParam) : new Date("2024-10-12"),
    adults: Number.parseInt(searchParams.get("adults") || "2"),
    children: Number.parseInt(searchParams.get("children") || "0"),
    pets: Number.parseInt(searchParams.get("pets") || "0"),
    pricePerNight: Number.parseInt(
      searchParams.get("pricePerNight") || "1_000_000"
    ),
  };
}

export function validatePaymentFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const maxSize = 1 * 1024 * 1024; // 1MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG and PNG files are allowed.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File too large. Maximum size is 1MB.",
    };
  }

  return { valid: true };
}
