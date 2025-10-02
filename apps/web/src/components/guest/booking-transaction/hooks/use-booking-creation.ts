"use client";

import { useSession } from "next-auth/react";
import axios from "axios";
import { useBookingContext } from "../context/booking-context";
import type { CreateBookingResponse } from "../types/booking.types";

export function useBookingCreation() {
  const { data: session } = useSession();
  const { bookingDetails, selectedPaymentMethod, nights, totalPrice } =
    useBookingContext();

  const createApiInstance = () => {
    const api = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    });

    if (session?.user?.accessToken) {
      api.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;
    }

    return api;
  };

  const createBooking = async (): Promise<CreateBookingResponse> => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    if (!selectedPaymentMethod) {
      throw new Error("Payment method not selected");
    }

    const api = createApiInstance();

    const bookingData = {
      userId: session.user.id,
      propertyId: bookingDetails.propertyId,
      roomId: bookingDetails.roomId,
      checkInDate: bookingDetails.checkIn.toISOString().split("T")[0],
      checkOutDate: bookingDetails.checkOut.toISOString().split("T")[0],
      paymentMethod:
        selectedPaymentMethod === "midtrans"
          ? ("PAYMENT_GATEWAY" as const)
          : ("MANUAL_TRANSFER" as const),
    };

    console.log("Creating booking with data:", bookingData);
    console.log("Total price calculated:", totalPrice);
    console.log("Nights:", nights);

    const response = await api.post<CreateBookingResponse>(
      "/bookings",
      bookingData
    );
    console.log("Booking created successfully:", response.data);
    return response.data;
  };

  const uploadPaymentProof = async (
    bookingId: string,
    file: File
  ): Promise<void> => {
    const api = createApiInstance();
    const formData = new FormData();
    formData.append("paymentProof", file);

    console.log("Uploading payment proof for booking:", bookingId);
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeFormatted: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    });

    await api.post(`/bookings/${bookingId}/payment-proof`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Payment proof uploaded successfully");
  };

  const handleError = (error: unknown): string => {
    console.error("Booking error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;

      if (error.response?.status === 400) {
        if (responseData?.message) return responseData.message;
        if (responseData?.error) return responseData.error;
        if (typeof responseData === "string") return responseData;
        return "Invalid request. Please check your data and try again.";
      }

      if (error.response?.status === 401) {
        return "Authentication failed. Please log in again.";
      }

      if (error.response?.status === 404) {
        return "Booking not found. Please try creating a new booking.";
      }

      if (error.response?.status === 413) {
        return "File too large. Maximum size is 1MB.";
      }

      return error.response?.data?.message || "An error occurred";
    }

    return "An unexpected error occurred";
  };

  return {
    createBooking,
    uploadPaymentProof,
    handleError,
  };
}
