import type { BookingTransaction } from "@/types";

export interface TenantBookingTableRowProps {
  booking: BookingTransaction;
  onApprovePayment?: (bookingId: string) => Promise<void>;
  onRejectPayment?: (bookingId: string) => Promise<void>;
  onCancelBooking?: (bookingId: string) => Promise<void>;
  onBookingUpdate?: () => void;
}

export interface BookingActionsState {
  isApproving: boolean;
  isRejecting: boolean;
  isCancelling: boolean;
}

// No more individual prop interfaces needed - components use context!
// Only keeping action-related props that aren't in context