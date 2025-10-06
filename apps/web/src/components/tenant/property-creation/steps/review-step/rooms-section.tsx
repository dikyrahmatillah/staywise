"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, DollarSign, Users, ImageIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/booking-formatters";

interface Room {
  name: string;
  basePrice: number;
  imagePreview?: string;
  capacity?: number;
  bedCount?: number;
  bedType?: string;
  description?: string;
}

interface RoomsSectionProps {
  rooms?: Room[];
  onEdit: () => void;
}

export const RoomsSection = ({ rooms, onEdit }: RoomsSectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Bed className="w-5 h-5 text-gray-500" />
      <Label className="text-base font-medium">
        Rooms ({rooms?.length || 0})
      </Label>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto"
        onClick={onEdit}
      >
        Edit
      </Button>
    </div>
    <div className="mx-7 space-y-3">
      {rooms && rooms.length > 0 ? (
        rooms.map((room, index) => (
          <Card key={index} className="overflow-hidden py-0">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-32 aspect-[16/9] sm:aspect-[4/3]">
                  {room.imagePreview ? (
                    <Image
                      src={room.imagePreview}
                      alt={room.name}
                      fill
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  {room.bedType && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2"
                    >
                      {room.bedType}
                    </Badge>
                  )}
                </div>

                <div className="flex-1 p-4 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">{room.name}</h3>

                    {room.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                        {room.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600 text-sm">
                        {formatCurrency(room.basePrice)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / night
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {room.capacity || 1} Guest
                          {(room.capacity || 1) > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>
                          {room.bedCount || 1} {room.bedType}
                          {(room.bedCount || 1) > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No rooms added</p>
      )}
    </div>
  </div>
);
