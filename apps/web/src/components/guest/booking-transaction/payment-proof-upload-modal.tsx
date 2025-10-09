// apps/web/src/components/guest/booking-transaction/payment-proof-upload-modal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePaymentProofUpload } from "@/hooks/use-payment-proof-upload";
import {
  BankTransferDetails,
  ExpirationTimer,
  PaymentProofViewer,
  PaymentProofUploadArea,
} from "./payment-proof-modal";

interface PaymentProofUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  orderCode: string;
  totalAmount?: number;
  expiresAt?: Date | null;
  existingProofUrl?: string | null;
  onUploadComplete?: () => void;
  onExpire?: () => void;
  showUploadButton?: boolean;
  mode?: "upload" | "view";
  title?: string;
}

export function PaymentProofUploadModal({
  open,
  onOpenChange,
  bookingId,
  orderCode,
  totalAmount,
  expiresAt,
  existingProofUrl,
  onUploadComplete,
  onExpire,
  showUploadButton = true,
  mode = "upload",
  title,
}: PaymentProofUploadModalProps) {
  // Local state for file selection
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Use EXISTING hook (much better!)
  const {
    uploadPaymentProof,
    uploading,
    uploadProgress,
    error,
    validateFile,
  } = usePaymentProofUpload({
    bookingId,
    onUploadComplete: () => {
      setSelectedFile(null);
      onUploadComplete?.();
      onOpenChange(false);
    },
  });

  // Handle file selection with validation
  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (!validationError) {
      setSelectedFile(file);
    }
    // Validation error is already shown by the hook via toast
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadPaymentProof(selectedFile);
  };

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
  };

  // Generate modal title
  const modalTitle =
    title ||
    (mode === "view"
      ? `Payment Proof - ${orderCode}`
      : "Upload Payment Proof");

  // Determine if timer should be active
  const shouldShowTimer = mode === "upload" && expiresAt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bank Transfer Information */}
          <BankTransferDetails
            orderCode={orderCode}
            totalAmount={totalAmount}
          />

          {/* Expiration Timer (only in upload mode) */}
          {shouldShowTimer && (
            <ExpirationTimer expiresAt={expiresAt} onExpire={onExpire} />
          )}

          {/* Content based on mode */}
          {mode === "view" && existingProofUrl ? (
            /* View Mode: Show existing proof */
            <PaymentProofViewer imageUrl={existingProofUrl} />
          ) : mode === "upload" ? (
            /* Upload Mode: Show upload interface */
            <PaymentProofUploadArea
              uploadedFile={selectedFile}
              existingProofUrl={existingProofUrl}
              isUploading={uploading}
              uploadProgress={uploadProgress}
              showUploadButton={showUploadButton}
              onFileSelect={handleFileSelect}
              onUpload={handleUpload}
              onClearFile={clearFile}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}