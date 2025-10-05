"use client";

import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CompletionStatus,
  BasicInfoSection,
  LocationSection,
  CategorySection,
  RoomsSection,
  FacilitiesSection,
  PhotosSection,
} from "./review-step/index";

interface FormData {
  name?: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  propertyCategoryId?: string;
  propertyCategoryName?: string;
  customCategoryId?: string;
  customCategoryName?: string;
  rooms?: Array<{ capacity?: number }>;
  pictures?: unknown[];
  facilities?: unknown[];
}

interface CompletionCheck {
  label: string;
  completed: boolean;
  details: string;
}

const getMaxGuestsFromRooms = (
  rooms?: Array<{ capacity?: number }>
): number => {
  if (!rooms || rooms.length === 0) return 1;
  const capacities = rooms.map((room) =>
    typeof room.capacity === "number" ? room.capacity : 1
  );
  return Math.max(...capacities, 1);
};

const getCompletionChecks = (formData: FormData): CompletionCheck[] => {
  const defaultName = formData.propertyCategoryName ?? null;
  const customName = formData.customCategoryName ?? null;

  return [
    {
      label: "Basic Information",
      completed: !!(formData.name && formData.description),
      details: `Name: ${formData.name || "Not set"}, Description: ${
        formData.description ? "Added" : "Not set"
      }`,
    },
    {
      label: "Location",
      completed: !!(formData.country && formData.city && formData.address),
      details: `${formData.address || "Address not set"}, ${
        formData.city || "City not set"
      }, ${formData.country || "Country not set"}`,
    },
    {
      label: "Category",
      completed: !!(formData.propertyCategoryId || formData.customCategoryId),
      details: formData.propertyCategoryId
        ? `Default category selected${
            defaultName ? `: ${formData.propertyCategoryName}` : ""
          }`
        : formData.customCategoryId
        ? `Custom category selected${
            customName ? `: ${formData.customCategoryName}` : ""
          }`
        : "Not selected",
    },
    {
      label: "Rooms",
      completed: !!(formData.rooms && formData.rooms.length > 0),
      details: `${formData.rooms?.length || 0} room(s) added`,
    },
    {
      label: "Photos",
      completed: !!(formData.pictures && formData.pictures.length > 0),
      details: `${formData.pictures?.length || 0} photo(s) added`,
    },
  ];
};

const areAllChecksCompleted = (
  completionChecks: CompletionCheck[]
): boolean => {
  return completionChecks.every((check) => check.completed);
};

export function ReviewStep() {
  const { formData, setCurrentStep } = usePropertyCreation();

  const completionChecks = getCompletionChecks(formData);
  const allCompleted = areAllChecksCompleted(completionChecks);
  const maxGuests = getMaxGuestsFromRooms(formData.rooms);

  return (
    <div className="space-y-6">
      <CompletionStatus
        completionChecks={completionChecks}
        allCompleted={allCompleted}
      />

      <Card>
        <CardHeader>
          <CardTitle>Property Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BasicInfoSection
            name={formData.name}
            description={formData.description}
            maxGuests={maxGuests}
            onEdit={() => setCurrentStep(1)}
          />

          <Separator />

          <LocationSection
            country={formData.country}
            city={formData.city}
            address={formData.address}
            latitude={formData.latitude}
            longitude={formData.longitude}
            onEdit={() => setCurrentStep(2)}
          />

          <Separator />

          <CategorySection
            propertyCategoryId={formData.propertyCategoryId}
            propertyCategoryName={formData.propertyCategoryName}
            customCategoryId={formData.customCategoryId}
            customCategoryName={formData.customCategoryName}
            onEdit={() => setCurrentStep(3)}
          />

          <Separator />

          <RoomsSection
            rooms={formData.rooms}
            onEdit={() => setCurrentStep(4)}
          />

          <Separator />

          <FacilitiesSection
            facilities={formData.facilities}
            onEdit={() => setCurrentStep(5)}
          />

          <Separator />

          <PhotosSection
            pictures={formData.pictures}
            onEdit={() => setCurrentStep(6)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
