"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/booking-formatters";
import { BookingSidebarProvider, useBookingSidebar } from "./context/booking-sidebar-context";
import { DateSelection } from "./components/date-selection";
import { GuestSelection } from "./components/guest-selection";
import { BookingStatus } from "./components/booking-status";
import { PriceSummary } from "./components/price-summary";
import { BookingButton } from "./components/booking-button";
import type { Room } from "./context/booking-sidebar-context";
import { getEffectivePrice } from "./utils/price-calculators";

function BookingSidebarContent() {
  const { selectedRoom, pricePerNight } = useBookingSidebar();
  const currentPrice = getEffectivePrice(selectedRoom, pricePerNight);

  return (
    <div className="sticky top-20">
      <Card className="border-slate-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="font-sans text-3xl font-bold">
              {formatCurrency(currentPrice)}
            </span>
            <span className="font-sans text-muted-foreground text-sm">
              /night
            </span>
          </div>
          {selectedRoom && (
            <div className="text-sm font-medium text-slate-600">
              {selectedRoom.name}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-2">
          <DateSelection />
          <GuestSelection />
          <BookingStatus />
          <PriceSummary />
          <BookingButton />
        </CardContent>
      </Card>
    </div>
  );
}

interface BookingSidebarProps {
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

export function BookingSidebar(props: BookingSidebarProps) {
  return (
    <BookingSidebarProvider {...props}>
      <BookingSidebarContent />
    </BookingSidebarProvider>
  );
}