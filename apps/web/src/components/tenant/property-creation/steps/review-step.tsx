"use client";

import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
  const { formData, setCurrentStep } = usePropertyCreation();

  function formatPriceForDisplay(value: number | undefined | null) {
    if (value === undefined || value === null || Number.isNaN(value))
      return "0";
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  const defaultName = formData.propertyCategoryName ?? null;
  const customName = formData.customCategoryName ?? null;

  const getMaxGuestsFromRooms = (): number => {
    type RoomLike = { capacity?: number };
    const capacities = (formData.rooms || []).map((room: RoomLike) =>
      typeof room.capacity === "number" ? room.capacity : 1
    );
    if (capacities.length === 0) return 1;
    return Math.max(...capacities, 1);
  };

  const completionChecks = [
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

  const allCompleted = completionChecks.every((check) => check.completed);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">Basic Information</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setCurrentStep(1)}
              >
                Edit
              </Button>
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
                {getMaxGuestsFromRooms()}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">Location</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setCurrentStep(2)}
              >
                Edit
              </Button>
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

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">Category</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setCurrentStep(3)}
              >
                Edit
              </Button>
            </div>
            <div className="ml-7">
              {formData.propertyCategoryId && (
                <p>
                  Default category selected
                  {defaultName ? `: ${defaultName}` : ""}
                </p>
              )}
              {formData.customCategoryId && (
                <p>
                  Custom category selected{customName ? `: ${customName}` : ""}
                </p>
              )}
              {!formData.propertyCategoryId && !formData.customCategoryId && (
                <p className="text-gray-500">Not selected</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-gray-500" />
              <Label className="text-base font-medium">
                Rooms ({formData.rooms?.length || 0})
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setCurrentStep(4)}
              >
                Edit
              </Button>
            </div>
            <div className="ml-7 space-y-3">
              {formData.rooms && formData.rooms.length > 0 ? (
                formData.rooms.map(
                  (
                    room: {
                      name: string;
                      basePrice: number;
                      capacity?: number;
                      bedCount?: number;
                      bedType?: string;
                      description?: string;
                    },
                    index: number
                  ) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{room.name}</p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            Rp {formatPriceForDisplay(room.basePrice)}/night
                          </span>
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
                  )
                )
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setCurrentStep(5)}
              >
                Edit
              </Button>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setCurrentStep(6)}
              >
                Edit
              </Button>
            </div>
            <div className="ml-7">
              {formData.pictures && formData.pictures.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.pictures.slice(0, 8).map(
                    (
                      picture: {
                        file?: File;
                        imageUrl?: string;
                        note?: string;
                        description?: string;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="aspect-video rounded border overflow-hidden bg-gray-100"
                      >
                        {picture.file ? (
                          <Image
                            src={URL.createObjectURL(picture.file)}
                            alt={
                              picture.note ||
                              picture.description ||
                              `Photo ${index + 1}`
                            }
                            width={200}
                            height={112}
                            className="w-full h-full object-cover"
                          />
                        ) : picture.imageUrl ? (
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
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              <ImageIcon className="w-6 h-6 mx-auto" />
                              <p className="text-xs mt-1">No preview</p>
                            </div>
                          </div>
                        )}
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
