export interface PaymentProofFile {
  file: File;
  preview: string;
  uploadedAt: Date;
}

export interface PaymentProofUploadState {
  selectedFile: PaymentProofFile | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  existingProofUrl?: string | null;
}

export interface PaymentProofUploadActions {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onFileReplace: () => void;
  onUpload: () => Promise<void>;
  clearError: () => void;
}

export interface FileValidationOptions {
  maxSizeMB: number;
  acceptedFormats: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}