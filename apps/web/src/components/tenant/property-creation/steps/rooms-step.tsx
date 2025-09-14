"use client";

import { useState } from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Bed } from "lucide-react";
import type { CreateRoomInput } from "@repo/schemas";

const BED_TYPES = [
  { value: "KING", label: "King" },
  { value: "QUEEN", label: "Queen" },
  { value: "SINGLE", label: "Single" },
  { value: "TWIN", label: "Twin" },
];

export function RoomsStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const [newRoom, setNewRoom] = useState<Partial<CreateRoomInput>>({
    name: "",
    description: "",
    basePrice: 0,
    capacity: 1,
    bedType: "KING",
    bedCount: 1,
  });

  const rooms = formData.rooms || [];

  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.basePrice || newRoom.basePrice <= 0) {
      return;
    }

    const roomToAdd: CreateRoomInput = {
      name: newRoom.name,
      description: newRoom.description || undefined,
      basePrice: newRoom.basePrice,
      capacity: newRoom.capacity || 1,
      bedType: newRoom.bedType,
      bedCount: newRoom.bedCount || 1,
      imageUrl: newRoom.imageUrl || undefined,
    };

    updateFormData({
      rooms: [...rooms, roomToAdd],
    });

    // Reset form
    setNewRoom({
      name: "",
      description: "",
      basePrice: 0,
      capacity: 1,
      bedType: "KING",
      bedCount: 1,
    });
  };

  const handleRemoveRoom = (index: number) => {
    const updatedRooms = rooms.filter(
      (_: CreateRoomInput, i: number) => i !== index
    );
    updateFormData({ rooms: updatedRooms });
  };

  const handleNewRoomChange = (field: string, value: string | number) => {
    setNewRoom((prev: Partial<CreateRoomInput>) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rooms & Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Rooms */}
        {rooms.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Added Rooms:</Label>
            <div className="space-y-3">
              {rooms.map((room: CreateRoomInput, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Bed className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-gray-500">
                        ${room.basePrice}/night • {room.capacity} guests •{" "}
                        {room.bedCount} {room.bedType?.toLowerCase()} bed(s)
                      </p>
                      {room.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {room.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveRoom(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Room Form */}
        <div className="space-y-4 border-t pt-6">
          <Label className="text-base font-medium">Add New Room:</Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name *</Label>
              <Input
                id="roomName"
                value={newRoom.name || ""}
                onChange={(e) => handleNewRoomChange("name", e.target.value)}
                placeholder="e.g., Deluxe Room"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (per night) *</Label>
              <Input
                id="basePrice"
                type="number"
                min={0}
                step={0.01}
                value={newRoom.basePrice || ""}
                onChange={(e) =>
                  handleNewRoomChange(
                    "basePrice",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomDescription">Description (Optional)</Label>
            <textarea
              id="roomDescription"
              value={newRoom.description || ""}
              onChange={(e) =>
                handleNewRoomChange("description", e.target.value)
              }
              placeholder="Describe this room..."
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (guests) *</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={newRoom.capacity || 1}
                onChange={(e) =>
                  handleNewRoomChange("capacity", parseInt(e.target.value) || 1)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedType">Bed Type</Label>
              <Select
                value={newRoom.bedType || "KING"}
                onValueChange={(value) => handleNewRoomChange("bedType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bed type" />
                </SelectTrigger>
                <SelectContent>
                  {BED_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedCount">Number of Beds</Label>
              <Input
                id="bedCount"
                type="number"
                min={1}
                value={newRoom.bedCount || 1}
                onChange={(e) =>
                  handleNewRoomChange("bedCount", parseInt(e.target.value) || 1)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Room Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={newRoom.imageUrl || ""}
              onChange={(e) => handleNewRoomChange("imageUrl", e.target.value)}
              placeholder="https://example.com/room-image.jpg"
            />
          </div>

          <Button
            type="button"
            onClick={handleAddRoom}
            disabled={
              !newRoom.name || !newRoom.basePrice || newRoom.basePrice <= 0
            }
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </Button>
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bed className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No rooms added yet. Add your first room above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
