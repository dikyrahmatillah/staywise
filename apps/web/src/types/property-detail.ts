import type { AmenityType, PropertyDetailResponse } from "@/schemas";

export type Amenities = AmenityType;

export type Property = {
  id: string;
  name: string;
  city: string;
  address: string;
  facilities?: { id: string; propertyId: string; facility: Amenities }[];
};

export type Facility = { id: string; propertyId: string; facility: Amenities };

export type Room = {
  id: string;
  name: string;
  basePrice: number;
  bedCount?: number;
  bedType?: string | null;
  maxGuests?: number;
  capacity?: number;
  imageUrl?: string | null;
  beds?: number;
};

export type DetailResponse = PropertyDetailResponse & {
  PropertyCategory?: { name: string } | null;
  CustomCategory?: { name: string } | null;
  priceFrom?: number;
};

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

export interface StatsHeaderProps {
  city: string;
  address?: string | null;
  description?: string | null;
  rating: number;
  reviewCount: number;
  maxGuests?: number | null;
  minGuests?: number | null;
  bedrooms: number;
  totalBeds?: number;
  bedTypeSummary?: string;
}

export default DetailResponse;
