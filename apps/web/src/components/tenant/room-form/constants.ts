import type { BedType } from "@/types/room";

export const bedTypeOptions: { value: BedType; label: string }[] = [
  { value: "KING", label: "King Bed" },
  { value: "QUEEN", label: "Queen Bed" },
  { value: "SINGLE", label: "Single Bed" },
  { value: "TWIN", label: "Twin Bed" },
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
