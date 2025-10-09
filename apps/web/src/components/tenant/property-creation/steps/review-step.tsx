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
import { FileText } from "lucide-react";

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

const getCompletionChecks = (formData: FormData): CompletionCheck[] => {
  const defaultName = formData.propertyCategoryName ?? null;

  return [
    // New order: Basic Info, Photos, Location, Category, Rooms, Facilities
    {
      label: "Basic Information",
      completed: !!(formData.name && formData.description),
      details: `Name: ${formData.name || "Not set"}, Description: ${
        formData.description ? "Added" : "Not set"
      }`,
    },
    {
      label: "Photos",
      completed: !!(formData.pictures && formData.pictures.length > 0),
      details: `${formData.pictures?.length || 0} photo(s) added`,
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
      completed: !!formData.propertyCategoryId,
      details: formData.propertyCategoryId
        ? `Default category selected${
            defaultName ? `: ${formData.propertyCategoryName}` : ""
          }`
        : "Default category not selected",
    },
    {
      label: "Rooms",
      completed: !!(formData.rooms && formData.rooms.length > 0),
      details: `${formData.rooms?.length || 0} room(s) added`,
    },
    {
      label: "Facilities",
      completed: !!(formData.facilities && formData.facilities.length > 0),
      details: `${formData.facilities?.length || 0} facility(ies) added`,
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

  return (
    <div className="space-y-6">
      <CompletionStatus allCompleted={allCompleted} />

      <Card>
        <CardHeader className="mb-6">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-gray-500" />
            Property Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BasicInfoSection
            name={formData.name}
            description={formData.description}
            onEdit={() => setCurrentStep(1)}
          />

          <Separator />

          <PhotosSection
            pictures={formData.pictures}
            onEdit={() => setCurrentStep(2)}
          />

          <Separator />

          <LocationSection
            country={formData.country}
            city={formData.city}
            address={formData.address}
            latitude={formData.latitude}
            longitude={formData.longitude}
            onEdit={() => setCurrentStep(3)}
          />

          <Separator />

          <CategorySection
            propertyCategoryId={formData.propertyCategoryId}
            propertyCategoryName={formData.propertyCategoryName}
            customCategoryId={formData.customCategoryId}
            customCategoryName={formData.customCategoryName}
            onEdit={() => setCurrentStep(4)}
          />

          <Separator />

          <RoomsSection
            rooms={formData.rooms}
            onEdit={() => setCurrentStep(5)}
          />

          <Separator />

          <FacilitiesSection
            facilities={formData.facilities}
            onEdit={() => setCurrentStep(6)}
          />

          <Separator />

          <PhotosSection
            pictures={formData.pictures}
            onEdit={() => setCurrentStep(2)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
