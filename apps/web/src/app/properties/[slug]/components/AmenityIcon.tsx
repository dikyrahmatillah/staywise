"use client";

import {
  CheckCircle,
  Coffee,
  ExternalLink,
  Tv,
  Waves,
  Wifi,
  Wind,
  Car,
  ChefHat,
} from "lucide-react";
import type { Amenities } from "../mockDetails";

const AMENITY_MAP = {
  WIFI: { icon: Wifi, label: "WiFi" },
  PARKING: { icon: Car, label: "Parking" },
  SWIMMING_POOL: { icon: Waves, label: "Swimming Pool" },
  KITCHEN: { icon: ChefHat, label: "Kitchen" },
  TV: { icon: Tv, label: "TV" },
  AIR_CONDITIONER: { icon: Wind, label: "Air Conditioning" },
  BREAKFAST: { icon: Coffee, label: "Breakfast" },
  SEA_VIEW: { icon: Waves, label: "Sea View" },
  BALCONY: { icon: ExternalLink, label: "Balcony" },
  PET_FRIENDLY: { icon: CheckCircle, label: "Pet Friendly" },
  NON_SMOKING: { icon: CheckCircle, label: "Non Smoking" },
  WHEELCHAIR_ACCESS: { icon: CheckCircle, label: "Wheelchair Access" },
};

interface AmenityIconProps {
  amenity: keyof typeof AMENITY_MAP | Amenities;
}

export function AmenityIcon({ amenity }: AmenityIconProps) {
  const entry = AMENITY_MAP[amenity as keyof typeof AMENITY_MAP];
  const Icon = entry?.icon ?? CheckCircle;
  const label = entry?.label ?? String(amenity);

  return (
    <>
      <Icon className="h-5 w-5 text-green-600" />
      <span>{label}</span>
    </>
  );
}
