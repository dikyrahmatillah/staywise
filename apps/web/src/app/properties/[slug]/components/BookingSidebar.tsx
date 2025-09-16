"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { GuestSelector } from "@/components/booking-card/guest-selector";

export function BookingSidebar({
  pricePerNight,
  maxGuests = 10,
  propertyId,
}: {
  pricePerNight: number;
  maxGuests?: number;
  propertyId?: string;
}) {
  const router = useRouter();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [adults, setAdults] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [pets, setPets] = useState(0);
  const [guestSelectorOpen, setGuestSelectorOpen] = useState(false);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  };

  const nights = calculateNights();
  const totalPrice = nights * pricePerNight;

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates");
      return;
    }

    if (adults === 0) {
      alert("Please select at least one adult guest");
      return;
    }

    const bookingParams = new URLSearchParams({
      propertyId: propertyId || "1",
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      adults: adults.toString(),
      children: childrenCount.toString(),
      pets: pets.toString(),
      pricePerNight: pricePerNight.toString(),
    });

    router.push(`/booking?${bookingParams.toString()}`);
  };

  return (
    <div className="sticky top-20">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-baseline gap-0.5">
            <span className="font-sans text-3xl font-bold">
              ${pricePerNight}
            </span>
            <span className="font-sans text-muted-foreground">/night</span>
          </div>
          {nights > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              ${pricePerNight} x {nights} night{nights > 1 ? "s" : ""} ={" "}
              <span className="font-semibold text-foreground">
                ${totalPrice}
              </span>
            </div>
          )}
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
                maxGuests={maxGuests || 10}
              />
            </div>
          </div>

          <Button
            className="w-full text-[16px] rounded-full py-6"
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
