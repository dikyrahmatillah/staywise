"use client";

import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bed,
  Users,
  DollarSign,
  Edit,
  Trash2,
  ImageIcon,
  Calendar,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import type { Room } from "@/types/room";
import { formatPrice, getBedTypeLabel } from "./room-utils";

interface Props {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
  onManageAvailability: (room: Room) => void;
  onManagePriceAdjustment: (room: Room) => void;
}

export function RoomCard({
  room,
  onEdit,
  onDelete,
  onManageAvailability,
  onManagePriceAdjustment,
}: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow py-0">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-64 h-48 sm:h-auto">
            {room.imageUrl ? (
              <Image
                src={room.imageUrl}
                alt={room.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}

            {room.bedType && (
              <Badge variant="secondary" className="absolute top-2 left-2">
                {room.bedType}
              </Badge>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-xl">{room.name}</CardTitle>

                {room.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {room.description}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600 text-lg">
                    {formatPrice(room.basePrice)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ night</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {room.capacity} Guest{room.capacity > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>
                      {room.bedCount} {getBedTypeLabel(room.bedType)}
                      {room.bedCount > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(room)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Room
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onManageAvailability(room)}
                >
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Availability
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onManagePriceAdjustment(room)}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Price Rules
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(room.id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Room
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Created: {new Date(room.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="h-3 w-3" />
                <span>Room ID: {room.id.slice(0, 8)}...</span>
              </div>
              {room.updatedAt !== room.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Updated: {new Date(room.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
