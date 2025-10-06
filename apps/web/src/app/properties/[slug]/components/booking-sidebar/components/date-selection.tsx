"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useBookingSidebar } from "../context/booking-sidebar-context";
import { useBookingValidation } from "../hooks/use-booking-validation";
import { useDateAvailability } from "../hooks/use-date-availability";
import { formatDateDisplay } from "../utils/date-formatters";

export function DateSelection() {
  const {
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,
  } = useBookingSidebar();

  const { getFieldError } = useBookingValidation();
  const {
    isDateDisabled,
    isCheckoutDisabled,
    handleCheckInChange,
  } = useDateAvailability();

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckInDate(date);
    handleCheckInChange(date);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Check-in Date */}
      <div>
        <Label htmlFor="checkIn" className="text-sm font-medium">
          Check-in
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal mt-1.5 bg-white border-slate-200 hover:bg-slate-50 px-3 py-3 sm:py-2 min-h-[44px] ${
                getFieldError("checkInDate")
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-slate-500" />
              {formatDateDisplay(checkInDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full sm:w-auto max-w-[420px] p-0 border-slate-200 left-0 right-0 mx-0 sm:mx-0">
            <CalendarComponent
              mode="single"
              selected={checkInDate}
              onSelect={handleCheckInSelect}
              disabled={isDateDisabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {getFieldError("checkInDate") && (
          <p className="text-sm text-red-500 mt-1">
            {getFieldError("checkInDate")}
          </p>
        )}
      </div>

      {/* Check-out Date */}
      <div>
        <Label htmlFor="checkOut" className="text-sm font-medium">
          Check-out
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal mt-1.5 bg-white border-slate-200 hover:bg-slate-50 px-3 py-3 sm:py-2 min-h-[44px] ${
                getFieldError("checkOutDate")
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-slate-500" />
              {formatDateDisplay(checkOutDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full sm:w-auto max-w-[420px] p-0 border-slate-200 left-0 right-0 mx-0 sm:mx-0">
            <CalendarComponent
              mode="single"
              selected={checkOutDate}
              onSelect={setCheckOutDate}
              disabled={isCheckoutDisabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {getFieldError("checkOutDate") && (
          <p className="text-sm text-red-500 mt-1">
            {getFieldError("checkOutDate")}
          </p>
        )}
      </div>
    </div>
  );
}