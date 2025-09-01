"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { GuestSelector } from "@/components/reservation-card/guest-selector";

export function BookingSidebar({
  pricePerNight,
  maxGuests = 10,
}: {
  pricePerNight: number;
  maxGuests?: number | null;
}) {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [adults, setAdults] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [pets, setPets] = useState(0);
  const [guestSelectorOpen, setGuestSelectorOpen] = useState(false);

  return (
    <div className="sticky top-20">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${pricePerNight}</span>
            <span className="text-muted-foreground">per night</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate
                      ? checkInDate.toLocaleDateString()
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="checkOut">Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate
                      ? checkOutDate.toLocaleDateString()
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <div className="flex flex-row justify-between">
              <Label>Guests</Label>
              <Label>Max. guest: {maxGuests}</Label>
            </div>
            <div className="border rounded-md">
              <GuestSelector
                adults={adults}
                childrenCount={childrenCount}
                pets={pets}
                onAdultsChange={setAdults}
                onChildrenChange={setChildrenCount}
                onPetsChange={setPets}
                isOpen={guestSelectorOpen}
                onOpenChange={setGuestSelectorOpen}
              />
            </div>
          </div>

          <Button className="w-full text-[16px] rounded-full py-6">
            Book Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
