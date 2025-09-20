"use client";

import React from "react";
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
  RotateCcw,
  Camera,
  Clock,
  Building2,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import type { Amenities } from "./types";

type IconProps = React.ComponentProps<typeof Wifi>;
type IconType = React.ComponentType<IconProps>;

const AMENITY_MAP: Partial<
  Record<Amenities, { icon: IconType; label: string }>
> = {
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
  WATER_HEATER: { icon: CheckCircle, label: "Water Heater" },
  WASHING_MACHINE: { icon: RotateCcw, label: "Washing Machine" },
  REFRIGERATOR: { icon: ImageIcon, label: "Refrigerator" },
  MICROWAVE: { icon: ImageIcon, label: "Microwave" },
  ELEVATOR: { icon: Building2, label: "Elevator" },
  GYM: { icon: Users, label: "Gym" },
  RECEPTION_24H: { icon: Clock, label: "24h Reception" },
  SECURITY: { icon: CheckCircle, label: "Security" },
  CCTV: { icon: Camera, label: "CCTV" },
  SMOKING_ALLOWED: { icon: CheckCircle, label: "Smoking Allowed" },
  MOUNTAIN_VIEW: { icon: ExternalLink, label: "Mountain View" },
  GARDEN: { icon: ImageIcon, label: "Garden" },
  BBQ: { icon: ChefHat, label: "BBQ" },
};

interface AmenityIconProps {
  amenity: Amenities | string;
}

export function AmenityIcon({ amenity }: AmenityIconProps) {
  const key = String(amenity) as Amenities;
  const entry = AMENITY_MAP[key];
  const Icon = entry?.icon ?? CheckCircle;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className={`h-5 w-5 text-green-600 flex-shrink-0`} aria-hidden />
      <span>{entry?.label ?? key}</span>
    </div>
  );
}
