"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";
import { cn } from "@/lib/utils";
import {
  generateCalendarDates,
  formatDateKey,
  isCurrentMonth as isSameMonth,
  isPastDate,
} from "@/lib/date-utils";

interface RoomAvailabilityCalendarProps {
  roomId: string;
  roomName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomAvailabilityCalendar({
  roomId,
  roomName,
  open,
  onOpenChange,
}: RoomAvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    loading,
    error,
    fetchBlockedDates,
    blockDates,
    unblockDates,
    isDateBlocked,
  } = useRoomAvailability(roomId);

  const getCalendarDates = useCallback(
    () => generateCalendarDates(currentDate),
    [currentDate]
  );

  const isCurrentMonth = useCallback(
    (date: Date) => isSameMonth(date, currentDate),
    [currentDate]
  );

  const handleDateClick = useCallback(
    async (date: Date) => {
      if (isPastDate(date)) return;

      const dateKey = formatDateKey(date);
      if (isDateBlocked(dateKey)) {
        await unblockDates([dateKey]);
      } else {
        await blockDates([dateKey]);
      }
    },
    [isDateBlocked, unblockDates, blockDates]
  );

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  }, []);

  useEffect(() => {
    if (!open || !roomId) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    fetchBlockedDates(formatDateKey(startDate), formatDateKey(endDate));
  }, [open, roomId, currentDate, fetchBlockedDates]);

  const calendarDates = useMemo(() => getCalendarDates(), [getCalendarDates]);
  const monthYear = useMemo(
    () =>
      currentDate.toLocaleString("default", { month: "long", year: "numeric" }),
    [currentDate]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Block Dates - {roomName}
          </DialogTitle>
          <DialogDescription>
            Block specific dates when this room cannot be rented. Rooms are
            available by default unless blocked.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="grid place-content-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold min-w-[200px] text-center">
                {monthYear}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDates.map((date) => {
                  const dateKey = formatDateKey(date);
                  const isBlocked = isDateBlocked(dateKey);
                  const isCurrentMonthDate = isCurrentMonth(date);
                  const isPast = isPastDate(date);

                  return (
                    <button
                      key={dateKey}
                      onClick={() => handleDateClick(date)}
                      disabled={isPast || loading}
                      className={cn(
                        "p-2 text-sm rounded-md border transition-colors relative",
                        "hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
                        !isCurrentMonthDate && "text-muted-foreground",
                        isPast && "opacity-50 cursor-not-allowed",
                        isBlocked
                          ? "bg-red-100 border-red-300 text-red-800"
                          : "bg-green-100 border-green-300 text-green-800",
                        !isPast && !loading && "cursor-pointer"
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Available (Default)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Blocked</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Click on any date to toggle between available (green) and blocked
            (red).
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
