"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  CalendarDays,
  Check,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";
import { cn } from "@/lib/utils";

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
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  const {
    loading,
    error,
    fetchBlockedDates,
    blockDates,
    unblockDates,
    isDateBlocked,
  } = useRoomAvailability(roomId);

  // Generate calendar dates for current month
  const generateCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    // Start from the beginning of the week
    startDate.setDate(startDate.getDate() - startDate.getDay());
    // End at the end of the week
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const dates: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = async (date: Date) => {
    if (isPastDate(date)) return;

    const dateKey = formatDateKey(date);
    console.log("Clicking date:", dateKey);
    console.log("Is date blocked?", isDateBlocked(dateKey));

    if (bulkMode) {
      setSelectedDates((prev) => {
        const newSelected = new Set(prev);
        if (newSelected.has(dateKey)) {
          newSelected.delete(dateKey);
        } else {
          newSelected.add(dateKey);
        }
        return newSelected;
      });
    } else {
      // Toggle: if blocked, unblock it; if available, block it
      if (isDateBlocked(dateKey)) {
        console.log("Unblocking date:", dateKey);
        await unblockDates([dateKey]);
      } else {
        console.log("Blocking date:", dateKey);
        await blockDates([dateKey]);
      }
    }
  };

  const handleBulkBlock = async () => {
    if (selectedDates.size === 0) return;
    const dates = Array.from(selectedDates);
    await blockDates(dates);
    setSelectedDates(new Set());
    setBulkMode(false);
  };

  const handleBulkUnblock = async () => {
    if (selectedDates.size === 0) return;
    const dates = Array.from(selectedDates);
    await unblockDates(dates);
    setSelectedDates(new Set());
    setBulkMode(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const refreshAvailability = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    fetchBlockedDates(formatDateKey(startDate), formatDateKey(endDate));
  }, [currentDate, fetchBlockedDates]);

  useEffect(() => {
    if (open && roomId) {
      refreshAvailability();
    }
  }, [open, roomId, currentDate, refreshAvailability]);

  useEffect(() => {
    if (!bulkMode) {
      setSelectedDates(new Set());
    }
  }, [bulkMode]);

  const calendarDates = generateCalendarDates();
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

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

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
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

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAvailability}
                disabled={loading}
              >
                <RefreshCw
                  className={cn("h-4 w-4 mr-2", loading && "animate-spin")}
                />
                Refresh
              </Button>
              <Button
                variant={bulkMode ? "default" : "outline"}
                size="sm"
                onClick={() => setBulkMode(!bulkMode)}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Bulk Mode
              </Button>
            </div>
          </div>

          {/* Bulk actions */}
          {bulkMode && selectedDates.size > 0 && (
            <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <span className="text-sm text-blue-700 flex-1">
                {selectedDates.size} date{selectedDates.size > 1 ? "s" : ""}{" "}
                selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkBlock}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Block Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkUnblock}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Unblock Selected
              </Button>
            </div>
          )}

          {/* Legend */}
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

          {/* Calendar */}
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
                  const isSelected = selectedDates.has(dateKey);

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
                        isSelected && bulkMode && "ring-2 ring-blue-500",
                        isBlocked
                          ? "bg-red-100 border-red-300 text-red-800"
                          : "bg-green-100 border-green-300 text-green-800",
                        !isPast && !loading && "cursor-pointer"
                      )}
                    >
                      {date.getDate()}
                      {isSelected && bulkMode && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="text-sm text-muted-foreground">
            {bulkMode
              ? "Select dates and use bulk actions to block or unblock them."
              : "Click on any date to toggle between available (green) and blocked (red). Rooms are available by default unless blocked."}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
