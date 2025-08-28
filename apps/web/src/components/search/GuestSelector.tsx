"use client";

import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface GuestSelectorProps {
  guests: number;
  onGuestsChange: (count: number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestSelector({
  guests,
  onGuestsChange,
  isOpen,
  onOpenChange,
}: GuestSelectorProps) {
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGuestsChange(0);
  };

  const handleIncrement = () => {
    onGuestsChange(guests + 1);
  };

  const handleDecrement = () => {
    onGuestsChange(Math.max(0, guests - 1));
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "flex-1 py-2 px-6 border-l border-gray-300 text-left h-14 flex items-center justify-between",
            isOpen ? "bg-gray-100" : "bg-transparent"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                Who
              </div>
              <div
                className={cn(
                  "text-sm",
                  guests === 0 ? "text-gray-400" : "text-gray-900"
                )}
              >
                {guests === 0 ? "Add guest" : `${guests} guests`}
              </div>
            </div>
            {guests > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="h-6 w-6"
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Ages 13 or above</div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDecrement}
                disabled={guests <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{guests}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleIncrement}
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
