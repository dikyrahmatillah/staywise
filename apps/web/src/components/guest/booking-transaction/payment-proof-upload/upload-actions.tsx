"use client";

import { Button } from "@/components/ui/button";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { usePaymentProof } from "./payment-proof-context";

interface UploadActionsProps {
  showUploadButton?: boolean;
  uploadButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
}

export function UploadActions({
  showUploadButton = true,
  uploadButtonText = "Upload Payment Proof",
  cancelButtonText = "Cancel",
  onCancel,
}: UploadActionsProps) {
  const { state, actions } = usePaymentProof();

  const hasFile = Boolean(state.selectedFile);
  const isUploading = state.isUploading;
  const uploadComplete = state.uploadProgress === 100 && !isUploading;

  if (!hasFile) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4">
      {showUploadButton && (
        <Button
          onClick={actions.onUpload}
          disabled={isUploading || uploadComplete}
          className="flex-1 sm:flex-none"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : uploadComplete ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Uploaded
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {uploadButtonText}
            </>
          )}
        </Button>
      )}

      <Button
        variant="outline"
        onClick={onCancel || actions.onFileRemove}
        disabled={isUploading}
        className="flex-1 sm:flex-none"
      >
        {cancelButtonText}
      </Button>

      {isUploading && state.uploadProgress > 0 && (
        <div className="w-full mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Uploading...</span>
            <span className="text-xs text-gray-600">{state.uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}