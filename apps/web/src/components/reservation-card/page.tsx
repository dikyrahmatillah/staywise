"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/search/date-range-picker";
import { format } from "date-fns";

export default function ReservationCard() {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const dateText =
    checkIn && checkOut
      ? `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d")}`
      : "Add dates for prices";

  return (
    <div>
      <Card className="w-[412px] px-6 shadow">
        <CardTitle className="text-2xl font-medium">{dateText}</CardTitle>

        <div className="mt-4">
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
          />
        </div>

        <Button className="text-[16px] rounded-full py-6 mt-6">
          Check availability
        </Button>
      </Card>
    </div>
  );
}
