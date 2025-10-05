import { Decimal } from "@prisma/client/runtime/library";

interface BookingEmailData {
  id: string;
  orderCode: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: Decimal | number;
  paymentMethod: string;
  User: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  Property: {
    name: string;
    address: string;
    city: string;
  };
  Room?: {
    name: string;
  };
}

export interface EmailPaymentData {
  customerName: string;
  brandName: string;
  bookingCode: string;
  propertyName: string;
  propertyAddress: string;
  guestCount: number;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  paymentMethod: string;
  amountPaid: string;
  currency: string;
  manageBookingUrl: string;
  supportEmail: string;
  year: string;
}

/**
 * Format booking data for payment confirmation email
 */
export function formatBookingForEmail(
  booking: BookingEmailData
): EmailPaymentData {
  const customerName =
    `${booking.User.firstName || ""} ${booking.User.lastName || ""}`.trim() ||
    "Customer";

  const paymentMethodLabel =
    booking.paymentMethod === "MANUAL_TRANSFER"
      ? "Manual Bank Transfer"
      : "Online Payment Gateway";

  // Convert Decimal to string safely
  const totalAmount =
    booking.totalAmount instanceof Decimal
      ? booking.totalAmount.toString()
      : String(booking.totalAmount);

  return {
    customerName,
    brandName: "StayWise",
    bookingCode: booking.orderCode,
    propertyName: booking.Property.name,
    propertyAddress: `${booking.Property.address}, ${booking.Property.city}`,
    guestCount: 1, // You can enhance this by adding guest count to booking model
    checkInDate: booking.checkInDate.toISOString().split("T")[0],
    checkInTime: "14:00",
    checkOutDate: booking.checkOutDate.toISOString().split("T")[0],
    checkOutTime: "11:00",
    paymentMethod: paymentMethodLabel,
    amountPaid: totalAmount,
    currency: "IDR",
    manageBookingUrl: `${process.env.WEB_APP_URL}/dashboard/bookings/${booking.orderCode}`,
    supportEmail: process.env.SUPPORT_EMAIL || "support@staywise.com",
    year: new Date().getFullYear().toString(),
  };
}

/**
 * Validate booking has required data for email
 */
export function validateBookingEmailData(booking: BookingEmailData): {
  valid: boolean;
  missing?: string[];
} {
  const missing: string[] = [];

  if (!booking.User?.email) missing.push("user email");
  if (!booking.orderCode) missing.push("order code");
  if (!booking.Property?.name) missing.push("property name");
  if (!booking.Property?.address) missing.push("property address");
  if (!booking.checkInDate) missing.push("check-in date");
  if (!booking.checkOutDate) missing.push("check-out date");
  if (!booking.totalAmount && booking.totalAmount !== 0)
    missing.push("total amount");

  return {
    valid: missing.length === 0,
    ...(missing.length > 0 && { missing }),
  };
}
