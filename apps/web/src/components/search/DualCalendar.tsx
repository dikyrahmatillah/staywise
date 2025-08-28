"use client";

import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface DualCalendarProps {
  checkIn?: Date;
  checkOut?: Date;
  onSelect: (range: { from?: Date; to?: Date }) => void;
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

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
};

export function DualCalendar({
  checkIn,
  checkOut,
  onSelect,
  currentMonth,
  onMonthChange,
}: DualCalendarProps) {
  const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      onSelect(range);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 items-start">
        {/* Left Calendar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onMonthChange(subMonths(currentMonth, 1));
              }}
              disabled={currentMonth <= new Date()}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft />
            </Button>
            <h4 className="text-sm font-semibold text-center w-full">
              {format(currentMonth, "MMMM yyyy")}
            </h4>
          </div>
          <Calendar
            mode="range"
            selected={{ from: checkIn, to: checkOut }}
            onSelect={handleRangeSelect}
            disabled={(date: Date) => date < new Date()}
            numberOfMonths={1}
            month={currentMonth}
            onMonthChange={onMonthChange}
            className="w-full"
            classNames={calendarClassNames}
          />
        </div>

        {/* Right Calendar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-center w-full">
              {format(addMonths(currentMonth, 1), "MMMM yyyy")}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMonthChange(addMonths(currentMonth, 1))}
              className="h-8 w-8 rounded-full"
            >
              <ChevronRight />
            </Button>
          </div>
          <Calendar
            mode="range"
            selected={{ from: checkIn, to: checkOut }}
            onSelect={handleRangeSelect}
            disabled={(date: Date) => date < new Date()}
            numberOfMonths={1}
            month={addMonths(currentMonth, 1)}
            onMonthChange={(m: Date) => onMonthChange(subMonths(m, 1))}
            className="w-full"
            classNames={calendarClassNames}
          />
        </div>
      </div>
    </div>
  );
}
