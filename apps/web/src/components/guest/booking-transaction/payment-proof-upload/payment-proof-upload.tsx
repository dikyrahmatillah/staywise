"use client";

import { cn } from "@/lib/utils";
import { PaymentProofProvider } from "./payment-proof-context";
import { UploadArea } from "./upload-area";
import { PreviewArea } from "./preview-area";
import { UploadActions } from "./upload-actions";
import type { FileValidationOptions } from "./types";

interface PaymentProofUploadProps {
  onUploadComplete?: (file: File) => Promise<void>;
  existingProofUrl?: string | null;
  validationOptions?: Partial<FileValidationOptions>;
  showUploadButton?: boolean;
  uploadButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  className?: string;
  title?: string;
  description?: string;
}

function PaymentProofUploadContent({
  showUploadButton,
  uploadButtonText,
  cancelButtonText,
  onCancel,
  title,
  description,
}: Pick<
  PaymentProofUploadProps,
  | "showUploadButton"
  | "uploadButtonText"
  | "cancelButtonText"
  | "onCancel"
  | "title"
  | "description"
>) {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}

      <PreviewArea />
      <UploadArea />
      <UploadActions
        showUploadButton={showUploadButton}
        uploadButtonText={uploadButtonText}
        cancelButtonText={cancelButtonText}
        onCancel={onCancel}
      />
    </div>
  );
}

export function PaymentProofUpload({
  onUploadComplete,
  existingProofUrl,
  validationOptions,
  showUploadButton = true,
  uploadButtonText,
  cancelButtonText,
  onCancel,
  className,
  title = "Payment Proof",
  description = "Upload a screenshot or photo of your payment transaction",
}: PaymentProofUploadProps) {
  return (
    <div className={cn("w-full", className)}>
      <PaymentProofProvider
        onUploadComplete={onUploadComplete}
        existingProofUrl={existingProofUrl}
        validationOptions={validationOptions}
      >
        <PaymentProofUploadContent
          showUploadButton={showUploadButton}
          uploadButtonText={uploadButtonText}
          cancelButtonText={cancelButtonText}
          onCancel={onCancel}
          title={title}
          description={description}
        />
      </PaymentProofProvider>
    </div>
  );
}