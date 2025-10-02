"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker } from "@/components/ui/location-picker";
import { MapPin } from "lucide-react";
import React from "react";

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
      <CardHeader className="pb-4">
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
        {apiKey && (
          <div className="space-y-4">
            <div>
              <LocationPicker
                onLocationSelect={onLocationSelect}
                apiKey={apiKey}
                initialLocation={
                  values.latitude && values.longitude
                    ? {
                        lat: parseFloat(values.latitude),
                        lng: parseFloat(values.longitude),
                      }
                    : undefined
                }
                className="border rounded-lg p-4"
                onFieldsChange={(fields) => {
                  onChange({
                    target: { name: "address", value: fields.address ?? "" },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                  onChange({
                    target: { name: "city", value: fields.city ?? "" },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                  onChange({
                    target: { name: "country", value: fields.country ?? "" },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={values.country}
              onChange={onChange}
              placeholder="Enter country"
              maxLength={60}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={values.city}
              onChange={onChange}
              placeholder="Enter city"
              maxLength={100}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={values.address}
            onChange={onChange}
            placeholder="Enter full address"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
