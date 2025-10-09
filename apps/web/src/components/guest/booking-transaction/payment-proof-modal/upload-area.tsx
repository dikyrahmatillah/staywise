import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FileDropzone } from "@/components/guest/file-dropzone";
import { ImagePreview } from "@/components/guest/image-preview";
import { PaymentProofViewer } from "./payment-proof-viewer";

interface PaymentProofUploadAreaProps {
  uploadedFile: File | null;
  existingProofUrl?: string | null;
  isUploading: boolean;
  uploadProgress?: number;
  showUploadButton: boolean;
  onFileSelect: (file: File) => void;
  onUpload: () => Promise<void>;
  onClearFile: () => void;
}

export function PaymentProofUploadArea({
  uploadedFile,
  existingProofUrl,
  isUploading,
  uploadProgress = 0,
  showUploadButton,
  onFileSelect,
  onUpload,
  onClearFile,
}: PaymentProofUploadAreaProps) {
  // Show dropzone if no file selected and no existing proof
  if (!uploadedFile && !existingProofUrl) {
    return <FileDropzone onFileSelect={onFileSelect} />;
  }

  return (
    <div className="space-y-4">
      {/* Show newly uploaded file preview */}
      {uploadedFile ? (
        <ImagePreview
          file={uploadedFile}
          onRemove={onClearFile}
          title="Payment Proof"
        />
      ) : existingProofUrl ? (
        /* Show existing proof with re-upload option */
        <>
          <PaymentProofViewer
            imageUrl={existingProofUrl}
            subtitle="Current payment proof (you can re-upload if needed)"
          />
          <Button variant="outline" className="w-full" onClick={onClearFile}>
            Re-upload Payment Proof
          </Button>
        </>
      ) : null}

      {/* Upload Progress Bar */}
      {isUploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload button */}
      {showUploadButton && uploadedFile && !isUploading && (
        <Button className="w-full" onClick={onUpload} disabled={isUploading}>
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
  );
}
