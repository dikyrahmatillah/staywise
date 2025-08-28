"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

// Shared calendar class names
const calendarClassNames = {
  month_caption: "hidden",
  nav: "hidden",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell:
    "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] text-center",
  row: "flex w-full mt-2",
  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 focus-within:relative focus-within:z-20",
  day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
  day_selected: "bg-black text-white rounded-md",
  day_range_start: "bg-black text-white rounded-l-md rounded-r-none",
  day_range_end: "bg-black text-white rounded-r-md rounded-l-none",
  day_range_middle: "bg-gray-100 text-gray-900 rounded-none",
  day_today: "bg-gray-100 text-gray-900 font-semibold",
  day_outside: "text-gray-400 opacity-50",
  day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
  day_hidden: "invisible",
} as const;

interface DateRangePickerProps {
  checkIn?: Date;
  checkOut?: Date;
  onCheckInChange: (date: Date | undefined) => void;
  onCheckOutChange: (date: Date | undefined) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  isOpen,
  onOpenChange,
}: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const clearDates = (e: React.MouseEvent) => {
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
            "flex-1 min-w-0 py-2 px-6 border-l border-gray-300 text-left h-14 items-center overflow-hidden",
            isOpen ? "bg-gray-100" : "bg-transparent"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex-1 min-w-0">
              <div className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                When
              </div>
              <div
                className={cn(
                  "text-sm truncate",
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
                onClick={clearDates}
                className="h-6 w-6"
                aria-label="Clear dates"
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
        <div className="p-4">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  disabled={currentMonth <= new Date()}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronLeft />
                </Button>
                <h4 className="text-sm font-semibold text-center w-full">
                  {format(currentMonth, "MMMM yyyy")}
                </h4>
              </div>
              <CalendarComponent
                mode="range"
                selected={{ from: checkIn, to: checkOut }}
                onSelect={(range) => {
                  if (range?.from) onCheckInChange(range.from);
                  if (range?.to) onCheckOutChange(range.to);
                }}
                disabled={(date) => date < new Date()}
                numberOfMonths={1}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="w-full"
                classNames={calendarClassNames}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-center w-full">
                  {format(addMonths(currentMonth, 1), "MMMM yyyy")}
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronRight />
                </Button>
              </div>
              <CalendarComponent
                mode="range"
                selected={{ from: checkIn, to: checkOut }}
                onSelect={(range) => {
                  if (range?.from) onCheckInChange(range.from);
                  if (range?.to) onCheckOutChange(range.to);
                }}
                disabled={(date) => date < new Date()}
                numberOfMonths={1}
                month={addMonths(currentMonth, 1)}
                onMonthChange={(m) => setCurrentMonth(subMonths(m, 1))}
                className="w-full"
                classNames={calendarClassNames}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
