"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed } from "lucide-react";
import { formatCurrency } from "@/lib/booking-formatters";

type Room = {
  id: string;
  name: string;
  basePrice: string | number;
  bedCount?: number;
  bedType?: string | null;
};

interface RoomsSectionProps {
  rooms: Room[];
}

export function RoomsSection({ rooms }: RoomsSectionProps) {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Room Details</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <Card key={room.id} className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{room.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatCurrency(Number(room.basePrice))}
                </span>
                <span className="text-sm text-muted-foreground">/night</span>
              </div>

              <div className="flex gap-4">
                {room.bedCount && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {room.bedCount} {room.bedCount === 1 ? "Bed" : "Beds"}
                    </span>
                  </div>
                )}

                {room.bedType && (
                  <Badge variant="secondary" className="text-xs">
                    {room.bedType}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
