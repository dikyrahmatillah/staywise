"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Clock, AlertCircle } from "lucide-react";
import { FileDropzone } from "@/components/guest/file-dropzone";
import { ImagePreview } from "@/components/guest/image-preview";
import { formatCurrency } from "@/lib/booking-formatters";
import { useBookingTimer } from "@/hooks/useBookingTimer";
import { toast } from "sonner";

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
  const { data: session } = useSession();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Timer hook - only active in upload mode
  const { timeFormatted, isExpired, isUrgent, isWarning } = useBookingTimer({
    expiresAt: mode === "upload" ? expiresAt ?? null : null,
    onExpire,
    autoCancel: true,
  });

  const handleFileSelect = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG and PNG files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 1MB.");
      return;
    }

    setUploadedFile(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!session?.user?.accessToken) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("paymentProof", uploadedFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/payment-proof`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      toast.success("Payment proof uploaded successfully!");
      setUploadedFile(null);
      onUploadComplete?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload payment proof";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const defaultTitle =
    mode === "view" ? `Payment Proof - ${orderCode}` : "Upload Payment Proof";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title || defaultTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bank Transfer Details */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-sans text-blue-800 font-medium mb-2">
              Bank Transfer Details:
            </p>
            <div className="text-sm font-sans text-blue-700 space-y-1">
              <p>Bank: BCA</p>
              <p>Account: 1234567890</p>
              <p>Name: StayWise Property</p>
              {totalAmount && <p>Amount: {formatCurrency(totalAmount)}</p>}
              <p>Reference: {orderCode}</p>
            </div>
          </div>

          {/* Expiration Timer - Only show in upload mode */}
          {mode === "upload" && expiresAt && !isExpired && (
            <Alert
              variant={
                isUrgent ? "destructive" : isWarning ? "default" : "default"
              }
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
                  <span className="font-semibold font-sans text-red-700">
                    ⚠️ Upload expires in: {timeFormatted}
                  </span>
                ) : (
                  <span
                    className={
                      isWarning
                        ? "font-sans text-amber-700"
                        : "font-sans text-blue-700"
                    }
                  >
                    ⏱️ Upload before: {timeFormatted}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Expired State */}
          {mode === "upload" && isExpired && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-sans">
                ❌ Upload time has expired. This booking has been cancelled.
              </AlertDescription>
            </Alert>
          )}

          {/* View Existing Proof */}
          {existingProofUrl && mode === "view" && (
            <div className="space-y-4">
              <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden border">
                <Image
                  src={existingProofUrl}
                  alt="Payment Proof"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                />
              </div>
              <p className="text-sm text-muted-foreground text-center font-sans">
                Payment proof submitted
              </p>
            </div>
          )}

          {/* Upload Mode */}
          {mode === "upload" && !isExpired && (
            <>
              {!uploadedFile && !existingProofUrl ? (
                <FileDropzone onFileSelect={handleFileSelect} />
              ) : (
                <div className="space-y-4">
                  {uploadedFile ? (
                    <ImagePreview
                      file={uploadedFile}
                      onRemove={() => setUploadedFile(null)}
                      title="Payment Proof"
                    />
                  ) : existingProofUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden border">
                        <Image
                          src={existingProofUrl}
                          alt="Payment Proof"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center font-sans">
                        Current payment proof (you can re-upload if needed)
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setUploadedFile(null)}
                      >
                        Re-upload Payment Proof
                      </Button>
                    </div>
                  ) : null}

                  {showUploadButton && uploadedFile && (
                    <Button
                      className="w-full"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Submit Payment Proof"
                      )}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
