"use client";

import { useCallback } from "react";
import { PaymentProofUpload } from "@/components/guest/booking-transaction/payment-proof-upload/payment-proof-upload";
import { usePaymentProofUpload } from "@/hooks/use-payment-proof-upload";
import { useBookingTimer } from "@/hooks/useBookingTimer";
import { Loader2, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/booking-formatters";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingPaymentProofUploadProps {
  bookingId: string;
  orderCode: string;
  totalAmount?: number;
  expiresAt?: Date | null;
  existingProofUrl?: string | null;
  onUploadComplete?: () => void;
  onExpire?: () => void;
  showUploadButton?: boolean;
}

export function BookingPaymentProofUpload({
  bookingId,
  orderCode,
  totalAmount,
  expiresAt,
  existingProofUrl,
  onUploadComplete,
  onExpire,
  showUploadButton = true,
}: BookingPaymentProofUploadProps) {
  const { uploadPaymentProof, uploading } = usePaymentProofUpload({
    bookingId,
    onUploadComplete,
  });

  const { timeFormatted, isExpired, isUrgent, isWarning } = useBookingTimer({
    expiresAt: expiresAt ?? null,
    onExpire,
    autoCancel: true,
  });

  const handleUpload = useCallback(
    async (file: File) => {
      await uploadPaymentProof(file);
    },
    [uploadPaymentProof]
  );

  return (
    <div className="space-y-4">
      {/* Bank Transfer Details */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-2">
          Bank Transfer Details:
        </p>
        <div className="text-sm text-blue-700 space-y-1">
          <p>Bank: BCA</p>
          <p>Account: 1234567890</p>
          <p>Name: StayWise Property</p>
          {totalAmount && <p>Amount: {formatCurrency(totalAmount)}</p>}
          <p>Reference: {orderCode}</p>
        </div>
      </div>

      {/* Expiration Timer */}
      {expiresAt && !isExpired && (
        <Alert
          variant={isUrgent ? "destructive" : isWarning ? "default" : "default"}
          className={
            isUrgent
              ? "bg-red-50 border-red-200"
              : isWarning
              ? "bg-amber-50 border-amber-200"
              : "bg-blue-50 border-blue-200"
          }
        >
          <Clock className="h-4 w-4" />
          <AlertDescription>
            {isUrgent ? (
              <span className="font-semibold text-red-700">
                ⚠️ Upload expires in: {timeFormatted}
              </span>
            ) : (
              <span className={isWarning ? "text-amber-700" : "text-blue-700"}>
                ⏱️ Upload before: {timeFormatted}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Expired State */}
      {isExpired && (
        <Alert variant="destructive">
          <AlertDescription>
            ❌ Upload time has expired. This booking has been cancelled.
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Component */}
      {uploading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-gray-600">Uploading...</span>
        </div>
      ) : (
        <PaymentProofUpload
          onUploadComplete={handleUpload}
          existingProofUrl={existingProofUrl}
          showUploadButton={showUploadButton}
          title={existingProofUrl ? "Payment Proof" : "Upload Payment Proof"}
          description={
            existingProofUrl
              ? "View or update your payment proof"
              : "Upload a screenshot or photo of your payment transaction"
          }
        />
      )}
    </div>
  );
}
