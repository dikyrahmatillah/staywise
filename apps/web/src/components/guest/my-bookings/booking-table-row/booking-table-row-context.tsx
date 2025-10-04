"use client";

import { createContext, useContext } from "react";
import type { BookingTransaction } from "@repo/types";
import type { Review } from "@/types/review";

interface BookingTableRowContextValue {
  booking: BookingTransaction;
  review: Review | null;
  canReview: boolean;
  onViewDetails?: (booking: BookingTransaction) => void;
  onBookingUpdate?: () => void;
}

const BookingTableRowContext =
  createContext<BookingTableRowContextValue | null>(null);

export const useBookingTableRowContext = () => {
  const context = useContext(BookingTableRowContext);
  if (!context) {
    throw new Error(
      "useBookingTableRowContext must be used within BookingTableRowProvider"
    );
  }
  return context;
};

export const BookingTableRowProvider = BookingTableRowContext.Provider;