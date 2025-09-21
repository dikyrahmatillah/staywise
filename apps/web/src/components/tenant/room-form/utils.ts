import type { Room } from "@/types/room";
import type { CreateRoomInput, UpdateRoomInput } from "@repo/schemas";

import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "./constants";
import type { RoomFormState } from "./types";

export function initialRoomFormState(): RoomFormState {
  return {
    name: "",
    price: 1,
    capacity: 1,
    bedType: "",
    bedCount: 1,
    imageUrl: "",
    description: "",
  };
}

export function deriveFormStateFromRoom(room: Room): RoomFormState {
  return {
    name: room.name,
    price: Math.max(1, room.basePrice),
    capacity: Math.max(1, room.capacity),
    bedType: room.bedType || "",
    bedCount: Math.max(1, room.bedCount),
    imageUrl: room.imageUrl || "",
    description: room.description || "",
  };
}

export function isNumericField(name: string): boolean {
  return name === "price" || name === "capacity" || name === "bedCount";
}

export function sanitizeNumericInput(
  name: string,
  value: string
): number | string {
  if (!isNumericField(name)) return value;
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  const min = 1;
  if (num < min) return min;
  return num;
}

export function validateImage(file: File | null): string | null {
  if (!file) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Unsupported file type. Allowed: JPG, PNG, GIF, WEBP.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "File is too large. Maximum size is 5 MB.";
  }
  return null;
}

export function toUpdateRoomSchemaInput(form: RoomFormState) {
  return {
    ...form,
    basePrice: form.price,
    bedType: form.bedType || undefined,
    imageUrl: form.imageUrl || undefined,
    description: form.description || undefined,
  };
}

export function determineBasePrice(
  data: CreateRoomInput | UpdateRoomInput,
  fallbackPrice: number
): number {
  return (data.basePrice ?? fallbackPrice) as number;
}

export function buildRoomFormData(
  data: CreateRoomInput | UpdateRoomInput,
  imageFile: File,
  fallbackPrice: number
): FormData {
  const form = new FormData();
  form.append("name", String(data.name));
  const basePrice = determineBasePrice(data, fallbackPrice);
  form.append("basePrice", String(basePrice));
  form.append("capacity", String(data.capacity));
  if ((data as UpdateRoomInput).bedType)
    form.append("bedType", String((data as UpdateRoomInput).bedType));
  form.append("bedCount", String(data.bedCount));
  if ((data as UpdateRoomInput).description)
    form.append("description", String((data as UpdateRoomInput).description));
  form.append("imageFile", imageFile);
  return form;
}

export function truncateFileName(name: string, max = 30): string {
  if (name.length <= max) return name;
  const extIndex = name.lastIndexOf(".");
  const ext = extIndex > -1 ? name.slice(extIndex) : "";
  const base = extIndex > -1 ? name.slice(0, extIndex) : name;
  const keep = Math.max(6, Math.floor((max - ext.length) / 2));
  return `${base.slice(0, keep)}...${base.slice(-keep)}${ext}`;
}
