"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Bed, Bath, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProperties } from "@/hooks/useProperties";
import type { GetPropertiesQuery } from "@repo/schemas";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const params = useMemo<GetPropertiesQuery>(() => {
    const sp = new URLSearchParams(searchString);
    const toInt = (v: string | null) =>
      v == null || v === "" ? undefined : Number.parseInt(v, 10);

    return {
      location: sp.get("location") ?? undefined,
      checkIn: sp.get("checkIn") ?? undefined,
      checkOut: sp.get("checkOut") ?? undefined,
      adults: toInt(sp.get("adults")),
      children: toInt(sp.get("children")),
      pets: toInt(sp.get("pets")),
    };
  }, [searchString]);

  const { data, isLoading, isError, error } = useProperties(params);
  const properties = data?.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Properties</h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing places to stay for your next adventure
          </p>
        </div>

        {isLoading && (
          <div className="text-center text-muted-foreground">
            Loading properties…
          </div>
        )}

        {isError && (
          <div className="text-center text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to load properties."}
          </div>
        )}

        {!isLoading && !isError && properties.length === 0 && (
          <div className="text-center text-muted-foreground">
            No properties found. Try adjusting your search.
          </div>
        )}

        {!isLoading && !isError && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const slug = property.name.toLowerCase().replace(/\s+/g, "-");
              const totalBedrooms = property.Rooms?.length || 1;
              const totalBathrooms = property.Rooms?.length || 1;
              const basePrice = property.Rooms?.[0]?.basePrice || 120;

              return (
                <Card
                  key={property.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={
                        property.pictureUrl ||
                        "/images/properties/placeholder.jpg"
                      }
                      alt={property.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/images/properties/placeholder.jpg";
                      }}
                    />
                    <Badge className="absolute top-3 left-3">Available</Badge>
                  </div>
                  <CardContent className="p-4">
                    <CardHeader className="p-0 mb-3">
                      <CardTitle className="text-lg">{property.name}</CardTitle>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {property.city}
                          {property.province ? `, ${property.province}` : ""}
                        </span>
                      </div>
                    </CardHeader>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{property.maxGuests || 4} Guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{totalBedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{totalBathrooms} Bathrooms</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.8</span>
                      </div>
                      <span className="text-muted-foreground">
                        (139 reviews)
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold">${basePrice}</span>
                        <span className="text-muted-foreground">/night</span>
                      </div>
                      <Link href={`/properties/${slug}`}>
                        <Button>View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
