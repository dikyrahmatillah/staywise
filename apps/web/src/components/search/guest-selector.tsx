"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GuestCounter } from "./guest-counter";

interface GuestSelectorProps {
  adults: number;
  childrenCount: number;
  pets: number;
  onAdultsChange: (count: number) => void;
  onChildrenChange: (count: number) => void;
  onPetsChange: (count: number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestSelector({
  adults,
  childrenCount,
  pets,
  onAdultsChange,
  onChildrenChange,
  onPetsChange,
  isOpen,
  onOpenChange,
}: GuestSelectorProps) {
  const totalGuests = adults + childrenCount + pets;
  const guestsOnly = adults + childrenCount;

  const clearGuests = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdultsChange(0);
    onChildrenChange(0);
    onPetsChange(0);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "flex-1 min-w-0 py-2 px-6 border-l border-gray-300 text-left h-14 flex items-center justify-between overflow-hidden",
            isOpen ? "bg-gray-100" : "bg-transparent"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="min-w-0">
              <div className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                Who
              </div>
              <div
                className={cn(
                  "text-sm truncate",
                  guestsOnly === 0 ? "text-gray-400" : "text-gray-900"
                )}
              >
                {guestsOnly === 0
                  ? "Add guest"
                  : `${guestsOnly} guest${guestsOnly > 1 ? "s" : ""}` +
                    (pets > 0 ? `, ${pets} pet${pets > 1 ? "s" : ""}` : "")}
              </div>
            </div>
            {totalGuests > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearGuests}
                className="h-6 w-6"
                aria-label="Clear guests"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <GuestCounter
            label="Adults"
            subtitle="Ages 13 or above"
            value={adults}
            onDec={() => onAdultsChange(Math.max(1, adults - 1))}
            onInc={() => onAdultsChange(adults + 1)}
            disableDec={adults <= 1}
          />
          <GuestCounter
            label="Children"
            subtitle="Ages 2–12"
            value={childrenCount}
            onDec={() => onChildrenChange(Math.max(0, childrenCount - 1))}
            onInc={() => onChildrenChange(childrenCount + 1)}
            disableDec={childrenCount <= 0}
          />
          <GuestCounter
            label="Pets"
            subtitle="Service animals allowed"
            value={pets}
            onDec={() => onPetsChange(Math.max(0, pets - 1))}
            onInc={() => onPetsChange(pets + 1)}
            disableDec={pets <= 0}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
