// apps/web/src/components/tenant/transaction/booking-table-row.tsx

"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";

// Context Provider
import { BookingRowProvider } from "@/components/tenant/transaction/context/booking-row-context";

// Types
import type { TenantBookingTableRowProps } from "./booking-table-row.types";

// Components - No props needed, they use context!
import { GuestInfo } from "@/components/tenant/transaction/components/guest-info";
import { PropertyRoomInfo } from "@/components/tenant/transaction/components/property-room-info";
import { BookingDetails } from "@/components/tenant/transaction/components/booking-details";
import { PaymentInfo } from "@/components/tenant/transaction/components/payment-info";
import { BookingStatusDisplay } from "@/components/tenant/transaction/components/booking-status-display";
import { BookingActions } from "@/components/tenant/transaction/components/booking-actions";
import { PaymentProofViewer } from "@/components/tenant/transaction/components/payment-proof-viewer";

// Hooks
import { useBookingActions } from "@/components/tenant/transaction/hooks/use-booking-actions";

/**
 * Main booking table row component for tenant transaction management
 * Uses Context API to eliminate prop drilling
 * Displays booking information and provides actions for payment approval/rejection
 */
export const TenantBookingTableRow = ({
  booking,
  onApprovePayment,
  onRejectPayment,
  onCancelBooking,
  onBookingUpdate,
}: TenantBookingTableRowProps) => {
  // Local state for payment proof dialog
  const [paymentProofDialogOpen, setPaymentProofDialogOpen] = useState(false);

  // Custom hook for handling booking actions
  const { actionsState, handleApprove, handleReject, handleCancel } =
    useBookingActions({
      bookingId: booking.id,
      onApprovePayment,
      onRejectPayment,
      onCancelBooking,
      onBookingUpdate,
    });

  // Handler for viewing booking details
  const handleViewDetails = () => {
    console.log("View booking details:", booking.id);
    // TODO: Implement details view logic
  };

  return (
    <BookingRowProvider booking={booking}>
      <TableRow className="hover:bg-muted/50">
        {/* Guest Information */}
        <TableCell className="py-4">
          <GuestInfo />
        </TableCell>

        {/* Property & Room Information */}
        <TableCell className="py-4">
          <PropertyRoomInfo />
        </TableCell>

        {/* Booking Details (Order Code, Dates, Nights) */}
        <TableCell className="text-center py-4">
          <BookingDetails />
        </TableCell>

        {/* Payment Information */}
        <TableCell className="text-center py-4">
          <PaymentInfo />
        </TableCell>

        {/* Status Badge with Payment Proof Info */}
        <TableCell className="text-center py-4">
          <div className="flex justify-center">
            <BookingStatusDisplay />
          </div>
        </TableCell>

        {/* Action Buttons */}
        <TableCell className="text-center py-4">
          <BookingActions
            actionsState={actionsState}
            onApprove={handleApprove}
            onReject={handleReject}
            onCancel={handleCancel}
            onViewPaymentProof={() => setPaymentProofDialogOpen(true)}
            onViewDetails={handleViewDetails}
          />
        </TableCell>
      </TableRow>

      {/* Payment Proof Viewer Dialog */}
      <PaymentProofViewer
        open={paymentProofDialogOpen}
        onOpenChange={setPaymentProofDialogOpen}
      />
    </BookingRowProvider>
  );
};
