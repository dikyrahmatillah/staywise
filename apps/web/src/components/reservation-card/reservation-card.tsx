"use client";
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "../search/date-range-picker";
import { GuestSelector } from "../search/guest-selector";
import { Button } from "@/components/ui/button";

export default function ReservationCard() {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [guestsOpen, setGuestsOpen] = useState(false);

  return (
    <div>
      <Card className="w-[412px] px-6 shadow">
        <CardTitle className="text-2xl font-medium">
          Add dates for prices
        </CardTitle>
        <div className="grid grid-rows-2 mt-3 border border-gray-300 rounded-2xl">
          <div className="border-b-2">
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              isOpen={isOpen}
              onOpenChange={setIsOpen}
            />
          </div>
          <div>
            <GuestSelector
              adults={adults}
              childrenCount={children}
              pets={pets}
              onAdultsChange={setAdults}
              onChildrenChange={setChildren}
              onPetsChange={setPets}
              isOpen={guestsOpen}
              onOpenChange={setGuestsOpen}
            />
          </div>
        </div>

        <Button className="text-[16px] rounded-full py-6">
          Check availability
        </Button>
      </Card>
    </div>
  );
}
