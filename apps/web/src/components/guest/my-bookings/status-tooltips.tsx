import type { OrderStatus } from "@repo/types";

export interface StatusTooltipContent {
  description: string;
}

export const statusTooltips: Record<OrderStatus, StatusTooltipContent> = {
  WAITING_PAYMENT: {
    description: "Please complete your payment within the time limit to confirm your booking.",
  },
  WAITING_CONFIRMATION: {
    description: "Your payment proof has been uploaded and is awaiting review by the property owner.",
  },
  PROCESSING: {
    description: "Your payment has been confirmed and the booking is being processed.",
  },
  COMPLETED: {
    description: "Your stay has been completed. You can leave a review for this property.",
  },
  CANCELED: {
    description: "This booking has been canceled. No charges have been made.",
  },
  EXPIRED: {
    description: "This booking has expired due to payment timeout.",
  },
};