"use client";

import { useState } from "react";
import type { Room } from "@/types/room";
import { RoomAvailabilityCalendar } from "./room/room-availability-calendar";
import Ellipsis from "@/components/ui/ellipsis";
import { RoomListEmpty } from "./room/room-list-empty";
import { PriceAdjustmentModal } from "./price-adjustment-modal";
import { RoomCard } from "./room/room-card";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";

interface RoomListProps {
  rooms: Room[];
  loading?: boolean;
  isEmpty?: boolean;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

export function RoomList({
  rooms,
  loading = false,
  isEmpty = false,
  onEdit,
  onDelete,
}: RoomListProps) {
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
      {loading ? (
        <div className="min-h-[160px] p-6 flex flex-col items-center justify-center space-y-3">
          <div className="text-muted-foreground">
            <Ellipsis size={10} className="text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Loading rooms...</p>
          </div>
        </div>
      ) : isEmpty ? (
        <RoomListEmpty />
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={onEdit}
              onDelete={(id) => setDeleteRoomId(id)}
              onManageAvailability={handleManageAvailability}
              onManagePriceAdjustment={handleManagePriceAdjustment}
            />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deleteRoomId}
        onOpenChange={() => setDeleteRoomId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Room"
        description={
          "Are you sure you want to delete this room? This action cannot be undone. All bookings and related data for this room will be affected."
        }
        confirmLabel="Delete Room"
      />

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
