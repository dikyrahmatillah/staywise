"use client";

import React, { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Room, BedType } from "@/types/room";
import { CreateRoomInput, UpdateRoomInput, updateRoomSchema, } from "@repo/schemas";
import RoomDetails from "./RoomDetails";
import RoomImage from "./RoomImage";

interface RoomFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRoomInput | UpdateRoomInput | FormData) => Promise<void>;
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

export default function RoomForm({ open, onOpenChange, onSubmit, room, title, description, }: RoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: 0, capacity: 1, bedType: "" as BedType | "", bedCount: 1, imageUrl: "", description: "", });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  useEffect(() => {
    if (room) {
      setFormData({ name: room.name, price: room.basePrice, capacity: room.capacity, bedType: room.bedType || "", bedCount: room.bedCount, imageUrl: room.imageUrl || "", description: room.description || "", });
      setPreviewUrl(room.imageUrl || "");
      setImageFile(null);
    } else {
      setFormData({ name: "", price: 0, capacity: 1, bedType: "", bedCount: 1, imageUrl: "", description: "", });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setFormData((prev) => {
      const raw = name === "price" || name === "capacity" || name === "bedCount" ? Number(value) : value;
      const clamped = typeof raw === "number" && raw < 0 && (name === "price" || name === "capacity" || name === "bedCount") ? 0 : raw;
      return { ...prev, [name]: clamped };
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (value: BedType) => setFormData((prev) => ({ ...prev, bedType: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setErrors((prev) => ({ ...prev, imageUrl: "Unsupported file type. Allowed: JPG, PNG, GIF, WEBP." }));
        setImageFile(null);
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors((prev) => ({ ...prev, imageUrl: "File is too large. Maximum size is 5 MB." }));
        setImageFile(null);
        return;
      }
      setImageFile(file);
      if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleChooseFileClick = () => fileInputRef.current?.click();
  const truncateFileName = (name: string, max = 30) => {
    if (name.length <= max) return name;
    const extIndex = name.lastIndexOf(".");
    const ext = extIndex > -1 ? name.slice(extIndex) : "";
    const base = extIndex > -1 ? name.slice(0, extIndex) : name;
    const keep = Math.max(6, Math.floor((max - ext.length) / 2));
    return `${base.slice(0, keep)}...${base.slice(-keep)}${ext}`;
  };

  const validateForm = () => {
    try {
      type Payload = {
        name: string;
        basePrice: number;
        capacity: number;
        bedType?: BedType;
        bedCount: number;
        imageUrl?: string;
        description?: string;
      };

      const payload: Payload = {
        name: String(formData.name),
        basePrice: Number(formData.price),
        capacity: Number(formData.capacity),
        bedType: formData.bedType || undefined,
        bedCount: Number(formData.bedCount),
        imageUrl: formData.imageUrl || undefined,
        description: formData.description || undefined,
      };
      const validatedData = updateRoomSchema.parse(payload) as UpdateRoomInput;
      setErrors({});
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => { if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message; });
        setErrors(newErrors);
      }
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile) {
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) { setErrors((prev) => ({ ...prev, imageUrl: "Unsupported file type. Allowed: JPG, PNG, GIF, WEBP." })); toast.error("Please fix the form errors"); return; }
      if (imageFile.size > MAX_IMAGE_SIZE) { setErrors((prev) => ({ ...prev, imageUrl: "File is too large. Maximum size is 5 MB." })); toast.error("Please fix the form errors"); return; }
    }

    const validatedData = validateForm();
    if (!validatedData) { toast.error("Please fix the form errors"); return; }

    setIsSubmitting(true);
    try {
      if (imageFile) {
        const form = new FormData();
        form.append("name", String(validatedData.name));
        const basePrice = (validatedData as CreateRoomInput | UpdateRoomInput).basePrice ?? formData.price;
        form.append("basePrice", String(basePrice));
        form.append("capacity", String(validatedData.capacity));
        if (validatedData.bedType) form.append("bedType", String(validatedData.bedType));
        form.append("bedCount", String(validatedData.bedCount));
        if (validatedData.description) form.append("description", String(validatedData.description));
        form.append("imageFile", imageFile);
        await onSubmit(form);
      } else {
        await onSubmit(validatedData);
      }
      setFormData({ name: "", price: 0, capacity: 1, bedType: "", bedCount: 1, imageUrl: "", description: "", });
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
              <TabsTrigger value="room" className="cursor-pointer">Room</TabsTrigger>
              <TabsTrigger value="image" className="cursor-pointer">Image</TabsTrigger>
            </TabsList>

            <RoomDetails formData={formData} errors={errors} isSubmitting={isSubmitting} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} bedTypeOptions={bedTypeOptions} />

            <RoomImage fileInputRef={fileInputRef} previewUrl={previewUrl} imageFile={imageFile} isSubmitting={isSubmitting} handleChooseFileClick={handleChooseFileClick} handleFileChange={handleFileChange} truncateFileName={truncateFileName} errors={errors} />

          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{room ? "Update Room" : "Create Room"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
