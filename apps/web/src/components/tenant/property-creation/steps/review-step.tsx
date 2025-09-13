"use client";

import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreateRoomInput, CreatePropertyPictureInput } from "@repo/schemas";
import { CreateFacilityInput } from "@repo/schemas/src/facility.schema.js";
import Image from "next/image";
import {
  MapPin,
  Building2,
  Users,
  Bed,
  DollarSign,
  Image as ImageIcon,
  Wind,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function ReviewStep() {
  const { formData } = usePropertyCreation();

  const completionChecks = [
    {
      label: "Basic Information",
      completed: !!(
        formData.name &&
        formData.description &&
        formData.maxGuests
      ),
      details: `Name: ${formData.name || "Not set"}, Description: ${
        formData.description ? "Added" : "Not set"
      }, Max Guests: ${formData.maxGuests || "Not set"}`,
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
      completed: !!(
        formData.propertyCategoryId ||
        formData.customCategoryId ||
        formData.customCategory
      ),
      details: formData.propertyCategoryId
        ? "Default category selected"
        : formData.customCategoryId
        ? "Custom category selected"
        : formData.customCategory
        ? `New category: ${formData.customCategory.name}`
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

  const allCompleted = completionChecks.every((check) => check.completed);

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completionChecks.map((check, index) => (
              <div key={index} className="flex items-start gap-3">
                {check.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{check.label}</span>
                    <Badge variant={check.completed ? "default" : "secondary"}>
                      {check.completed ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{check.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Property Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">Basic Information</Label>
            </div>
            <div className="ml-7 space-y-2">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {formData.name || "Not set"}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {formData.description || "Not set"}
              </p>
              <p>
                <span className="font-medium">Maximum Guests:</span>{" "}
                {formData.maxGuests || "Not set"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">Location</Label>
            </div>
            <div className="ml-7 space-y-2">
              <p>
                <span className="font-medium">Country:</span>{" "}
                {formData.country || "Not set"}
              </p>
              <p>
                <span className="font-medium">City:</span>{" "}
                {formData.city || "Not set"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {formData.address || "Not set"}
              </p>
              {formData.latitude && formData.longitude && (
                <p>
                  <span className="font-medium">Coordinates:</span>{" "}
                  {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Category */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">Category</Label>
            </div>
            <div className="ml-7">
              {formData.propertyCategoryId && <p>Default category selected</p>}
              {formData.customCategoryId && <p>Custom category selected</p>}
              {formData.customCategory && (
                <div>
                  <p>
                    <span className="font-medium">New Category:</span>{" "}
                    {formData.customCategory.name}
                  </p>
                  {formData.customCategory.description && (
                    <p>
                      <span className="font-medium">Description:</span>{" "}
                      {formData.customCategory.description}
                    </p>
                  )}
                </div>
              )}
              {!formData.propertyCategoryId &&
                !formData.customCategoryId &&
                !formData.customCategory && (
                  <p className="text-gray-500">Not selected</p>
                )}
            </div>
          </div>

          <Separator />

          {/* Rooms */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">
                Rooms ({formData.rooms?.length || 0})
              </Label>
            </div>
            <div className="ml-7 space-y-3">
              {formData.rooms && formData.rooms.length > 0 ? (
                formData.rooms.map((room: CreateRoomInput, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{room.name}</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>${room.basePrice}/night</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {room.capacity} guests
                        </span>
                        <span>
                          {room.bedCount} {room.bedType?.toLowerCase()} bed(s)
                        </span>
                      </div>
                      {room.description && (
                        <p className="mt-1">{room.description}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No rooms added</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Facilities */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">
                Facilities ({formData.facilities?.length || 0})
              </Label>
            </div>
            <div className="ml-7">
              {formData.facilities && formData.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.facilities.map(
                    (facility: CreateFacilityInput, index: number) => (
                      <Badge key={index} variant="secondary">
                        {facility.facility
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Badge>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No facilities selected</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Photos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">
                Photos ({formData.pictures?.length || 0})
              </Label>
            </div>
            <div className="ml-7">
              {formData.pictures && formData.pictures.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.pictures
                    .slice(0, 8)
                    .map(
                      (picture: CreatePropertyPictureInput, index: number) => (
                        <div
                          key={index}
                          className="aspect-video rounded border overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={picture.imageUrl}
                            alt={picture.note || `Photo ${index + 1}`}
                            width={200}
                            height={112}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.parentElement!.classList.add(
                                "flex",
                                "items-center",
                                "justify-center"
                              );
                              target.parentElement!.innerHTML = `
                            <div class="text-center text-gray-500">
                              <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                            </div>
                          `;
                            }}
                          />
                        </div>
                      )
                    )}
                  {formData.pictures.length > 8 && (
                    <div className="aspect-video rounded border bg-gray-100 flex items-center justify-center">
                      <span className="text-sm text-gray-500">
                        +{formData.pictures.length - 8} more
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No photos added</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {!allCompleted && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Almost Ready!</p>
                <p className="text-orange-800 text-sm mt-1">
                  Please complete all sections before creating your property.
                  You can go back to previous steps using the navigation above.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
