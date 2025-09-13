export type BedType = "KING" | "QUEEN" | "SINGLE" | "TWIN";

export interface Room {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  capacity: number;
  bedType?: BedType;
  bedCount: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomApiResponse {
  message: string;
  data: Room;
}

export interface RoomsApiResponse {
  message: string;
  data: Room[];
}
