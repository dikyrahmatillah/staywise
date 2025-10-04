export type BedType = "KING" | "QUEEN" | "SINGLE" | "TWIN";

export type RoomFormData = {
  name: string;
  description?: string;
  basePrice: number;
  capacity?: number;
  bedType?: BedType;
  bedCount?: number;
  imageFile?: File;
  imagePreview?: string;
};

export type BedTypeOption = {
  value: BedType;
  label: string;
  icon: string;
};

export const BED_TYPES: BedTypeOption[] = [
  { value: "KING", label: "King Bed", icon: "🛏️" },
  { value: "QUEEN", label: "Queen Bed", icon: "🛏️" },
  { value: "SINGLE", label: "Single Bed", icon: "🛏️" },
  { value: "TWIN", label: "Twin Bed", icon: "🛏️" },
];

export const DEFAULT_ROOM_FORM: RoomFormData = {
  name: "",
  description: "",
  basePrice: 0,
  capacity: 1,
  bedType: "KING",
  bedCount: 1,
};
