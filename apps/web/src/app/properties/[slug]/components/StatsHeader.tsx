"use client";

import { Users, Bed, Bath, Star } from "lucide-react";

export function StatsHeader({
  city,
  province,
  address,
  description,
  rating,
  reviewCount,
  maxGuests,
  bedrooms,
  bathrooms,
}: {
  city: string;
  province?: string | null;
  address?: string | null;
  description?: string | null;
  rating: number;
  reviewCount: number;
  maxGuests?: number | null;
  bedrooms: number;
  bathrooms: number;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="text-3xl font-serif mb-2">{province || city}</h2>
          <p className="text-lg text-muted-foreground mb-4">
            {address}, {city}
          </p>

          <div className="mt-2 rounded-lg border px-4 py-3 text-sm text-muted-foreground inline-block">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">{maxGuests} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                <span className="font-medium">{bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4" />
                <span className="font-medium">{bathrooms} Bathrooms</span>
              </div>
            </div>
          </div>

          {description ? (
            <p className="mt-6 text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="flex-shrink-0">
          <div className="rounded-full border px-4 py-2 inline-flex items-center gap-3">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{Math.round(rating)}</span>
            <span className="text-sm text-muted-foreground">
              {reviewCount} reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
