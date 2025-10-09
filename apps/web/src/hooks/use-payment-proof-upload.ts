"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    imageUrl: string;
    uploadedAt: string;
  };
}

interface UsePaymentProofUploadProps {
  bookingId: string;
  onUploadComplete?: () => void;
}

export function usePaymentProofUpload({
  bookingId,
  onUploadComplete,
}: UsePaymentProofUploadProps) {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const createApiInstance = useCallback(() => {
    const api = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    });

    if (session?.user?.accessToken) {
      api.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;
    }

    return api;
  }, [session?.user?.accessToken]);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a JPEG or PNG image file.";
    }

    // Check file size (1MB limit)
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size must be less than 1MB.";
    }
    
    return null;
  }, []);

  const uploadPaymentProof = useCallback(
    async (file: File) => {
      if (!session?.user?.accessToken) {
        toast.error("Please log in to upload payment proof");
        return null;
      }

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return null;
      }

      setUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const api = createApiInstance();
        const formData = new FormData();
        formData.append("paymentProof", file);

        const response = await api.post<UploadResponse>(
          `/bookings/${bookingId}/payment-proof`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(progress);
              }
            },
          }
        );

        toast.success(
          response.data.message || "Payment proof uploaded successfully!"
        );
        onUploadComplete?.();
        return response.data;
      } catch (err) {
        console.error("Upload error:", err);

        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to upload payment proof";

        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [
      bookingId,
      session?.user?.accessToken,
      validateFile,
      createApiInstance,
      onUploadComplete,
    ]
  );

  const getPaymentProof = useCallback(async () => {
    if (!session?.user?.accessToken) {
      return null;
    }

    try {
      const api = createApiInstance();
      const response = await api.get(`/bookings/${bookingId}/payment-proof`);
      return response.data.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return null; // No payment proof exists
      }
      console.error("Get payment proof error:", err);
      return null;
    }
  }, [bookingId, session?.user?.accessToken, createApiInstance]);

  const deletePaymentProof = useCallback(async () => {
    if (!session?.user?.accessToken) {
      toast.error("Please log in to delete payment proof");
      return false;
    }

    try {
      const api = createApiInstance();
      await api.delete(`/bookings/${bookingId}/payment-proof`);
      toast.success("Payment proof deleted successfully");
      onUploadComplete?.();
      return true;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to delete payment proof";

      toast.error(errorMessage);
      return false;
    }
  }, [
    bookingId,
    session?.user?.accessToken,
    createApiInstance,
    onUploadComplete,
  ]);

  return {
    uploadPaymentProof,
    getPaymentProof,
    deletePaymentProof,
    uploading,
    uploadProgress,
    error,
    validateFile,
  };
}
