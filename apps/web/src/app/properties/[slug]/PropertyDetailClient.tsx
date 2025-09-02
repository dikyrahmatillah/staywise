"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Property } from "@repo/schemas";
import { HeaderBlock } from "./components/HeaderBlock";
import { ImageGallery } from "./components/ImageGallery";
import { StatsHeader } from "./components/StatsHeader";
import { AmenitiesSection } from "./components/AmenitiesSection";
import { SleepingArrangements } from "./components/SleepingArrangements";
import { LocationSection } from "./components/LocationSection";
import { Reviews } from "./components/Reviews";
import { BookingSidebar } from "./components/BookingSidebar";

async function fetchProperty(slug: string): Promise<Property> {
  const res = await api.get(`/properties/${slug}`);
  return res.data as Property;
}

export function PropertyDetailClient({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery<Property, Error>({
    queryKey: ["property", slug],
    queryFn: () => fetchProperty(slug),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load property</div>;

  const property = data as Property;
  const details = property.details ?? {
    images: [],
    rating: 0,
    reviewCount: 0,
    sleepingArrangements: [],
    location: { landmarks: [] },
    reviews: [],
    pricePerNight: 0,
    nearbyProperties: [],
  };
  const totalBedrooms = property.rooms?.length || 1;
  const totalBathrooms = property.rooms?.length || 1;

  return (
    <div>
      <HeaderBlock name={property.name} />
      <ImageGallery name={property.name} images={details.images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StatsHeader
            city={property.city}
            address={property.address}
            description={property.description}
            rating={details.rating}
            reviewCount={details.reviewCount}
            maxGuests={property.maxGuests}
            bedrooms={totalBedrooms}
            bathrooms={totalBathrooms}
          />
          <div className="space-y-8">
            <AmenitiesSection property={property} />
            <SleepingArrangements data={details.sleepingArrangements} />
            <LocationSection
              address={property.address}
              city={property.city}
              landmarks={details.location.landmarks}
            />
            <Reviews reviews={details.reviews} total={details.reviewCount} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <BookingSidebar
            pricePerNight={details.pricePerNight}
            maxGuests={property.maxGuests}
          />
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailClient;
