"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { FileDropzone } from "@/components/guest/file-dropzone";
import { ImagePreview } from "@/components/guest/image-preview";
import { formatCurrency } from "@/lib/booking-formatters";
import { toast } from "sonner";
import { useBookingContext } from "./context/booking-context";
import { useBookingCreation } from "./hooks/use-booking-creation";
import { validatePaymentFile } from "./lib/booking-helpers";

export function PaymentUploadModal() {
  const router = useRouter();
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    uploadedFile,
    setUploadedFile,
    isProcessing,
    setIsProcessing,
    createdBooking,
    selectedPaymentType,
    totalPrice,
    setCurrentStep,
  } = useBookingContext();

  const { uploadPaymentProof, handleError } = useBookingCreation();

  const handleFileSelect = (file: File) => {
    const validation = validatePaymentFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    setUploadedFile(file);
  };

  const handleProcessPayment = async () => {
    if (!uploadedFile || !createdBooking) {
      toast.error("Please select a file and ensure booking is created");
      return;
    }

    setIsProcessing(true);

    try {
      await uploadPaymentProof(createdBooking.id, uploadedFile);
      toast.success("Payment proof uploaded successfully!");
      setCurrentStep(3);
      setIsUploadModalOpen(false);

      setTimeout(() => {
        router.push("/dashboard/guest");
      }, 2000);
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Payment Proof</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium font-sans mb-2">
              Bank Transfer Details:
            </p>
            <div className="text-sm font-sans text-blue-700 space-y-1">
              <p>Bank: BCA</p>
              <p>Account: 1234567890</p>
              <p>Name: Tenant Name</p>
              <p>
                Amount:{" "}
                {selectedPaymentType === "full"
                  ? formatCurrency(totalPrice)
                  : formatCurrency(totalPrice * 0.5)}
              </p>
              {createdBooking && <p>Reference: {createdBooking.orderCode}</p>}
            </div>
          </div>

          {!uploadedFile ? (
            <FileDropzone onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-4">
              <ImagePreview
                file={uploadedFile}
                onRemove={() => setUploadedFile(null)}
                title="Payment Proof"
              />
              <Button
                className="w-full"
                onClick={handleProcessPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Submit Payment Proof"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}