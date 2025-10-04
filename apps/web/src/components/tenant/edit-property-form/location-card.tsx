"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import React from "react";
import { LocationFormBody } from "@/components/tenant/location-form-body";

type Props = {
  apiKey?: string;
  values: {
    country: string;
    city: string;
    address: string;
    latitude: string;
    longitude: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onLocationSelect: (loc: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  }) => void;
};

export function LocationCard({
  apiKey,
  values,
  onChange,
  onLocationSelect,
}: Props) {
  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Location & Address
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Specify the exact location of your property for guests to find it
          easily
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <LocationFormBody
          apiKey={apiKey}
          values={values}
          onChange={onChange}
          onLocationSelect={onLocationSelect}
        />
      </CardContent>
    </Card>
  );
}
