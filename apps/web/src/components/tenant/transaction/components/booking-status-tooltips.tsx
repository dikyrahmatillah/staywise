// apps/web/src/components/tenant/transaction/tenant-status-tooltips.tsx
import type { OrderStatus } from "@/types";

export interface StatusTooltipContent {
  description: string;
}

export const tenantStatusTooltips: Record<OrderStatus, StatusTooltipContent> = {
  WAITING_PAYMENT: {
    description:
      "Guest has not completed payment yet. The booking will expire if payment is not received within the time limit.",
  },
  WAITING_CONFIRMATION: {
    description:
      "Guest has uploaded payment proof. Please review and approve or reject the payment to proceed with the booking.",
  },
  PROCESSING: {
    description:
      "Payment confirmed and booking is being processed. The room dates are now blocked for this reservation.",
  },
  COMPLETED: {
    description:
      "Guest has checked out. You can now view the booking details and any reviews left by the guest.",
  },
  CANCELED: {
    description:
      "This booking has been canceled or canceled by the guest. The room is available for new bookings.",
  },
  EXPIRED: {
    description:
      "Booking expired due to non-payment within the time limit. The room is available for new bookings.",
  },
};
