"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DualCalendar } from "./DualCalendar";

interface DateRangePickerProps {
  checkIn?: Date;
  checkOut?: Date;
  onCheckInChange: (date?: Date) => void;
  onCheckOutChange: (date?: Date) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  isOpen,
  onOpenChange,
  currentMonth,
  onMonthChange,
}: DateRangePickerProps) {
  const handleRangeSelect = (range: { from?: Date; to?: Date }) => {
    if (range?.from) onCheckInChange(range.from);
    if (range?.to) onCheckOutChange(range.to);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCheckInChange(undefined);
    onCheckOutChange(undefined);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "flex-1 py-2 px-6 border-l border-gray-300 text-left h-14 items-center",
            isOpen ? "bg-gray-100" : "bg-transparent"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <div className="font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                When
              </div>
              <div
                className={cn(
                  "text-sm",
                  checkIn && checkOut ? "text-gray-900" : "text-gray-400"
                )}
              >
                {checkIn && checkOut
                  ? `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d")}`
                  : "Add dates"}
              </div>
            </div>
            {(checkIn || checkOut) && (
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
        className="w-auto p-0"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DualCalendar
          checkIn={checkIn}
          checkOut={checkOut}
          onSelect={handleRangeSelect}
          currentMonth={currentMonth}
          onMonthChange={onMonthChange}
        />
      </PopoverContent>
    </Popover>
  );
}
