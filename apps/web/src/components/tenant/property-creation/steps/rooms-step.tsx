"use client";

import { useState, useRef } from "react";
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
import { Plus, Trash2, Bed, Upload, X } from "lucide-react";
import Image from "next/image";

type RoomFormData = {
  name: string;
  description?: string;
  basePrice: number;
  capacity?: number;
  bedType?: "KING" | "QUEEN" | "SINGLE" | "TWIN";
  bedCount?: number;
  imageFile?: File;
  imagePreview?: string;
};

const BED_TYPES = [
  { value: "KING", label: "King" },
  { value: "QUEEN", label: "Queen" },
  { value: "SINGLE", label: "Single" },
  { value: "TWIN", label: "Twin" },
];

export function RoomsStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newRoom, setNewRoom] = useState<RoomFormData>({
    name: "",
    description: "",
    basePrice: 0,
    capacity: 1,
    bedType: "KING",
    bedCount: 1,
  });

  const rooms = formData.rooms || [];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (1MB limit)
      if (file.size > 1024 * 1024) {
        alert("File size must be less than 1MB");
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      setNewRoom((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: previewUrl,
      }));
    }
  };

  const handleRemoveImage = () => {
    if (newRoom.imagePreview) {
      URL.revokeObjectURL(newRoom.imagePreview);
    }
    setNewRoom((prev) => ({
      ...prev,
      imageFile: undefined,
      imagePreview: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.basePrice || newRoom.basePrice <= 0) {
      return;
    }

    const roomToAdd = {
      name: newRoom.name,
      description: newRoom.description || undefined,
      basePrice: newRoom.basePrice,
      capacity: newRoom.capacity || 1,
      bedType: newRoom.bedType,
      bedCount: newRoom.bedCount || 1,
      imageFile: newRoom.imageFile,
    };

    updateFormData({
      rooms: [...rooms, roomToAdd],
    });

    // Reset form but keep preview URL for cleanup
    if (newRoom.imagePreview) {
      URL.revokeObjectURL(newRoom.imagePreview);
    }

    setNewRoom({
      name: "",
      description: "",
      basePrice: 0,
      capacity: 1,
      bedType: "KING",
      bedCount: 1,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveRoom = (index: number) => {
    const updatedRooms = rooms.filter(
      (_: RoomFormData, i: number) => i !== index
    );
    updateFormData({ rooms: updatedRooms });
  };

  const handleNewRoomChange = (field: string, value: string | number) => {
    setNewRoom((prev) => ({
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
              {rooms.map(
                (
                  room: {
                    name: string;
                    basePrice: number;
                    capacity?: number;
                    bedCount?: number;
                    bedType?: string;
                    description?: string;
                    imageFile?: File;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Bed className="w-5 h-5 text-gray-500" />
                      <div className="flex-1">
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
                        {room.imageFile && (
                          <p className="text-sm text-green-600 mt-1">
                            📷 Image selected: {room.imageFile.name}
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
                )
              )}
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
            <Label>Room Image (Optional)</Label>
            <div className="space-y-3">
              {!newRoom.imageFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a room image (Max 1MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <div className="w-32 h-20 border rounded overflow-hidden">
                      <Image
                        src={newRoom.imagePreview!}
                        alt="Room preview"
                        width={128}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-green-600">
                    📷 {newRoom.imageFile.name} (
                    {(newRoom.imageFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}
            </div>
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
