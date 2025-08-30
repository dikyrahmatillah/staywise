"use client";

import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "../ui/calendar";

export default function ReservationCard() {
  const [dates, setDates] = React.useState<Date[]>([
    new Date(2025, 5, 12),
    new Date(2025, 6, 24),
  ]);
  return (
    <div>
      <Card className="w-[412px] px-6 shadow">
        <CardTitle className="text-2xl font-medium">
          Add dates for prices
        </CardTitle>

        <Calendar
          mode="multiple"
          numberOfMonths={2}
          defaultMonth={dates[0]}
          required
          selected={dates}
          onSelect={setDates}
          max={5}
          className="rounded-lg border shadow-sm"
        />

        <Button className="text-[16px] rounded-full py-6">
          Check availability
        </Button>
      </Card>
    </div>
  );
}
