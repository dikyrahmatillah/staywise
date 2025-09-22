"use client";

import { cn } from "@/lib/utils";
import { formatDateKey, isCurrentMonth as isSameMonth, isPastDate } from "@/lib/date-utils";

interface CalendarGridProps {
  dates: Date[];
  currentDate: Date;
  loading: boolean;
  getIsBlocked: (date: Date) => boolean;
  onDateClick: (date: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function CalendarGrid({ dates, currentDate, loading, getIsBlocked, onDateClick }: CalendarGridProps) {
  const isCurrentMonth = (date: Date) => isSameMonth(date, currentDate);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dates.map((date) => {
          const key = formatDateKey(date);
          const isBlocked = getIsBlocked(date);
          const inCurrentMonth = isCurrentMonth(date);
          const past = isPastDate(date);

          return (
            <button
              key={key}
              onClick={() => onDateClick(date)}
              disabled={past || loading}
              className={cn(
                "p-2 text-sm rounded-md border transition-colors relative",
                "hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
                !inCurrentMonth && "text-muted-foreground",
                past && "opacity-50 cursor-not-allowed",
                isBlocked ? "bg-red-100 border-red-300 text-red-800" : "bg-green-100 border-green-300 text-green-800",
                !past && !loading && "cursor-pointer"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarGrid;
