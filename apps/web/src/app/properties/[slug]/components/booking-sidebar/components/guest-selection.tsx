// apps/web/src/app/properties/[slug]/components/booking-sidebar/components/guest-selection.tsx

"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
// ✅ Using the existing shared GuestSelector component
import { GuestSelector } from "@/components/booking-card/guest-selector";
import { useBookingSidebar } from "../context/booking-sidebar-context";
import { useBookingValidation } from "../hooks/use-booking-validation";

/**
 * GuestSelection Component
 * 
 * Wraps the shared GuestSelector component with booking-specific logic:
 * - Validates guest counts against room capacity
 * - Auto-adjusts guests when room selection changes
 * - Displays validation errors
 * - Shows max guest capacity from selected room or property
 */
export function GuestSelection() {
  const {
    adults,
    childrenCount,
    pets,
    setAdults,
    setChildrenCount,
    setPets,
    guestSelectorOpen,
    setGuestSelectorOpen,
    effectiveMaxGuests,
    selectedRoom,
  } = useBookingSidebar();

  const { getFieldError } = useBookingValidation();

  // When selected room changes, clamp guest values to the effective max
  useEffect(() => {
  const total = adults + childrenCount;
  if (total > effectiveMaxGuests) {
    const overflow = total - effectiveMaxGuests;

    // Adjust children first
    let newChildren = childrenCount;
    if (newChildren >= overflow) {
      newChildren -= overflow;
    } else {
      newChildren = 0;
    }
    setChildrenCount(newChildren);

    // Then adjust adults if still overflowing (ensure at least 1)
    const remainingOverflow = total - effectiveMaxGuests - (childrenCount - newChildren);
    const newAdults = Math.max(1, adults - Math.max(0, remainingOverflow));
    setAdults(newAdults);

    toast.info(`Guest count adjusted to room max: ${effectiveMaxGuests}`);
  }
}, [selectedRoom, adults, childrenCount, effectiveMaxGuests, setAdults, setChildrenCount]);

  return (
    <div className="pb-2">
      <div className="flex flex-row justify-between mb-1.5">
        <Label className="text-sm font-medium">Guests</Label>
        <span className="text-xs text-slate-500 font-normal">
          Max: {effectiveMaxGuests} guests
        </span>
      </div>
      <div
        className={`border rounded-md bg-white border-slate-200 ${
          getFieldError("adults") ? "border-red-500" : ""
        }`}
      >
        {/* Using shared GuestSelector component with booking sidebar state */}
        <GuestSelector
          adults={adults}
          childrenCount={childrenCount}
          pets={pets}
          onAdultsChange={setAdults}
          onChildrenChange={setChildrenCount}
          onPetsChange={setPets}
          isOpen={guestSelectorOpen}
          onOpenChange={setGuestSelectorOpen}
          maxGuests={effectiveMaxGuests}
        />
      </div>
      {getFieldError("adults") && (
        <p className="text-sm text-red-500 mt-1">
          {getFieldError("adults")}
        </p>
      )}
    </div>
  );
}