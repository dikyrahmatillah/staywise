"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { RoomForm } from "./room-form";
import { RoomList } from "./room-list";
import { RoomManagementFilters } from "./room-management-filters";
import { RoomManagementStats } from "./room-management-stats";
import {
  NoRoomsState,
  ErrorState,
  InvalidPropertyState,
} from "./room-management-states";
import type { Room } from "@/types/room";
import { CreateRoomInput, UpdateRoomInput } from "@repo/schemas";

export function RoomManagement() {
  const params = useParams();
  const propertyId = params?.id as string;

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [bedTypeFilter, setBedTypeFilter] = useState<string>("all");

  const {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    isEmpty,
  } = useRooms(propertyId);

  const bedTypes = useMemo(() => {
    const unique = new Set<string>();
    rooms.forEach((room) => {
      if (room.bedType) {
        unique.add(room.bedType);
      }
    });
    return Array.from(unique);
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesSearch =
        term.length === 0 ||
        room.name.toLowerCase().includes(term) ||
        room.description?.toLowerCase().includes(term);

      const matchesBedType =
        bedTypeFilter === "all" || room.bedType === bedTypeFilter;

      return matchesSearch && matchesBedType;
    });
  }, [rooms, searchTerm, bedTypeFilter]);

  const hasRooms = rooms.length > 0;
  const hasActiveFilters =
    filteredRooms.length === 0 && hasRooms && !loading;

  const handleSubmit = async (data: CreateRoomInput | UpdateRoomInput) => {
    if (editingRoom) {
      await updateRoom(editingRoom.id, data as UpdateRoomInput);
    } else {
      await createRoom(data as CreateRoomInput);
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    handleFormToggle(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    await deleteRoom(roomId);
  };

  const handleFormToggle = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      setEditingRoom(undefined);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setBedTypeFilter("all");
  };

  const handleAddRoom = () => {
    setEditingRoom(undefined);
    handleFormToggle(true);
  };

  if (!propertyId) {
    return <InvalidPropertyState />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="w-fit border-primary/40 bg-primary/10 text-primary"
            >
              Property #{propertyId}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground">
            Manage rooms for this property
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            onClick={fetchRooms}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleAddRoom} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add New Room
          </Button>
        </div>
      </div>

      <RoomManagementStats rooms={filteredRooms} loading={loading} />

      {error && <ErrorState error={error} />}

      <section className="space-y-6">
        <RoomManagementFilters
          searchTerm={searchTerm}
          bedTypeFilter={bedTypeFilter}
          bedTypes={bedTypes}
          onSearchChange={setSearchTerm}
          onBedTypeChange={setBedTypeFilter}
          onRefresh={fetchRooms}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          hasRooms={hasRooms}
        />

        {isEmpty || (!hasRooms && !loading) ? (
          <NoRoomsState onAddRoom={handleAddRoom} />
        ) : (
          !hasActiveFilters && (
            <RoomList
              rooms={filteredRooms}
              loading={loading}
              isEmpty={isEmpty}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
            />
          )
        )}
      </section>

      <RoomForm
        open={showForm}
        onOpenChange={handleFormToggle}
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
