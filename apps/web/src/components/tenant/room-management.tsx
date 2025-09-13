"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Plus, RefreshCw } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { RoomForm } from "./room-form";
import { RoomList } from "./room-list";
import type { Room } from "@/types/room";
import { CreateRoomInput, UpdateRoomInput } from "@repo/schemas";

export function RoomManagement() {
  const params = useParams();
  const propertyId = params?.id as string;

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);

  const {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  } = useRooms(propertyId);

  const handleSubmit = async (data: CreateRoomInput | UpdateRoomInput) => {
    if (editingRoom) {
      await updateRoom(editingRoom.id, data as UpdateRoomInput);
    } else {
      await createRoom(data as CreateRoomInput);
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    await deleteRoom(roomId);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRoom(undefined);
  };

  if (!propertyId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Property ID not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground">
            Manage rooms for this property
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRooms} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Room
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Rooms ({rooms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RoomList
            rooms={rooms}
            loading={loading}
            onEdit={handleEditRoom}
            onDelete={handleDeleteRoom}
          />
        </CardContent>
      </Card>

      <RoomForm
        open={showForm}
        onOpenChange={handleCloseForm}
        onSubmit={handleSubmit}
        room={editingRoom}
        title={editingRoom ? "Edit Room" : "Create New Room"}
        description={
          editingRoom
            ? "Update the room details below."
            : "Add a new room to your property."
        }
      />
    </div>
  );
}
