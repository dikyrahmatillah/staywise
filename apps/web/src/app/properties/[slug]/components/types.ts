import type { Amenities } from "../mockDetails";

export interface Landmark {
  name: string;
  distance: string;
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

export type { Amenities };
