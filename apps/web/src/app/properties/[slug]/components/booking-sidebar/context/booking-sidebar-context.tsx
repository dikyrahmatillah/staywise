"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export type Room = {
  id: string;
  name: string;
  basePrice: string | number;
  bedCount?: number;
  bedType?: string | null;
  capacity?: number;
  imageUrl?: string | null;
};

interface BookingSidebarContextValue {
  // Date state
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  setCheckInDate: Dispatch<SetStateAction<Date | undefined>>;
  setCheckOutDate: Dispatch<SetStateAction<Date | undefined>>;

  // Guest state
  adults: number;
  childrenCount: number;
  pets: number;
  setAdults: Dispatch<SetStateAction<number>>;
  setChildrenCount: Dispatch<SetStateAction<number>>;
  setPets: Dispatch<SetStateAction<number>>;

  // UI state
  guestSelectorOpen: boolean;
  setGuestSelectorOpen: Dispatch<SetStateAction<boolean>>;
  isBooking: boolean;
  setIsBooking: Dispatch<SetStateAction<boolean>>;

  // Validation state
  errors: Record<string, string>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;

  // Property data
  pricePerNight: number;
  maxGuests: number;
  propertyId: string | undefined;
  unavailableDates: Date[];
  selectedRoom: Room | null | undefined;
  propertyName: string | undefined;
  propertyCity: string | undefined;
  propertyRating: number | undefined;
  reviewCount: number | undefined;

  // Computed values
  effectiveMaxGuests: number;
}

const BookingSidebarContext = createContext<
  BookingSidebarContextValue | undefined
>(undefined);

interface BookingSidebarProviderProps {
  children: ReactNode;
  pricePerNight: number;
  maxGuests?: number;
  propertyId?: string;
  unavailableDates?: Date[];
  selectedRoom?: Room | null;
  propertyName?: string;
  propertyCity?: string;
  propertyRating?: number;
  reviewCount?: number;
}

export function BookingSidebarProvider({
  children,
  pricePerNight,
  maxGuests = 10,
  propertyId,
  unavailableDates = [],
  selectedRoom,
  propertyName,
  propertyCity,
  propertyRating,
  reviewCount,
}: BookingSidebarProviderProps) {
  // Date state
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();

  // Guest state
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [pets, setPets] = useState(0);

  // UI state
  const [guestSelectorOpen, setGuestSelectorOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Computed values
  const effectiveMaxGuests = selectedRoom?.capacity ?? maxGuests;

  const value: BookingSidebarContextValue = {
    // Date state
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,

    // Guest state
    adults,
    childrenCount,
    pets,
    setAdults,
    setChildrenCount,
    setPets,

    // UI state
    guestSelectorOpen,
    setGuestSelectorOpen,
    isBooking,
    setIsBooking,

    // Validation state
    errors,
    setErrors,

    // Property data
    pricePerNight,
    maxGuests,
    propertyId,
    unavailableDates,
    selectedRoom,
    propertyName,
    propertyCity,
    propertyRating,
    reviewCount,

    // Computed values
    effectiveMaxGuests,
  };

  return (
    <BookingSidebarContext.Provider value={value}>
      {children}
    </BookingSidebarContext.Provider>
  );
}

export function useBookingSidebar() {
  const context = useContext(BookingSidebarContext);
  if (context === undefined) {
    throw new Error(
      "useBookingSidebar must be used within a BookingSidebarProvider"
    );
  }
  return context;
}
