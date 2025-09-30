"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/booking-formatters";
import Image from "next/image";
import { Bed, Users } from "lucide-react";
import type { Room } from "@/types/property-detail";

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
      <h3 className="text-xl font-semibold">Room options</h3>
      <div className="grid gap-4 grid-cols-1">
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room.id;
          const normalizedBedType = room.bedType
            ? room.bedType.trim().toLowerCase()
            : null;

          const bedText =
            room.bedCount && normalizedBedType
              ? `${room.bedCount} ${normalizedBedType} ${
                  room.bedCount === 1 ? "bed" : "beds"
                }`
              : room.bedCount
              ? `${room.bedCount} ${room.bedCount === 1 ? "bed" : "beds"}`
              : normalizedBedType
              ? `${
                  /bed$/i.test(normalizedBedType)
                    ? normalizedBedType
                    : `${normalizedBedType} bed`
                }`
              : "";

          return (
            <Card
              key={room.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => handleRoomSelect(room)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRoomSelect(room);
                }
              }}
              className={`w-full flex border p-0 hover:shadow-lg hover:border-primary transition-shadow rounded-md overflow-hidden cursor-pointer ${
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
                        className="object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="w-44 h-28 bg-muted/40 flex items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="truncate">
                    <h4 className="text-md font-medium truncate">
                      {room.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                      {bedText ? (
                        <span className="inline-flex items-center gap-1 truncate">
                          <Bed
                            className="w-4 h-4 text-muted-foreground flex-shrink-0"
                            aria-hidden
                          />
                          <span className="truncate">{bedText}</span>
                        </span>
                      ) : null}

                      {room.capacity ? (
                        <span className="inline-flex items-center gap-1 truncate">
                          <span className="text-muted-foreground">
                            &middot;
                          </span>
                          <Users
                            className="w-4 h-4 text-muted-foreground flex-shrink-0"
                            aria-hidden
                          />
                          <span className="truncate">
                            {room.capacity}{" "}
                            {room.capacity === 1 ? "guest" : "guests"}
                          </span>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoomSelect(room);
                      }}
                      className="text-xs px-3 py-1 cursor-pointer"
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
