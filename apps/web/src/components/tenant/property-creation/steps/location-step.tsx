"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { usePropertyCreation } from "../property-creation-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, RefreshCw } from "lucide-react";

const LocationPicker = dynamic(
  () =>
    import("@/components/ui/location-picker").then((mod) => ({
      default: mod.LocationPicker,
    })),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

function MapSkeleton() {
  return (
    <div className="flex h-80 w-full flex-col justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
      <div className="mx-auto h-6 w-24 animate-pulse rounded-full bg-muted" />
      <p className="mx-auto max-w-xs animate-pulse text-xs text-muted-foreground/80">
        Loading map experience…
      </p>
    </div>
  );
}

export function LocationStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);

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

  const addressCharCount = formData.address
    ? String(formData.address).length
    : 0;

  return (
    <Card className="border-border/60 bg-background/95 shadow-lg backdrop-blur-sm">
      <CardHeader className="border-b border-border/60 pb-6">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Location Details
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Help guests find your property faster by giving clear address
            details. You can fine-tune the map placement or fill the fields
            manually.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-10 py-6">
        <section className="space-y-4">
          {apiKey ? (
            <Collapsible
              open={isMapOpen}
              onOpenChange={setIsMapOpen}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Interactive Map (optional)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use the map to drop an exact pin for your listing.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setMapRefreshKey((prev) => prev + 1)}
                    disabled={!isMapOpen}
                    className="gap-2"
                    aria-label="Reload map"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reload
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180"
                    >
                      {isMapOpen ? "Hide map" : "Show map"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              <CollapsibleContent className="space-y-4">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2 sm:p-3">
                  <LocationPicker
                    key={mapRefreshKey}
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
                    className="space-y-4"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: click on the map marker to fine-tune the location or drag
                  it to reposition.
                </p>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Interactive Map
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Provide an API key to enable the in-app map experience.
                  </p>
                </div>
                <Badge variant="outline" className="border-dashed">
                  Map unavailable
                </Badge>
              </div>
              <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                Add a Google Maps API key in your environment variables to
                enable interactive map selection. Until then, fill in the
                address manually.
              </p>
            </div>
          )}
        </section>

        <Separator className="bg-border/60" />

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="country" className="text-sm font-medium">
                Country *
              </Label>
              <Badge variant="outline" className="text-xs uppercase">
                Required
              </Badge>
            </div>
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) => handleChange("country", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, country: true }))}
              placeholder="e.g., Indonesia"
              className="placeholder:text-muted-foreground"
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
            <div className="flex items-center justify-between">
              <Label htmlFor="city" className="text-sm font-medium">
                City *
              </Label>
              <Badge variant="outline" className="text-xs uppercase">
                Required
              </Badge>
            </div>
            <Input
              id="city"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, city: true }))}
              placeholder="e.g., Jakarta"
            />
            <p className="text-xs text-muted-foreground">
              City, town, or district.
            </p>
            {touched.city && !formData.city ? (
              <p className="text-xs text-destructive">Please provide a city.</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="address" className="text-sm font-medium">
              Full Address *
            </Label>
            <span className="text-xs text-muted-foreground">
              {addressCharCount} characters
            </span>
          </div>
          <Textarea
            id="address"
            value={formData.address || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChange("address", e.target.value)
            }
            placeholder="Enter the complete address of your property"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Include street, number, building, and nearby landmarks to help
            guests locate you effortlessly.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
