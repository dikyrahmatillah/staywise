"use client";

import { useState, useEffect } from "react";
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
    basePrice: 0,
    capacity: 1,
    bedType: "" as BedType | "",
    bedCount: 1,
    imageUrl: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        basePrice: room.basePrice,
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
        basePrice: 0,
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
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "basePrice" || name === "capacity" || name === "bedCount"
          ? Number(value)
          : value,
    }));
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

  const validateForm = () => {
    try {
      const validatedData = createRoomSchema.parse({
        ...formData,
        bedType: formData.bedType || undefined,
        imageUrl: formData.imageUrl || undefined,
        description: formData.description || undefined,
      });
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
        form.append("basePrice", String(validatedData.basePrice));
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
        basePrice: 0,
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

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price (per night)</Label>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              placeholder="0"
              value={formData.basePrice}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.basePrice && (
              <p className="text-sm text-red-500">{errors.basePrice}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                placeholder="1"
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
                value={formData.bedCount}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {errors.bedCount && (
                <p className="text-sm text-red-500">{errors.bedCount}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bedType">Bed Type (Optional)</Label>
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

          <div className="space-y-2">
            <Label htmlFor="imageFile">Image (Optional)</Label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="block w-full text-sm text-slate-600"
            />
            {previewUrl && (
              <div className="mt-2 relative h-40 w-full">
                <Image
                  src={previewUrl}
                  alt="Selected preview"
                  fill
                  sizes="(max-width: 640px) 100vw, 40rem"
                  className="rounded-md object-cover"
                />
              </div>
            )}
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl}</p>
            )}
          </div>

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
