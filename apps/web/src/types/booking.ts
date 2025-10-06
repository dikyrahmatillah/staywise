// packages/types/src/booking.ts

import type {
  PaymentProof,
  GatewayPayment,
  BookingPaymentMethod,
  OrderStatus,
} from "@/types/prisma.js";

// Main booking transaction interface for frontend
export interface BookingTransaction {
  id: string;
  userId: string;
  tenantId: string;
  propertyId: string;
  roomId: string;
  orderCode: string;
  status: OrderStatus;
  paymentMethod: BookingPaymentMethod;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  qty: number;
  pricePerNight: number;
  totalAmount: number;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  Property: {
    name: string;
    city: string;
  };
  Room: {
    name: string;
  };
  User: {
    firstName: string;
    lastName: string;
    email: string;
  };
  paymentProof?: PaymentProof | null;
  gatewayPayment?: GatewayPayment | null;
}

// Property and Room types for UI components
export interface Property {
  name: string;
  location?: string;
  thumbnail?: string;
}

export interface Room {
  name: string;
  type?: string;
}

export interface CreateBookingInput {
  userId: string;
  propertyId: string;
  roomId: string;
  checkIn: string | Date;
  checkOut: string | Date;
  adults?: number;
  children?: number;
  pets?: number;
  pricePerNight: number;
  totalAmount: number;
  paymentMethod?: BookingPaymentMethod;
}

// Room availability result (shared between API and frontend)
export interface RoomAvailabilityResult {
  available: boolean;
  message: string;
  unavailableDates?: Date[];
  pricing?: {
    basePrice?: number;
    hasAdjustments: boolean;
  } | null;
  conflictingDates?: Array<{
    checkIn: Date;
    checkOut: Date;
    orderCode: string;
  }>;
}

// Booking filters for queries (shared between frontend and API)
export interface BookingFilters {
  userId?: string;
  tenantId?: string;
  propertyId?: string;
  status?: string[];
  includeExpired?: boolean;
}

// Availability check parameters (used by frontend booking forms)
export interface AvailabilityCheckParams {
  propertyId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  adults?: number;
  children?: number;
  pets?: number;
  pricePerNight: number;
}

// Booking calculation results (useful for frontend price display)
export interface BookingTotals {
  nights: number;
  totalPrice: number;
  isValidPeriod: boolean;
}

// Booking validation data (shared validation structure)
export interface BookingValidationData {
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  pets: number;
  propertyId: string;
  pricePerNight: number;
}

// Booking validation data (shared validation structure)
export interface BookingValidationData {
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  pets: number;
  propertyId: string;
  pricePerNight: number;
}

// Enhanced availability result with validation
export interface AvailabilityWithValidationResult
  extends RoomAvailabilityResult {
  nights?: number;
  totalPrice?: number;
  validationPassed?: boolean;
  validationErrors?: any;
}
