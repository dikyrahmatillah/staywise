import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { format, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";

interface CalendarWithHeaderProps {
  month: Date;
  showLeftNav?: boolean;
  showRightNav?: boolean;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  checkIn?: Date;
  checkOut?: Date;
  handleRangeSelect: (range: { from?: Date; to?: Date } | undefined) => void;
  navigateMonth: (direction: "prev" | "next") => void;
  calendarClassNames: Record<string, string>;
}

export const CalendarWithHeader: React.FC<CalendarWithHeaderProps> = ({
  month,
  showLeftNav = false,
  showRightNav = false,
  currentMonth,
  setCurrentMonth,
  checkIn,
  checkOut,
  handleRangeSelect,
  navigateMonth,
  calendarClassNames,
}) => (
  <div className="flex-1">
    <div className="flex items-center justify-between mb-2">
      {showLeftNav && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth("prev")}
          disabled={currentMonth <= new Date()}
          className="h-8 w-8 rounded-full cursor-pointer"
        >
          <IoChevronBackOutline />
        </Button>
      )}
      <h4
        className={cn(
          "text-sm font-semibold",
          showLeftNav || showRightNav
            ? "text-center w-full"
            : "text-center flex-1"
        )}
      >
        {format(month, "MMMM yyyy")}
      </h4>
      {showRightNav && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth("next")}
          className="h-8 w-8 rounded-full cursor-pointer"
        >
          <IoChevronForward />
        </Button>
      )}
    </div>
    <CalendarComponent
      mode="range"
      selected={{ from: checkIn, to: checkOut }}
      onSelect={handleRangeSelect}
      disabled={(date) => date < new Date()}
      numberOfMonths={1}
      month={month}
      onMonthChange={
        month === currentMonth
          ? setCurrentMonth
          : (m) => setCurrentMonth(subMonths(m, 1))
      }
      className="w-full"
      classNames={calendarClassNames}
    />
  </div>
);
