"use client";

import { useState } from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LocationStep() {
  const { formData, updateFormData } = usePropertyCreation();

  const handleChange = (field: string, value: string | number) => {
    updateFormData({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude (Optional)</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              min={-90}
              max={90}
              value={formData.latitude || ""}
              onChange={(e) =>
                handleChange("latitude", parseFloat(e.target.value) || 0)
              }
              placeholder="e.g., -6.2088"
            />
            <p className="text-sm text-gray-500">Between -90 and 90</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude (Optional)</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              min={-180}
              max={180}
              value={formData.longitude || ""}
              onChange={(e) =>
                handleChange("longitude", parseFloat(e.target.value) || 0)
              }
              placeholder="e.g., 106.8456"
            />
            <p className="text-sm text-gray-500">Between -180 and 180</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
