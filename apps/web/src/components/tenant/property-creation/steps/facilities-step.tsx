"use client";

import { useState } from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { CreateFacilityInput, AmenityType } from "@repo/schemas";

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

const FACILITY_ICONS: Record<string, React.ReactElement> = {
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

const FACILITY_LABELS: Record<string, string> = {
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

const FACILITY_CATEGORIES = {
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

export function FacilitiesStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const [facilityNotes, setFacilityNotes] = useState<Record<string, string>>(
    {}
  );

  const facilities = formData.facilities || [];
  const selectedFacilities = facilities.map(
    (f: CreateFacilityInput) => f.facility
  );

  const handleFacilityToggle = (facility: string) => {
    const isSelected = selectedFacilities.includes(facility);

    if (isSelected) {
      const updatedFacilities = facilities.filter(
        (f: CreateFacilityInput) => f.facility !== facility
      );
      updateFormData({ facilities: updatedFacilities });

      const updatedNotes = { ...facilityNotes };
      delete updatedNotes[facility];
      setFacilityNotes(updatedNotes);
    } else {
      const newFacility: CreateFacilityInput = {
        facility: facility as AmenityType,
        note: facilityNotes[facility] || null,
      };
      updateFormData({ facilities: [...facilities, newFacility] });
    }
  };

  const handleNoteChange = (facility: string, note: string) => {
    setFacilityNotes((prev) => ({ ...prev, [facility]: note }));

    if (selectedFacilities.includes(facility)) {
      const updatedFacilities = facilities.map((f: CreateFacilityInput) =>
        f.facility === facility ? { ...f, note: note || null } : f
      );
      updateFormData({ facilities: updatedFacilities });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facilities & Amenities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(FACILITY_CATEGORIES).map(
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
                        onClick={() => handleFacilityToggle(facility)}
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

                      {isSelected && (
                        <Input
                          placeholder={`Optional note for ${FACILITY_LABELS[facility]}...`}
                          value={facilityNotes[facility] || ""}
                          onChange={(e) =>
                            handleNoteChange(facility, e.target.value)
                          }
                          className="text-sm"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}

        {facilities.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <Label className="text-base font-medium">
              Selected Facilities ({facilities.length})
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {facilities.map(
                (facility: CreateFacilityInput, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {FACILITY_ICONS[facility.facility]}
                    {FACILITY_LABELS[facility.facility]}
                  </Badge>
                )
              )}
            </div>
          </div>
        )}

        {facilities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Wind className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No facilities selected yet. Choose from the options above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
