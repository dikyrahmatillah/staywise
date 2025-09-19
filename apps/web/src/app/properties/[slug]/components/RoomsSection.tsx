"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// ...removed Badge and Bed imports; not needed for the inline layout
import { formatCurrency } from "@/lib/booking-formatters";
import Image from "next/image";

type Room = {
  id: string;
  name: string;
  basePrice: string | number;
  bedCount?: number;
  bedType?: string | null;
  maxGuests?: number;
  imageUrl?: string | null;
};

interface RoomsSectionProps {
  rooms: Room[];
  selectedRoomId?: string;
  onRoomSelect?: (room: Room) => void;
}

export function RoomsSection({
  rooms,
  selectedRoomId,
  onRoomSelect,
}: RoomsSectionProps) {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  const handleRoomSelect = (room: Room) => {
    onRoomSelect?.(room);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Room Details</h3>
      <div className="grid gap-4 grid-cols-1">
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room.id;

          return (
            <Card
              key={room.id}
              className={`w-full flex border p-0 hover:shadow-lg transition-shadow rounded-none overflow-hidden ${
                isSelected ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              <div className="flex-1 min-w-0 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {room.imageUrl ? (
                    <div className="relative w-22 h-16 flex-shrink-0 overflow-hidden">
                      <Image
                        src={room.imageUrl}
                        alt={`${room.name} image`}
                        fill
                        sizes="(max-width: 320px) 44vw, 120px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-44 h-28 bg-muted/40 flex items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="truncate">
                    <h4 className="text-sm font-medium truncate">
                      {room.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                      {room.bedCount ? (
                        <span className="truncate">
                          {room.bedCount} {room.bedCount === 1 ? "Bed" : "Beds"}
                        </span>
                      ) : null}

                      {room.bedType ? (
                        <span className="truncate">
                          &nbsp;·&nbsp;{room.bedType}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {formatCurrency(Number(room.basePrice))}{" "}
                    <span className="text-xs text-muted-foreground">
                      /night
                    </span>
                  </div>
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleRoomSelect(room)}
                      className="text-xs px-3 py-1"
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
