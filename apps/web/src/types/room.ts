export type BedType = "KING" | "QUEEN" | "SINGLE" | "TWIN";
export type PriceAdjustType = "PERCENTAGE" | "NOMINAL";

export interface PriceAdjustmentDate {
  id: string;
  priceAdjustmentId: string;
  date: string;
}

export interface PriceAdjustment {
  id: string;
  roomId: string;
  title?: string;
  startDate: string;
  endDate: string;
  adjustType: PriceAdjustType;
  adjustValue: number;
  applyAllDates: boolean;
  createdAt: string;
  Dates?: PriceAdjustmentDate[];
}

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
  PriceAdjustments?: PriceAdjustment[];
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

export interface MarkDatesUnavailableRequest {
  dates: string[];
}

export interface UnmarkDatesUnavailableRequest {
  dates: string[];
}

export interface CreatePriceAdjustmentRequest {
  title?: string;
  startDate: string;
  endDate: string;
  adjustType: PriceAdjustType;
  adjustValue: number;
  applyAllDates?: boolean;
  dates?: string[];
}

export interface PriceAdjustmentApiResponse {
  message: string;
  data: PriceAdjustment;
}

export interface PriceAdjustmentsApiResponse {
  message: string;
  data: PriceAdjustment[];
}
