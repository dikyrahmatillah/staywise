"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
import { Plus, Trash2, Bed, Upload, X, DollarSign, Users } from "lucide-react";
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
  const dropRef = useRef<HTMLDivElement>(null);
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

  const rooms = useMemo(() => formData.rooms || [], [formData.rooms]);

  // Previews for rooms list: cache object URLs created from File objects so we don't
  // recreate them on every render. We store created URLs in createdRef and expose
  // a simple previews mapping keyed by room index for the UI.
  const previewsRef = useRef<Record<number, string>>({});

  useEffect(() => {
    const next: Record<number, string> = {};
    const usedIndices = new Set<number>();

    rooms.forEach((room: RoomFormData, idx: number) => {
      if (room.imagePreview) {
        next[idx] = room.imagePreview;
      } else if (room.imageFile) {
        // reuse previously created url for this index if present
        if (previewsRef.current[idx]) {
          next[idx] = previewsRef.current[idx];
        } else {
          const url = URL.createObjectURL(room.imageFile);
          previewsRef.current[idx] = url;
          next[idx] = url;
        }
      }
      usedIndices.add(idx);
    });

    // Revoke any created URLs that are no longer used
    Object.keys(previewsRef.current).forEach((k) => {
      const i = Number(k);
      if (!usedIndices.has(i)) {
        URL.revokeObjectURL(previewsRef.current[i]);
        delete previewsRef.current[i];
      }
    });

    // store next as a new ref snapshot
    setPreviewsState(next);
  }, [rooms]);

  // local state to trigger re-render when previews change
  const [previewsState, setPreviewsState] = useState<Record<number, string>>(
    {}
  );

  // cleanup all created object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
      previewsRef.current = {};
    };
  }, []);

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

      // Create preview URLF
      const previewUrl = URL.createObjectURL(file);

      setNewRoom((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: previewUrl,
      }));
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    if (!files || (files as FileList).length === 0) return;
    const file = Array.from(files)[0];
    if (!file.type.startsWith("image/")) return;
    if (file.size > 1024 * 1024) return;

    const previewUrl = URL.createObjectURL(file);
    setNewRoom((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: previewUrl,
    }));
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
    setNewRoom((prev) => {
      let nextValue: string | number = value as string | number;

      if (field === "basePrice") {
        const n = typeof value === "string" ? parseFloat(value) : value;
        nextValue = Number.isNaN(n) ? 0 : n;
      }

      if (field === "capacity" || field === "bedCount") {
        const n = typeof value === "string" ? parseInt(value) : value;
        nextValue = Number.isNaN(n) ? 1 : n;
      }

      return {
        ...prev,
        [field]: nextValue,
      };
    });
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
                  value={newRoom.capacity ?? 1}
                  onChange={(e) =>
                    handleNewRoomChange(
                      "capacity",
                      parseInt(e.target.value || "1")
                    )
                  }
                  className="h-11 w-32"
                />
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
                  value={newRoom.bedCount ?? 1}
                  onChange={(e) =>
                    handleNewRoomChange(
                      "bedCount",
                      parseInt(e.target.value || "1")
                    )
                  }
                  className="h-11 w-32"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Room Image <span className="text-gray-400">(Optional)</span>
            </Label>

            {!newRoom.imageFile ? (
              <div
                ref={dropRef}
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dropRef.current?.classList.add(
                    "ring-2",
                    "ring-primary/40",
                    "ring-offset-2",
                    "bg-primary/10"
                  );
                }}
                onDragLeave={() =>
                  dropRef.current?.classList.remove(
                    "ring-2",
                    "ring-primary/40",
                    "ring-offset-2",
                    "bg-primary/10"
                  )
                }
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dropRef.current?.classList.remove(
                    "ring-2",
                    "ring-primary/40",
                    "ring-offset-2",
                    "bg-primary/10"
                  );
                  if (e.dataTransfer?.files?.length)
                    handleFiles(e.dataTransfer.files);
                }}
                className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-200 hover:border-primary/40 bg-gradient-to-br from-gray-50/50 to-white cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl opacity-0 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Room Image
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Drag and drop an image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Maximum file size: 1MB • Supported formats: JPG, PNG
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <div className="w-full max-w-sm aspect-video border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                    <Image
                      src={newRoom.imagePreview!}
                      alt="Room preview"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 shadow-lg"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
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
              {rooms.map((room: RoomFormData, index: number) => {
                const previewSrc = previewsState[index] || room.imagePreview;
                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl border bg-white dark:bg-gray-900 p-6 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <div className="flex items-start gap-2 justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          {previewSrc ? (
                            <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                              <Image
                                src={previewSrc}
                                alt={room.name || "room image"}
                                width={80}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                              <Bed className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
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
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {room.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRoom(index)}
                          className="h-8"
                        >
                          Edit
                        </Button>

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveRoom(index)}
                          className="h-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
