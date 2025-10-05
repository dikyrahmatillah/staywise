"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import type { 
  PaymentProofUploadState, 
  PaymentProofUploadActions,
  FileValidationOptions 
} from "./types";
import { validateFile, createFilePreview, revokeFilePreview } from "./utils";

interface PaymentProofContextValue {
  state: PaymentProofUploadState;
  actions: PaymentProofUploadActions;
  validationOptions: FileValidationOptions;
}

const PaymentProofContext = createContext<PaymentProofContextValue | null>(null);

interface PaymentProofProviderProps {
  children: ReactNode;
  onUploadComplete?: (file: File) => Promise<void>;
  existingProofUrl?: string | null;
  validationOptions?: Partial<FileValidationOptions>;
}

export function PaymentProofProvider({
  children,
  onUploadComplete,
  existingProofUrl,
  validationOptions: customValidationOptions,
}: PaymentProofProviderProps) {
  const [state, setState] = useState<PaymentProofUploadState>({
    selectedFile: null,
    isUploading: false,
    uploadProgress: 0,
    error: null,
    existingProofUrl,
  });

  const validationOptions: FileValidationOptions = useMemo(
    () => ({
      maxSizeMB: customValidationOptions?.maxSizeMB ?? 1,
      acceptedFormats: customValidationOptions?.acceptedFormats ?? [
        "image/jpeg",
        "image/jpg",
        "image/png",
      ],
    }),
    [customValidationOptions?.maxSizeMB, customValidationOptions?.acceptedFormats]
  );

  // Cleanup preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (state.selectedFile?.preview) {
        revokeFilePreview(state.selectedFile.preview);
      }
    };
  }, [state.selectedFile]);

  const onFileSelect = useCallback(
    (file: File) => {
      setState((prev) => ({ ...prev, error: null }));

      const validation = validateFile(file, validationOptions);
      
      if (!validation.isValid) {
        setState((prev) => ({ ...prev, error: validation.error ?? "Invalid file" }));
        return;
      }

      // Cleanup old preview if exists
      if (state.selectedFile?.preview) {
        revokeFilePreview(state.selectedFile.preview);
      }

      const fileWithPreview = createFilePreview(file);
      setState((prev) => ({
        ...prev,
        selectedFile: fileWithPreview,
        error: null,
      }));
    },
    [validationOptions, state.selectedFile]
  );

  const onFileRemove = useCallback(() => {
    if (state.selectedFile?.preview) {
      revokeFilePreview(state.selectedFile.preview);
    }
    
    setState((prev) => ({
      ...prev,
      selectedFile: null,
      error: null,
      uploadProgress: 0,
    }));
  }, [state.selectedFile]);

  const onFileReplace = useCallback(() => {
    onFileRemove();
  }, [onFileRemove]);

  const onUpload = useCallback(async () => {
    if (!state.selectedFile || !onUploadComplete) {
      return;
    }

    setState((prev) => ({ ...prev, isUploading: true, error: null }));

    try {
      await onUploadComplete(state.selectedFile.file);
      
      setState((prev) => ({
        ...prev,
        isUploading: false,
        uploadProgress: 100,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to upload file";
      
      setState((prev) => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: errorMessage,
      }));
    }
  }, [state.selectedFile, onUploadComplete]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const actions: PaymentProofUploadActions = {
    onFileSelect,
    onFileRemove,
    onFileReplace,
    onUpload,
    clearError,
  };

  return (
    <PaymentProofContext.Provider value={{ state, actions, validationOptions }}>
      {children}
    </PaymentProofContext.Provider>
  );
}

export function usePaymentProof() {
  const context = useContext(PaymentProofContext);
  
  if (!context) {
    throw new Error("usePaymentProof must be used within PaymentProofProvider");
  }
  
  return context;
}