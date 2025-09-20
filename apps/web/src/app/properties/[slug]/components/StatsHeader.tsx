"use client";

import { Users, Bed, Star, MapPin, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function StatsHeader({
  city,
  address,
  description,
  rating,
  reviewCount,
  maxGuests,
  bedrooms,
  totalBeds,
  bedTypeSummary,
}: {
  city: string;
  address?: string | null;
  description?: string | null;
  rating: number;
  reviewCount: number;
  maxGuests?: number | null;
  bedrooms: number;
  totalBeds?: number;
  bedTypeSummary?: string;
}) {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            <p className="text-sm">
              {address}, {city}
            </p>
          </div>
          <h2 className="text-3xl font-serif mb-2">{city}</h2>
        </div>

        <div className="flex-shrink-0">
          <div className="rounded-full bg-white shadow-sm border border-slate-100 px-4 py-2 inline-flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium">
              {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <div className="bg-white p-2 rounded-full">
            <Users className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Guests</p>
            <p className="font-medium">
              {(() => {
                const minGuests = 1;
                const max = maxGuests ?? 1;
                return minGuests === max
                  ? `${max} Guest${max !== 1 ? "s" : ""}`
                  : `${minGuests}-${max} Guests`;
              })()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <div className="bg-white p-2 rounded-full">
            <Home className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Room</p>
            <p className="font-medium">
              {bedrooms} Room{bedrooms !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <div className="bg-white p-2 rounded-full">
            <Bed className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Beds</p>
            <div>
              <p className="font-medium">
                {totalBeds || 0} Bed{totalBeds !== 1 ? "s" : ""}
              </p>
              {bedTypeSummary && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {bedTypeSummary}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {description ? (
        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
          <h3 className="text-lg font-medium mb-3">About this place</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      ) : null}
    </div>
  );
}
