"use client";

import React from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker } from "@/components/ui/location-picker";

export function LocationStep() {
  const { formData, updateFormData } = usePropertyCreation();

  const handleChange = (field: string, value: string | number) => {
    updateFormData({ [field]: value });
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  }) => {
    updateFormData({
      latitude: location.lat,
      longitude: location.lng,
      address: location.address,
      city: location.city,
      country: location.country,
    });
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKey && (
          <div className="space-y-4">
            <div>
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                apiKey={apiKey}
                initialLocation={
                  formData.latitude && formData.longitude
                    ? {
                        lat: formData.latitude,
                        lng: formData.longitude,
                      }
                    : undefined
                }
                className="border rounded-lg p-4"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="e.g., Indonesia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="e.g., Jakarta"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Full Address *</Label>
          <textarea
            id="address"
            value={formData.address || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChange("address", e.target.value)
            }
            placeholder="Enter the complete address of your property"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </CardContent>
    </Card>
  );
}
