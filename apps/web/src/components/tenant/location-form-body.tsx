"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationPicker } from "@/components/ui/location-picker";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";

type Values = {
  country: string;
  city: string;
  address: string;
  latitude: string;
  longitude: string;
};

type Props = {
  apiKey?: string;
  values: Values;
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
  touched?: { [k: string]: boolean };
  setTouched?: (t: { [k: string]: boolean }) => void;
};

export function LocationFormBody({
  apiKey,
  values,
  onChange,
  onLocationSelect,
  touched,
  setTouched,
}: Props) {
  return (
    <>
      <div className="space-y-4">
        <div className="rounded-xl border border-border/60 bg-muted/20 p-2 sm:p-3">
          <GoogleMapsProvider apiKey={apiKey ?? ""}>
            <LocationPicker
              onLocationSelect={onLocationSelect}
              initialLocation={
                values.latitude && values.longitude
                  ? {
                      lat: parseFloat(values.latitude),
                      lng: parseFloat(values.longitude),
                    }
                  : undefined
              }
              className="space-y-4"
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
          </GoogleMapsProvider>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="country" className="text-sm font-medium">
              Country *
            </Label>
          </div>
          <Input
            id="country"
            name="country"
            value={values.country}
            onChange={onChange}
            onBlur={() => setTouched?.({ ...(touched || {}), country: true })}
            placeholder="e.g., Indonesia"
            className="placeholder:text-muted-foreground text-sm"
          />
          {touched?.country && !values.country ? (
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
          </div>
          <Input
            id="city"
            name="city"
            value={values.city}
            onChange={onChange}
            onBlur={() => setTouched?.({ ...(touched || {}), city: true })}
            placeholder="e.g., Jakarta"
            className="text-sm"
          />
          {touched?.city && !values.city ? (
            <p className="text-xs text-destructive">Please provide a city.</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="address" className="text-sm font-medium">
            Full Address
          </Label>
        </div>
        <Textarea
          id="address"
          name="address"
          value={values.address}
          onChange={onChange}
          placeholder="Enter the complete address of your property"
          rows={4}
          className="text-sm"
        />
      </section>
    </>
  );
}
