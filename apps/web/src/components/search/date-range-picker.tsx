"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoClose } from "react-icons/io5";
import { format, addMonths, subMonths } from "date-fns";
import { CalendarWithHeader } from "./calendar-with-header";
import { cn } from "@/lib/utils";

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

  const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from) onCheckInChange(range.from);
    if (range?.to) onCheckOutChange(range.to);
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCheckInChange(undefined);
    onCheckOutChange(undefined);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(
      direction === "prev"
        ? subMonths(currentMonth, 1)
        : addMonths(currentMonth, 1)
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "flex-1 min-w-0 py-2 px-3 sm:px-6  border-gray-200 text-left h-12 sm:h-14 items-center overflow-hidden cursor-pointer transition-all duration-300 ease-out",
            isOpen
              ? "bg-white border-l-2 border-t-2 border-r-2 border-b-2 border-gray-300 rounded-xl shadow-2xl shadow-gray-200/60 transform scale-[1.02] ring-4 ring-gray-100/50"
              : "bg-transparent hover:border-l-gray-300 hover:shadow-md"
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
                className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 cursor-pointer"
                aria-label="Clear dates"
              >
                <IoClose className="h-3 w-3 sm:h-4 sm:w-4" />
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
          <div className="block sm:hidden">
            <CalendarWithHeader
              month={currentMonth}
              showLeftNav
              showRightNav
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              checkIn={checkIn}
              checkOut={checkOut}
              handleRangeSelect={handleRangeSelect}
              navigateMonth={navigateMonth}
              calendarClassNames={calendarClassNames}
            />
          </div>

          <div className="hidden sm:flex gap-4 items-start">
            <CalendarWithHeader
              month={currentMonth}
              showLeftNav
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              checkIn={checkIn}
              checkOut={checkOut}
              handleRangeSelect={handleRangeSelect}
              navigateMonth={navigateMonth}
              calendarClassNames={calendarClassNames}
            />
            <CalendarWithHeader
              month={addMonths(currentMonth, 1)}
              showRightNav
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              checkIn={checkIn}
              checkOut={checkOut}
              handleRangeSelect={handleRangeSelect}
              navigateMonth={navigateMonth}
              calendarClassNames={calendarClassNames}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
