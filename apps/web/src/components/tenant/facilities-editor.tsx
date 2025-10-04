"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { CreateFacilityInput } from "@repo/schemas";
import {
  Wifi,
  Wind,
  Car,
  Waves,
  ChefHat,
  Tv,
  ShowerHead,
  WashingMachine,
  Refrigerator,
  Microwave,
  Building,
  Dumbbell,
  Clock,
  Shield,
  Camera,
  Heart,
  Cigarette,
  CigaretteOff,
  Accessibility,
  Coffee,
  Mountain,
  Eye,
  Trees,
  Flame,
} from "lucide-react";

export const FACILITY_ICONS: Record<string, React.ReactElement> = {
  WIFI: <Wifi className="w-4 h-4" />,
  AIR_CONDITIONER: <Wind className="w-4 h-4" />,
  PARKING: <Car className="w-4 h-4" />,
  SWIMMING_POOL: <Waves className="w-4 h-4" />,
  KITCHEN: <ChefHat className="w-4 h-4" />,
  TV: <Tv className="w-4 h-4" />,
  WATER_HEATER: <ShowerHead className="w-4 h-4" />,
  WASHING_MACHINE: <WashingMachine className="w-4 h-4" />,
  REFRIGERATOR: <Refrigerator className="w-4 h-4" />,
  MICROWAVE: <Microwave className="w-4 h-4" />,
  ELEVATOR: <Building className="w-4 h-4" />,
  GYM: <Dumbbell className="w-4 h-4" />,
  RECEPTION_24H: <Clock className="w-4 h-4" />,
  SECURITY: <Shield className="w-4 h-4" />,
  CCTV: <Camera className="w-4 h-4" />,
  PET_FRIENDLY: <Heart className="w-4 h-4" />,
  SMOKING_ALLOWED: <Cigarette className="w-4 h-4" />,
  NON_SMOKING: <CigaretteOff className="w-4 h-4" />,
  WHEELCHAIR_ACCESS: <Accessibility className="w-4 h-4" />,
  BREAKFAST: <Coffee className="w-4 h-4" />,
  BALCONY: <Building className="w-4 h-4" />,
  SEA_VIEW: <Eye className="w-4 h-4" />,
  MOUNTAIN_VIEW: <Mountain className="w-4 h-4" />,
  GARDEN: <Trees className="w-4 h-4" />,
  BBQ: <Flame className="w-4 h-4" />,
};

export const FACILITY_LABELS: Record<string, string> = {
  WIFI: "WiFi",
  AIR_CONDITIONER: "Air Conditioner",
  PARKING: "Parking",
  SWIMMING_POOL: "Swimming Pool",
  KITCHEN: "Kitchen",
  TV: "TV",
  WATER_HEATER: "Water Heater",
  WASHING_MACHINE: "Washing Machine",
  REFRIGERATOR: "Refrigerator",
  MICROWAVE: "Microwave",
  ELEVATOR: "Elevator",
  GYM: "Gym",
  RECEPTION_24H: "24h Reception",
  SECURITY: "Security",
  CCTV: "CCTV",
  PET_FRIENDLY: "Pet Friendly",
  SMOKING_ALLOWED: "Smoking Allowed",
  NON_SMOKING: "Non Smoking",
  WHEELCHAIR_ACCESS: "Wheelchair Access",
  BREAKFAST: "Breakfast",
  BALCONY: "Balcony",
  SEA_VIEW: "Sea View",
  MOUNTAIN_VIEW: "Mountain View",
  GARDEN: "Garden",
  BBQ: "BBQ",
};

export const FACILITY_CATEGORIES: Record<string, string[]> = {
  "Basic Amenities": [
    "WIFI",
    "AIR_CONDITIONER",
    "PARKING",
    "KITCHEN",
    "TV",
    "WATER_HEATER",
  ],
  Appliances: ["WASHING_MACHINE", "REFRIGERATOR", "MICROWAVE"],
  Recreation: ["SWIMMING_POOL", "GYM", "BBQ", "GARDEN"],
  Services: ["RECEPTION_24H", "SECURITY", "CCTV", "BREAKFAST"],
  Accessibility: ["ELEVATOR", "WHEELCHAIR_ACCESS"],
  Policies: ["PET_FRIENDLY", "SMOKING_ALLOWED", "NON_SMOKING"],
  "Views & Spaces": ["SEA_VIEW", "MOUNTAIN_VIEW", "BALCONY"],
};

type FacilityItem = CreateFacilityInput;

type Props = {
  selected: FacilityItem[];
  onToggle: (facility: string) => void;
  query: string;
  setQuery: (q: string) => void;
};

export function FacilitiesEditor({
  selected,
  onToggle,
  query,
  setQuery,
}: Props) {
  const facilities = selected || [];
  const selectedFacilities = facilities.map((f) => f.facility);

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return FACILITY_CATEGORIES;
    const q = query.toLowerCase();
    const result: Record<string, string[]> = {};
    Object.entries(FACILITY_CATEGORIES).forEach(([category, items]) => {
      const matches = items.filter((key) =>
        FACILITY_LABELS[key].toLowerCase().includes(q)
      );
      if (matches.length) result[category] = matches;
    });
    return result;
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search facilities (e.g., WiFi, Gym, Balcony)"
            className="focus:ring-2 focus-visible:border-primary/50 focus-visible:ring-primary/10 transition-all duration-200"
          />
        </div>
      </div>

      {Object.entries(filteredCategories).map(
        ([category, categoryFacilities]) => (
          <div key={category} className="space-y-3">
            <Label className="text-base font-medium">{category}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryFacilities.map((facility) => {
                const isSelected = selectedFacilities.includes(facility);
                return (
                  <div key={facility} className="space-y-2">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                      onClick={() => onToggle(facility)}
                    >
                      {FACILITY_ICONS[facility]}
                      <span className="flex-1">
                        {FACILITY_LABELS[facility]}
                      </span>
                      {isSelected && (
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default FacilitiesEditor;
