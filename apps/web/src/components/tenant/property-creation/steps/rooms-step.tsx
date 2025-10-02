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
import {
  Plus,
  Trash2,
  Bed,
  Upload,
  X,
  DollarSign,
  Users,
  Hotel,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
  { value: "KING", label: "King Bed", icon: "🛏️" },
  { value: "QUEEN", label: "Queen Bed", icon: "🛏️" },
  { value: "SINGLE", label: "Single Bed", icon: "🛏️" },
  { value: "TWIN", label: "Twin Bed", icon: "🛏️" },
];

// capacity and bed count use simple numeric inputs (1-8 guests, 1-4 beds)

export function RoomsStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [newRoom, setNewRoom] = useState<RoomFormData>({
    name: "",
    description: "",
    basePrice: 0,
    capacity: 1,
    bedType: "KING",
    bedCount: 1,
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

    if (editingIndex !== null && typeof editingIndex === "number") {
      // update existing room
      const updatedRooms = rooms.map((r: RoomFormData, i: number) =>
        i === editingIndex ? roomToAdd : r
      );
      updateFormData({ rooms: updatedRooms });
      setEditingIndex(null);
    } else {
      updateFormData({ rooms: [...rooms, roomToAdd] });
    }

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

  const handleEditRoom = (index: number) => {
    const room = rooms[index] as RoomFormData;
    if (!room) return;

    // Revoke any existing preview in the form
    if (newRoom.imagePreview) {
      URL.revokeObjectURL(newRoom.imagePreview);
    }

    const preview = room.imageFile
      ? URL.createObjectURL(room.imageFile)
      : room.imagePreview || undefined;

    setNewRoom({
      name: room.name || "",
      description: room.description || "",
      basePrice: room.basePrice || 0,
      capacity: room.capacity || 1,
      bedType: room.bedType || "KING",
      bedCount: room.bedCount || 1,
      imageFile: room.imageFile,
      imagePreview: preview,
    });

    setEditingIndex(index);

    // Scroll the form into view
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      // focus name input if present
      const el = formRef.current?.querySelector<HTMLInputElement>("#roomName");
      el?.focus();
    }, 50);
  };

  const handleCancelEdit = () => {
    if (newRoom.imagePreview) URL.revokeObjectURL(newRoom.imagePreview);
    setNewRoom({
      name: "",
      description: "",
      basePrice: 0,
      capacity: 1,
      bedType: "KING",
      bedCount: 1,
    });
    setEditingIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div className="space-y-6">
      {/* Add New Room Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Room
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="roomName" className="text-sm font-medium">
                  Room Name *
                </Label>
                <Input
                  id="roomName"
                  value={newRoom.name || ""}
                  onChange={(e) => handleNewRoomChange("name", e.target.value)}
                  placeholder="e.g., Deluxe Ocean View"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basePrice" className="text-sm font-medium">
                  Base Price (per night) *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
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
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomDescription" className="text-sm font-medium">
                Description <span className="text-gray-400">(Optional)</span>
              </Label>
              <Textarea
                id="roomDescription"
                value={newRoom.description || ""}
                onChange={(e) =>
                  handleNewRoomChange("description", e.target.value)
                }
                placeholder="Describe this room's features, amenities, and what makes it special..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <Separator />

          {/* Room Details */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Room Configuration</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-sm text-gray-600">
                  Guest Capacity *
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  max={8}
                  value={newRoom.capacity || 1}
                  onChange={(e) =>
                    handleNewRoomChange(
                      "capacity",
                      Math.max(1, Math.min(8, parseInt(e.target.value || "1")))
                    )
                  }
                  className="h-11 w-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter number of guests (1-8)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedType" className="text-sm text-gray-600">
                  Bed Type
                </Label>
                <Select
                  value={newRoom.bedType || "KING"}
                  onValueChange={(value) =>
                    handleNewRoomChange("bedType", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select bed type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BED_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedCount" className="text-sm text-gray-600">
                  Number of Beds
                </Label>
                <Input
                  id="bedCount"
                  type="number"
                  min={1}
                  max={4}
                  value={newRoom.bedCount || 1}
                  onChange={(e) =>
                    handleNewRoomChange(
                      "bedCount",
                      Math.max(1, Math.min(4, parseInt(e.target.value || "1")))
                    )
                  }
                  className="h-11 w-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter number of beds (1-4)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Room Image <span className="text-gray-400">(Optional)</span>
            </Label>

            {!newRoom.imageFile ? (
              <div
                className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Click to upload room image
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG up to 1MB
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <div className="w-40 h-28 border rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <Image
                      src={newRoom.imagePreview!}
                      alt="Room preview"
                      width={160}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 shadow-lg"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 dark:text-green-400">
                    {newRoom.imageFile.name} (
                    {(newRoom.imageFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div ref={formRef} className="pt-4">
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleAddRoom}
                disabled={
                  !newRoom.name || !newRoom.basePrice || newRoom.basePrice <= 0
                }
                className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingIndex !== null
                  ? "Save changes"
                  : "Add Room to Property"}
              </Button>

              {editingIndex !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="h-12"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {rooms.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Bed className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No rooms added yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Start by adding your first room with details and pricing above.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Existing Rooms */}
      {rooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bed className="w-5 h-5" />
              Added Rooms ({rooms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
                    className="group relative overflow-hidden rounded-xl border bg-white dark:bg-gray-900 p-6 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <Bed className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {room.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                <DollarSign className="w-3 h-3 mr-1" />$
                                {room.basePrice}/night
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {room.capacity} guests
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {room.bedCount} {room.bedType?.toLowerCase()}{" "}
                                bed(s)
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {room.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 pl-14">
                            {room.description}
                          </p>
                        )}

                        {room.imageFile && (
                          <div className="flex items-center gap-2 pl-14">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 dark:text-green-400">
                              Image: {room.imageFile.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRoom(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Edit
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRoom(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
