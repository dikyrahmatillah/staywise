"use client";

import { formatCurrency } from "@/lib/booking-formatters";
import { useBookingSidebar } from "../context/booking-sidebar-context";
import { calculateNights, calculateTotalPrice, getEffectivePrice } from "../utils/price-calculators";

export function PriceSummary() {
  const { checkInDate, checkOutDate, selectedRoom, pricePerNight } = useBookingSidebar();

  const currentPrice = getEffectivePrice(selectedRoom, pricePerNight);
  const nights = calculateNights(checkInDate, checkOutDate);
  const totalPrice = calculateTotalPrice(checkInDate, checkOutDate, currentPrice);

  if (nights === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          × {nights} night{nights > 1 ? "s" : ""}
        </div>
        <div className="text-xs text-muted-foreground font-medium">Total</div>
      </div>
      <div className="mt-2 flex justify-end">
        <div className="font-bold text-lg">{formatCurrency(totalPrice)}</div>
      </div>
    </div>
  );
}