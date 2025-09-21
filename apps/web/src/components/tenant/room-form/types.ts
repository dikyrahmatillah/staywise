import type { BedType } from "@/types/room";

export type RoomFormState = {
  name: string;
  price: number;
  capacity: number;
  bedType: BedType | "";
  bedCount: number;
  imageUrl: string;
  description: string;
};

export type RoomFormErrors = Record<string, string>;
