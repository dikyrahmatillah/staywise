// packages/types/src/booking.ts

import type { 
  PaymentProof, 
  GatewayPayment, 
  BookingPaymentMethod,
  OrderStatus 
} from "./prisma";

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