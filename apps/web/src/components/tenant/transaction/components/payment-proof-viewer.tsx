// apps/web/src/components/tenant/transaction/components/payment-proof-viewer.tsx

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/booking-formatters";
import { useBookingRow } from "../context/booking-row-context";

interface PaymentProofViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentProofViewer = ({
  open,
  onOpenChange,
}: PaymentProofViewerProps) => {
  const { booking } = useBookingRow();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Proof - {booking.orderCode}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {booking.paymentProof?.imageUrl && (
            <div className="space-y-2">
              <div className="relative w-full h-96">
                <Image
                  src={booking.paymentProof.imageUrl}
                  alt="Payment Proof"
                  fill
                  className="object-contain rounded-lg border"
                />
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Uploaded:{" "}
                  {new Date(booking.paymentProof.uploadedAt).toLocaleString()}
                </p>
                <p>
                  Guest: {booking.User.firstName} {booking.User.lastName}
                </p>
                <p>Amount: {formatCurrency(booking.totalAmount)}</p>
                {booking.paymentProof.acceptedAt && (
                  <p className="text-green-600">
                    Approved:{" "}
                    {new Date(booking.paymentProof.acceptedAt).toLocaleString()}
                  </p>
                )}
                {booking.paymentProof.rejectedAt && (
                  <p className="text-red-600">
                    Rejected:{" "}
                    {new Date(booking.paymentProof.rejectedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
