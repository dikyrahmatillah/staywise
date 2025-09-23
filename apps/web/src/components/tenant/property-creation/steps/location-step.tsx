"use client";

import React, { useState } from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker } from "@/components/ui/location-picker";
import { MapPin } from "lucide-react";

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

  const hasLocation = !!(formData.latitude && formData.longitude);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKey ? (
          <div className="space-y-4">
            <div className="rounded-lg border p-2">
              {apiKey && (
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
                  className="h-112 rounded-md overflow-hidden"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: click on the map marker to fine-tune the location.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border bg-muted/5 p-4">
            <p className="text-sm text-muted-foreground">
              Map is unavailable — set the coordinates manually or provide the
              full address. To enable the map, set
              `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) => handleChange("country", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, country: true }))}
              placeholder="e.g., Indonesia"
              className="placeholder:text-slate-400"
            />
            <p className="text-xs text-muted-foreground">
              Country or region where the property is located.
            </p>
            {touched.country && !formData.country ? (
              <p className="text-xs text-destructive">
                Please provide a country.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, city: true }))}
              placeholder="e.g., Jakarta"
            />
            <p className="text-xs text-muted-foreground">
              City, town or district.
            </p>
            {touched.city && !formData.city ? (
              <p className="text-xs text-destructive">Please provide a city.</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="address">Full Address *</Label>
          </div>
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>
              {formData.address
                ? `${String(formData.address).length} characters`
                : "0 characters"}
            </span>
          </div>
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
          <p className="text-xs text-muted-foreground">
            Include street name, number, and any landmarks to help guests find
            you.
          </p>
        </div>

        {hasLocation || formData.address ? (
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1">
                {formData.address ? (
                  <p className="font-medium text-sm">{formData.address}</p>
                ) : null}

                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
                  {(formData.city || formData.country) && (
                    <span>
                      {[formData.city, formData.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  )}
                  {hasLocation && (
                    <span className="font-mono text-[12px]">
                      Lat {formData.latitude} · Lng {formData.longitude}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const ok = window.confirm(
                      "Clear all location data? This will remove address, city, country and coordinates."
                    );
                    if (!ok) return;
                    updateFormData({
                      latitude: undefined,
                      longitude: undefined,
                      address: undefined,
                      city: undefined,
                      country: undefined,
                    });
                  }}
                  className="text-sm text-destructive hover:underline cursor-pointer"
                  aria-label="Remove location and address"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
