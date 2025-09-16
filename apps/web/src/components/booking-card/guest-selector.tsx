"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GuestSelectorProps } from "@/components/booking-card/types";
import { Minus, Plus, Users } from "lucide-react";

export function GuestSelector({
  adults,
  childrenCount,
  pets,
  onAdultsChange,
  onChildrenChange,
  onPetsChange,
  isOpen,
  onOpenChange,
  maxGuests,
}: GuestSelectorProps) {
  const totalGuests = adults + childrenCount;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-transparent border-0 rounded-none"
        >
          <Users className="mr-2 h-4 w-4" />
          {totalGuests > 0 ? (
            <span>
              {totalGuests} guest{totalGuests > 1 ? "s" : ""}
              {pets > 0 && `, ${pets} pet${pets > 1 ? "s" : ""}`}
            </span>
          ) : (
            "Add guests"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Adults</div>
              <div className="text-sm text-muted-foreground">Ages 13 or above</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-transparent"
                onClick={() => onAdultsChange(Math.max(0, adults - 1))}
                disabled={adults <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{adults}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-transparent"
                onClick={() => onAdultsChange(adults + 1)}
                disabled={totalGuests >= maxGuests}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Children</div>
              <div className="text-sm text-muted-foreground">Ages 2-12</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-transparent"
                onClick={() => onChildrenChange(Math.max(0, childrenCount - 1))}
                disabled={childrenCount <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{childrenCount}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-transparent"
                onClick={() => onChildrenChange(childrenCount + 1)}
                disabled={totalGuests >= maxGuests}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Pets</div>
              <div className="text-sm text-muted-foreground">Bringing a service animal?</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-transparent"
                onClick={() => onPetsChange(Math.max(0, pets - 1))}
                disabled={pets <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{pets}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-transparent"
                onClick={() => onPetsChange(pets + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
