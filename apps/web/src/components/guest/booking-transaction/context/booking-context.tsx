// apps/web/src/app/booking/context/booking-context.tsx

"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  PaymentType,
  PaymentMethod,
  CreateBookingResponse,
  BookingDetails,
} from "@/components/guest/booking-transaction/types/booking.types";

interface BookingContextType {
  // State
  currentStep: number;
  selectedPaymentType: PaymentType;
  selectedPaymentMethod: PaymentMethod;
  uploadedFile: File | null;
  isProcessing: boolean;
  isUploadModalOpen: boolean;
  createdBooking: CreateBookingResponse | null;
  bookingDetails: BookingDetails;

  // Setters
  setCurrentStep: (step: number) => void;
  setSelectedPaymentType: (type: PaymentType) => void;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  setUploadedFile: (file: File | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setIsUploadModalOpen: (open: boolean) => void;
  setCreatedBooking: (booking: CreateBookingResponse | null) => void;

  // Computed values
  nights: number;
  totalPrice: number;
  totalGuests: number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
  bookingDetails: BookingDetails;
}

export function BookingProvider({
  children,
  bookingDetails,
}: BookingProviderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<PaymentType>("full");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] =
    useState<CreateBookingResponse | null>(null);

  // Computed values
  const nights = Math.ceil(
    (bookingDetails.checkOut.getTime() - bookingDetails.checkIn.getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const totalPrice = bookingDetails.pricePerNight * nights;
  const totalGuests = bookingDetails.adults + bookingDetails.children;

  const value: BookingContextType = {
    currentStep,
    selectedPaymentType,
    selectedPaymentMethod,
    uploadedFile,
    isProcessing,
    isUploadModalOpen,
    createdBooking,
    bookingDetails,
    setCurrentStep,
    setSelectedPaymentType,
    setSelectedPaymentMethod,
    setUploadedFile,
    setIsProcessing,
    setIsUploadModalOpen,
    setCreatedBooking,
    nights,
    totalPrice,
    totalGuests,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookingContext must be used within BookingProvider");
  }
  return context;
}