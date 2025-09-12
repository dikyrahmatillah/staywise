export type OrderStatus =
  | "WAITING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentMethod = "MANUAL_TRANSFER" | "GATEWAY";

export interface Property {
  name: string;
  location: string;
  thumbnail: string;
}

export interface Room {
  name: string;
  type: string;
}

export interface BookingTransaction {
  id: string;
  userId: string;
  tenantId: string;
  propertyId: string;
  roomId: string;
  orderCode: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  qty: number;
  pricePerNight: number;
  totalAmount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  property: Property;
  room: Room;
}

export interface StatusConfig {
  variant: "secondary" | "destructive";
  className: string;
  dot: string;
  label: string;
}
