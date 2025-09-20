export type Amenities =
  | "WIFI"
  | "AIR_CONDITIONER"
  | "PARKING"
  | "SWIMMING_POOL"
  | "KITCHEN"
  | "TV"
  | "WATER_HEATER"
  | "WASHING_MACHINE"
  | "REFRIGERATOR"
  | "MICROWAVE"
  | "ELEVATOR"
  | "GYM"
  | "RECEPTION_24H"
  | "SECURITY"
  | "CCTV"
  | "PET_FRIENDLY"
  | "SMOKING_ALLOWED"
  | "NON_SMOKING"
  | "WHEELCHAIR_ACCESS"
  | "BREAKFAST"
  | "BALCONY"
  | "SEA_VIEW"
  | "MOUNTAIN_VIEW"
  | "GARDEN"
  | "BBQ";

export interface Property {
  id: string;
  name: string;
  city?: string;
  address?: string;
  facilities?: { id: string; propertyId: string; facility: Amenities }[];
}

export interface SleepingArrangement {
  room: string;
  beds: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface NearbyPropertyItem {
  id: string;
  name: string;
  image: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  priceFrom: number;
}

// exported above
