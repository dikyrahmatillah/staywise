"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { BookingTransaction } from "@/types";

interface BookingRowContextValue {
  booking: BookingTransaction;
}

const BookingRowContext = createContext<BookingRowContextValue | undefined>(
  undefined
);

interface BookingRowProviderProps {
  booking: BookingTransaction;
  children: ReactNode;
}

/**
 * Provider component that makes booking data available to all child components
 * Eliminates prop drilling by using React Context
 */
export const BookingRowProvider = ({
  booking,
  children,
}: BookingRowProviderProps) => {
  return (
    <BookingRowContext.Provider value={{ booking }}>
      {children}
    </BookingRowContext.Provider>
  );
};

/**
 * Custom hook to access booking data from context
 * @throws Error if used outside of BookingRowProvider
 */
export const useBookingRow = (): BookingRowContextValue => {
  const context = useContext(BookingRowContext);
  
  if (context === undefined) {
    throw new Error(
      "useBookingRow must be used within a BookingRowProvider"
    );
  }
  
  return context;
};