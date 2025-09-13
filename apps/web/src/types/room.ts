export type BedType = "KING" | "QUEEN" | "SINGLE" | "TWIN";

export interface RoomAvailability {
  id: string;
  roomId: string;
  date: string;
  isAvailable: boolean;
  createdAt: string;
}

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
  RoomAvailabilities?: RoomAvailability[];
}

export interface RoomApiResponse {
  message: string;
  data: Room;
}

export interface RoomsApiResponse {
  message: string;
  data: Room[];
}

export interface RoomAvailabilityApiResponse {
  message: string;
  data: RoomAvailability[];
}

export interface BlockDatesRequest {
  dates: string[];
}

export interface UnblockDatesRequest {
  dates: string[];
}
