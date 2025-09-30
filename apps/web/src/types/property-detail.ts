import type { Amenities } from "@/app/properties/[slug]/components/types";

export type Room = {
  id: string;
  name: string;
  basePrice: string | number;
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
  Pictures: {
    id: string;
    propertyId: string;
    imageUrl: string;
    note?: string | null;
  }[];
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

export default DetailResponse;
