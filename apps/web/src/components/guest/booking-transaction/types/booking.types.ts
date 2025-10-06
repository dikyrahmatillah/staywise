// apps/web/src/app/booking/types/booking-types.ts

import type { OrderStatus } from "@/types";

export interface BookingDetails {
  propertyId: string;
  propertyName: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  pets: number;
  pricePerNight: number;
}

export interface CreateBookingResponse {
  id: string;
  orderCode: string;
  snapToken?: string;
  status: OrderStatus;
  totalAmount: number;
}

export interface MidtransResult {
  order_id: string;
  status_code: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
}

export interface MidtransSnap {
  pay: (
    token: string,
    options: {
      onSuccess: (result: MidtransResult) => void;
      onPending: (result: MidtransResult) => void;
      onError: (result: MidtransResult) => void;
      onClose: () => void;
    }
  ) => void;
}

export type PaymentType = "full" | "partial";
export type PaymentMethod = "bank" | "midtrans" | null;

declare global {
  interface Window {
    snap: MidtransSnap;
  }
}
