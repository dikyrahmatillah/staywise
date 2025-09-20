"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Dropdown menu removed; using explicit buttons instead
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { RoomAvailabilityCalendar } from "./room-availability-calendar";
import { PriceAdjustmentModal } from "./price-adjustment-modal";

interface RoomListProps {
  rooms: Room[];
  loading: boolean;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

export function RoomList({ rooms, loading, onEdit, onDelete }: RoomListProps) {
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);
  const [availabilityRoomId, setAvailabilityRoomId] = useState<string | null>(
    null
  );
  const [availabilityRoomName, setAvailabilityRoomName] = useState<string>("");
  const [priceAdjustmentRoomId, setPriceAdjustmentRoomId] = useState<
    string | null
  >(null);
  const [priceAdjustmentRoomName, setPriceAdjustmentRoomName] =
    useState<string>("");
  const [priceAdjustmentBasePrice, setPriceAdjustmentBasePrice] =
    useState<number>(0);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-200"></div>
                <div className="flex-1 p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first room to start managing your property.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBedTypeLabel = (bedType?: string) => {
    switch (bedType) {
      case "KING":
        return "King Bed";
      case "QUEEN":
        return "Queen Bed";
      case "SINGLE":
        return "Single Bed";
      case "TWIN":
        return "Twin Bed";
      default:
        return "Standard Bed";
    }
  };

  const handleConfirmDelete = () => {
    if (deleteRoomId) {
      onDelete(deleteRoomId);
      setDeleteRoomId(null);
    }
  };

  const handleManageAvailability = (room: Room) => {
    setAvailabilityRoomId(room.id);
    setAvailabilityRoomName(room.name);
  };

  const handleCloseAvailability = () => {
    setAvailabilityRoomId(null);
    setAvailabilityRoomName("");
  };

  const handleManagePriceAdjustment = (room: Room) => {
    setPriceAdjustmentRoomId(room.id);
    setPriceAdjustmentRoomName(room.name);
    setPriceAdjustmentBasePrice(room.basePrice);
  };

  const handleClosePriceAdjustment = () => {
    setPriceAdjustmentRoomId(null);
    setPriceAdjustmentRoomName("");
    setPriceAdjustmentBasePrice(0);
  };

  return (
    <>
      <div className="space-y-4">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto">
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
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2"
                    >
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
                        <span className="text-sm text-muted-foreground">
                          / night
                        </span>
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
                        onClick={() => handleManageAvailability(room)}
                      >
                        <CalendarDays className="h-4 w-4 mr-1" />
                        Block Dates
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleManagePriceAdjustment(room)}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Price Rules
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteRoomId(room.id)}
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
                          Updated:{" "}
                          {new Date(room.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!deleteRoomId}
        onOpenChange={() => setDeleteRoomId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this room? This action cannot be
              undone. All bookings and related data for this room will be
              affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {availabilityRoomId && (
        <RoomAvailabilityCalendar
          roomId={availabilityRoomId}
          roomName={availabilityRoomName}
          open={!!availabilityRoomId}
          onOpenChange={handleCloseAvailability}
        />
      )}

      {priceAdjustmentRoomId && (
        <PriceAdjustmentModal
          roomId={priceAdjustmentRoomId}
          roomName={priceAdjustmentRoomName}
          basePrice={priceAdjustmentBasePrice}
          open={!!priceAdjustmentRoomId}
          onOpenChange={handleClosePriceAdjustment}
        />
      )}
    </>
  );
}
