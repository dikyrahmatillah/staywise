import type { PropertyResponse } from "@repo/schemas";

export type Property = PropertyResponse & {
  Pictures?: Array<{ id: string; imageUrl: string; note?: string | null }>;
  Facilities?: Array<{ id: string; facility: string; note?: string | null }>;
};

export type LocationValue = {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
};

export type EditPropertyFormData = {
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  maxGuests: number;
  latitude: string;
  longitude: string;
};
