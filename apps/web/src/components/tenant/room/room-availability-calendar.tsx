"use client";

// RoomAvailabilityCalendar
// Dialog component to toggle a room's unavailable dates with optimistic updates.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";
import {
  formatDateKey,
  generateCalendarDates,
  isPastDate,
} from "@/lib/date-utils";
import CalendarHeader from "./room-availability-calendar/calendar-header";
import CalendarGrid from "./room-availability-calendar/calendar-grid";
import CalendarLegend from "./room-availability-calendar/calendar-legend";
import ErrorAlert from "./room-availability-calendar/error-alert";

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
  const [optimisticOverrides, setOptimisticOverrides] = useState<
    Map<string, boolean>
  >(new Map());

  const {
    loading,
    error,
    fetchUnavailableDates,
    markDatesUnavailable,
    unmarkDatesUnavailable,
    isDateUnavailable,
  } = useRoomAvailability(roomId);

  const getCalendarDates = useCallback(
    () => generateCalendarDates(currentDate),
    [currentDate]
  );

  const handleDateClick = useCallback(
    async (date: Date) => {
      if (isPastDate(date)) return;
      const dateKey = formatDateKey(date);
      const currentlyBlocked = optimisticOverrides.has(dateKey)
        ? optimisticOverrides.get(dateKey)!
        : isDateUnavailable(dateKey);

      setOptimisticOverrides((prev) => {
        const next = new Map(prev);
        next.set(dateKey, !currentlyBlocked);
        return next;
      });

      try {
        if (currentlyBlocked) {
          await unmarkDatesUnavailable([dateKey]);
        } else {
          await markDatesUnavailable([dateKey]);
        }
      } finally {
      }
    },
    [
      isDateUnavailable,
      markDatesUnavailable,
      optimisticOverrides,
      unmarkDatesUnavailable,
    ]
  );

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + (direction === "prev" ? -1 : 1));
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open || !roomId) return;

    const gridDates = generateCalendarDates(currentDate);
    if (!gridDates.length) return;

    const startDate = gridDates[0];
    const endDate = gridDates[gridDates.length - 1];

    void fetchUnavailableDates(
      formatDateKey(startDate),
      formatDateKey(endDate)
    ).then(() => {
      setOptimisticOverrides(new Map());
    });
  }, [open, roomId, currentDate, fetchUnavailableDates]);

  const calendarDates = useMemo(() => getCalendarDates(), [getCalendarDates]);
  const monthYear = useMemo(
    () =>
      currentDate.toLocaleString("default", { month: "long", year: "numeric" }),
    [currentDate]
  );

  // Resolve blocked status, honoring any optimistic overrides
  const getIsBlocked = useCallback(
    (date: Date) => {
      const key = formatDateKey(date);
      return optimisticOverrides.has(key)
        ? (optimisticOverrides.get(key) as boolean)
        : isDateUnavailable(key);
    },
    [isDateUnavailable, optimisticOverrides]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] md:w-[80vw] max-w-4xl p-4 sm:p-6 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">Unavailable Dates - {roomName}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Mark specific dates as unavailable when this room cannot be rented.
            Rooms are available by default unless marked unavailable.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {error && <ErrorAlert message={error} />}

          <CalendarHeader
            monthLabel={monthYear}
            onPrev={() => navigateMonth("prev")}
            onNext={() => navigateMonth("next")}
          />

          <Card>
            <CardContent className="p-2 sm:p-4">
              <CalendarGrid
                dates={calendarDates}
                currentDate={currentDate}
                loading={loading}
                getIsBlocked={getIsBlocked}
                onDateClick={handleDateClick}
              />
            </CardContent>
          </Card>

          <CalendarLegend />

          <div className="text-xs sm:text-sm text-muted-foreground">
            Click on any date to toggle between available (green) and
            unavailable (red).
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RoomAvailabilityCalendar;
