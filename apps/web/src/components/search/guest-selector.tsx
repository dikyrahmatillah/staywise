"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoClose } from "react-icons/io5";
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
            "flex-1 min-w-0 py-2 px-3 sm:px-6 border-l border-gray-300 text-left h-12 sm:h-14 flex items-center justify-between overflow-hidden cursor-pointer",
            isOpen ? "bg-gray-100" : "bg-transparent"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="min-w-0 flex-1">
              <div className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                Who
              </div>
              <div
                className={cn(
                  "text-sm truncate",
                  totalGuests === 0 ? "text-gray-400" : "text-gray-900"
                )}
              >
                {totalGuests === 0
                  ? "Add guest"
                  : [
                      adults > 0
                        ? `${adults} adult${adults > 1 ? "s" : ""}`
                        : null,
                      childrenCount > 0
                        ? `${childrenCount} child${
                            childrenCount > 1 ? "ren" : ""
                          }`
                        : null,
                      pets > 0 ? `${pets} pet${pets > 1 ? "s" : ""}` : null,
                    ]
                      .filter(Boolean)
                      .join(", ")}
              </div>
            </div>
            {totalGuests > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearGuests}
                className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 cursor-pointer"
                aria-label="Clear guests"
              >
                <IoClose className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 sm:w-80 p-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <GuestCounter
            label="Adults"
            subtitle="Ages 13 or above"
            value={adults}
            onDec={() => onAdultsChange(Math.max(0, adults - 1))}
            onInc={() => onAdultsChange(adults + 1)}
            disableDec={adults <= 0}
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
