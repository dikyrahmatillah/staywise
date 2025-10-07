import type { PropertyResponse } from "@/schemas";

export type Property = PropertyResponse & {
  Pictures?: Array<{ id: string; imageUrl: string; note?: string | null }>;
  Facilities?: Array<{ id: string; facility: string; note?: string | null }>;
  PropertyCategory?: { id: string; name: string };
  CustomCategory?: { id: string; name: string } | null;
  propertyCategoryId?: string;
  customCategoryId?: string;
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
  latitude: string;
  longitude: string;
};
