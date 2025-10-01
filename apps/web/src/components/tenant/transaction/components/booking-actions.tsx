import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, FileImage, Trash2 } from "lucide-react";
import {
  needsPaymentConfirmation,
  isWaitingPaymentNoproof,
  hasUnprocessedPaymentProof,
} from "@/components/tenant/transaction/booking-helpers";
import { useBookingRow } from "@/components/tenant/transaction/context/booking-row-context";
import type { BookingActionsState } from "@/components/tenant/transaction/table-row/booking-table-row.types";

interface BookingActionsProps {
  actionsState: BookingActionsState;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
  onViewPaymentProof: () => void;
  onViewDetails: () => void;
}

export const BookingActions = ({
  actionsState,
  onApprove,
  onReject,
  onCancel,
  onViewPaymentProof,
  onViewDetails,
}: BookingActionsProps) => {
  const { booking } = useBookingRow();

  // Case 1: Waiting for payment with no proof uploaded - show cancel option
  if (isWaitingPaymentNoproof(booking)) {
    return (
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          className="rounded-sm px-3 h-8"
          onClick={onCancel}
          disabled={actionsState.isCancelling}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          {actionsState.isCancelling ? "Cancelling..." : "Cancel"}
        </Button>
      </div>
    );
  }

  // Case 2: Payment proof uploaded but waiting for processing - show view button
  if (hasUnprocessedPaymentProof(booking)) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="rounded-sm"
        onClick={onViewPaymentProof}
      >
        <FileImage className="h-3 w-3" />
      </Button>
    );
  }

  // Case 3: Needs payment confirmation - show approve/reject buttons
  if (needsPaymentConfirmation(booking)) {
    return (
      <div className="flex flex-col gap-2">
        {/* View Payment Proof */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm px-3 h-8"
          onClick={onViewPaymentProof}
        >
          <FileImage className="h-3 w-3 mr-1" />
          View
        </Button>

        {/* Approve */}
        <Button
          variant="default"
          size="sm"
          className="rounded-sm px-3 h-8 bg-green-600 hover:bg-green-700"
          onClick={onApprove}
          disabled={actionsState.isApproving}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          {actionsState.isApproving ? "Approving..." : "Approve"}
        </Button>

        {/* Reject */}
        <Button
          variant="destructive"
          size="sm"
          className="rounded-sm px-3 h-8"
          onClick={onReject}
          disabled={actionsState.isRejecting}
        >
          <XCircle className="h-3 w-3 mr-1" />
          {actionsState.isRejecting ? "Rejecting..." : "Reject"}
        </Button>
      </div>
    );
  }

  // Case 4: Default - show view details button
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-sm h-8"
      onClick={onViewDetails}
    >
      <Eye className="h-3 w-3" />
    </Button>
  );
};
