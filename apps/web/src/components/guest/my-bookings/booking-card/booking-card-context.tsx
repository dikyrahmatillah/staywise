"use client";

import { createContext, useContext } from "react";
import type { BookingTransaction } from "@/types";
import type { Review } from "@/types/review";

interface BookingCardContextValue {
  booking: BookingTransaction;
  review: Review | null;
  canReview: boolean;
  onViewDetails?: (booking: BookingTransaction) => void;
  onBookingUpdate?: () => void;
}

const BookingCardContext = createContext<BookingCardContextValue | null>(null);

export const useBookingCardContext = () => {
  const context = useContext(BookingCardContext);
  if (!context) {
    throw new Error(
      "useBookingCardContext must be used within BookingCardProvider"
    );
  }
  return context;
};

export const BookingCardProvider = BookingCardContext.Provider;