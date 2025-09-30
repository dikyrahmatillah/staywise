import type {
  AmenityType,
  PropertyResponse,
  RoomResponse,
  CreatePropertyPictureInput,
} from "@repo/schemas";

export type Amenities = AmenityType;
export type Property = PropertyResponse & {
  facilities?: { id: string; propertyId: string; facility: Amenities }[];
};

export type Facility = { id: string; propertyId: string; facility: Amenities };
export type Room = RoomResponse & {
  bedCount?: number;
  bedType?: string | null;
  maxGuests?: number;
  capacity?: number;
  imageUrl?: string | null;
};

export type DetailResponse = {
  id: string;
  name: string;
  city: string;
  address: string;
  description?: string | null;
  maxGuests?: number;
  Rooms: Room[];
  Facilities: { id: string; propertyId: string; facility: Amenities }[];
  Pictures: (CreatePropertyPictureInput & {
    id: string;
    propertyId: string;
  })[];
  Reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    User: {
      firstName: string | null;
      lastName: string | null;
      image?: string | null;
    };
  }[];
  reviewCount?: number;
  averageRating?: number | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
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
