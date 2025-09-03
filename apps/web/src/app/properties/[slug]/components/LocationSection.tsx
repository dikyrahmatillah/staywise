"use client";

import { MapPin } from "lucide-react";

export function LocationSection({
  address,
  city,
}: {
  address?: string | null;
  city: string;
}) {
  return (
    <section id="location">
      <h3 className="text-xl font-semibold mb-4">Location & Things to Do</h3>
      <div className="space-y-4 mb-6">
        <p className="text-muted-foreground">
          Located in the heart of {city}, this property offers easy access to
          local attractions, dining, and entertainment.
        </p>
        <div className="space-y-2">
          <h4 className="font-medium">Nearby Landmarks</h4>
        </div>
      </div>
      <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Interactive Map</p>
          <p className="text-sm text-muted-foreground">
            {address}, {city}
          </p>
        </div>
      </div>
    </section>
  );
}
