"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Room, BedType } from "@/types/room";
import {
  CreateRoomInput,
  createRoomSchema,
  UpdateRoomInput,
  updateRoomSchema,
} from "@repo/schemas";

interface RoomFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateRoomInput | UpdateRoomInput | FormData
  ) => Promise<void>;
  room?: Room;
  title: string;
  description: string;
}

const bedTypeOptions: { value: BedType; label: string }[] = [
  { value: "KING", label: "King Bed" },
  { value: "QUEEN", label: "Queen Bed" },
  { value: "SINGLE", label: "Single Bed" },
  { value: "TWIN", label: "Twin Bed" },
];

export function RoomForm({
  open,
  onOpenChange,
  onSubmit,
  room,
  title,
  description,
}: RoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0, // UI uses `price` but schema expects `basePrice`
    capacity: 1,
    bedType: "" as BedType | "",
    bedCount: 1,
    imageUrl: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // imageCaption removed - no caption input in this form
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        price: room.basePrice,
        capacity: room.capacity,
        bedType: room.bedType || "",
        bedCount: room.bedCount,
        imageUrl: room.imageUrl || "",
        description: room.description || "",
      });
      setPreviewUrl(room.imageUrl || "");
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        price: 0,
        capacity: 1,
        bedType: "",
        bedCount: 1,
        imageUrl: "",
        description: "",
      });
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [room, open]);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setFormData((prev) => {
      const raw =
        name === "price" || name === "capacity" || name === "bedCount"
          ? Number(value)
          : value;
      const clamped =
        typeof raw === "number" &&
        raw < 0 &&
        (name === "price" || name === "capacity" || name === "bedCount")
          ? 0
          : raw;
      return {
        ...prev,
        [name]: clamped,
      };
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value: BedType) => {
    setFormData((prev) => ({ ...prev, bedType: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    try {
      const payload = {
        ...formData,
        basePrice: formData.price,
        bedType: formData.bedType || undefined,
        imageUrl: formData.imageUrl || undefined,
        description: formData.description || undefined,
      };

      const validatedData = updateRoomSchema.parse(payload) as UpdateRoomInput;
      setErrors({});
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validatedData = validateForm();

    if (!validatedData) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    try {
      if (imageFile) {
        const form = new FormData();
        form.append("name", String(validatedData.name));
        // backend expects `basePrice` key
        const basePrice =
          (validatedData as CreateRoomInput | UpdateRoomInput).basePrice ??
          formData.price;
        form.append("basePrice", String(basePrice));
        form.append("capacity", String(validatedData.capacity));
        if (validatedData.bedType)
          form.append("bedType", String(validatedData.bedType));
        form.append("bedCount", String(validatedData.bedCount));
        if (validatedData.description)
          form.append("description", String(validatedData.description));
        form.append("imageFile", imageFile);

        await onSubmit(form);
      } else {
        await onSubmit(validatedData);
      }
      setFormData({
        name: "",
        price: 0,
        capacity: 1,
        bedType: "",
        bedCount: 1,
        imageUrl: "",
        description: "",
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting room form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="room">
            <TabsList className="w-full">
              <TabsTrigger value="room">Room</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>

            <TabsContent value="room">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter room name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="description">Description (optional)</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="A short description of the room"
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="price">Price (per night)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0"
                  min={0}
                  value={formData.price}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    placeholder="1"
                    min={0}
                    value={formData.capacity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-500">{errors.capacity}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedCount">Bed Count</Label>
                  <Input
                    id="bedCount"
                    name="bedCount"
                    type="number"
                    placeholder="1"
                    min={0}
                    value={formData.bedCount}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {errors.bedCount && (
                    <p className="text-sm text-red-500">{errors.bedCount}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="bedType">Bed Type</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={formData.bedType}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bedType && (
                  <p className="text-sm text-red-500">{errors.bedType}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="image">
              <div className="space-y-2">
                <Label htmlFor="imageFile">Image</Label>
                <input
                  ref={fileInputRef}
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="w-full"
                />

                {/* clickable preview area */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handlePickImage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handlePickImage();
                  }}
                  className={`mt-2 relative h-40 w-full rounded-md overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer bg-muted/5`}
                >
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Selected preview"
                      fill
                      sizes="(max-width: 640px) 100vw, 40rem"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                      <div>Click an image here to upload</div>
                      <div className="text-xs text-muted-foreground">
                        PNG, JPG, GIF
                      </div>
                    </div>
                  )}
                </div>

                {errors.imageUrl && (
                  <p className="text-sm text-red-500">{errors.imageUrl}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {room ? "Update Room" : "Create Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
