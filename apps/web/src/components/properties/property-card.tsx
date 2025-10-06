"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Building2, Star } from "lucide-react";
import usePropertyDetails from "@/hooks/usePropertyDetails";
import { getGuestRange } from "@/components/tenant/property-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types/property";
import { formatCurrency } from "@/lib/booking-formatters";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { data } = usePropertyDetails(property.slug);

  const totalRooms = property.Rooms?.length || 1;
  type PropLike = { Rooms?: unknown[]; maxGuests?: number };
  const guestRange = getGuestRange(property as PropLike);
  const minGuests = guestRange.min;
  const maxGuests = guestRange.max;
  const averageRating = data?.averageRating || 0.0;
  const priceFrom = property.priceFrom;

  return (
    <Link href={`/properties/${property.slug}`} className="block" passHref>
      <Card
        key={property.id}
        className="overflow-hidden hover:shadow-lg transition-shadow py-0"
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={property.Pictures[0]?.imageUrl}
            alt={property.name}
            fill
            className="object-cover"
          />
          {property.PropertyCategory && (
            <Badge className="absolute top-3 left-3">
              {property.PropertyCategory.name}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-xl truncate min-w-0">
              {property.name}
            </CardTitle>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <MapPin className="h-4 w-4" />
              <span>{property.city}</span>
            </div>
          </CardHeader>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {minGuests === maxGuests
                  ? `${minGuests} Guest${minGuests !== 1 ? "s" : ""}`
                  : `${minGuests}-${maxGuests} Guests`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>{`${totalRooms} Rooms`}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {property.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold">
                {formatCurrency(priceFrom || 0)}
              </span>
              <span className="text-muted-foreground text-sm">/night</span>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {typeof averageRating === "number"
                    ? averageRating.toFixed(1)
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
