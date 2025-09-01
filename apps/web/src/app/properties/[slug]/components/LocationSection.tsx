"use client";

import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { Landmark } from "./types";

export function LocationSection({
  address,
  city,
  landmarks,
}: {
  address?: string | null;
  city: string;
  landmarks: Landmark[];
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
          {landmarks.map((landmark, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>{landmark.name}</span>
              <Badge variant="outline">{landmark.distance}</Badge>
            </div>
          ))}
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
