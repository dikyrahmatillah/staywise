export type OrderStatus =
  | "WAITING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";
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
}

export interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
  dot: string;
  label: string;
}
