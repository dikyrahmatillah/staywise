"use client";

import React, { useState } from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { LocationFormBody } from "@/components/tenant/location-form-body";

export function LocationStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

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
    <Card className="border-border/60 bg-background/95 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Location Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Specify the exact location of your property for guests to find it
          easily.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 py-6">
        <LocationFormBody
          apiKey={apiKey}
          values={{
            country: formData.country || "",
            city: formData.city || "",
            address: formData.address || "",
            latitude: String(formData.latitude || ""),
            longitude: String(formData.longitude || ""),
          }}
          onChange={(e) => {
            const name = (e.target as HTMLInputElement).name;
            const value = (e.target as HTMLInputElement).value;
            handleChange(name, value);
          }}
          onLocationSelect={handleLocationSelect}
          touched={touched}
          setTouched={setTouched}
        />
      </CardContent>
    </Card>
  );
}
