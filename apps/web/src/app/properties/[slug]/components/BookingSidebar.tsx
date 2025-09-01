"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

export function BookingSidebar({
  pricePerNight,
  maxGuests = 10,
}: {
  pricePerNight: number;
  maxGuests?: number | null;
}) {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(0);

  return (
    <div className="sticky top-20">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${pricePerNight}</span>
            <span className="text-muted-foreground">per night</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
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
                    className="w-full justify-start text-left font-normal"
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
            <Label htmlFor="guests">Guests</Label>
            <Input
              id="guests"
              type="number"
              min={1}
              max={maxGuests ?? 10}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            />
          </div>

          <Button className="w-full">Book Now</Button>
        </CardContent>
      </Card>
    </div>
  );
}
