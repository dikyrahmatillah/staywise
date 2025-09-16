"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Amenities } from "./components/types";
import type { ApiResponse } from "@/types/api";
import { HeaderBlock } from "./components/HeaderBlock";
import { ImageGallery } from "./components/ImageGallery";
import { StatsHeader } from "./components/StatsHeader";
import { AmenitiesSection } from "./components/AmenitiesSection";
import { LocationSection } from "./components/LocationSection";
import { Reviews } from "./components/Reviews";
import { BookingSidebar } from "./components/BookingSidebar";

type DetailResponse = {
  id: string;
  name: string;
  city: string;
  address: string;
  description?: string | null;
  maxGuests?: number;
  Rooms: {
    id: string;
    name: string;
    basePrice: string | number;
    bedCount?: number;
    bedType?: string | null;
  }[];
  Facilities: { id: string; propertyId: string; facility: Amenities }[];
  Pictures: {
    id: string;
    propertyId: string;
    imageUrl: string;
    note?: string | null;
  }[];
  Reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    User: {
      firstName: string | null;
      lastName: string | null;
      image?: string | null;
    };
  }[];
  // summary fields added by the API service
  reviewCount?: number;
  averageRating?: number | null;
};

async function fetchProperty(slug: string): Promise<DetailResponse> {
  const res = await api.get<ApiResponse<DetailResponse>>(`/properties/${slug}`);
  return res.data.data;
}

export function PropertyDetailClient({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery<DetailResponse, Error>({
    queryKey: ["property", slug],
    queryFn: () => fetchProperty(slug),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load property</div>;
  const property = data as DetailResponse;

  const images = property.Pictures?.map((p) => p.imageUrl) ?? [];

  const reviewCount = Number(property.reviewCount);
  const rating =
    property.Reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviewCount;

  const reviewsToShow = (property.Reviews ?? []).map((rv) => ({
    id: rv.id,
    author:
      [rv.User.firstName, rv.User.lastName].filter(Boolean).join(" ") ||
      "Anonymous",
    avatar: rv.User.image || "",
    rating: rv.rating,
    date: rv.createdAt,
    comment: rv.comment,
  }));

  const details = { reviews: reviewsToShow };
  const totalBedrooms = property.Rooms?.length || 1;
  const totalBathrooms = property.Rooms?.length || 1;

  return (
    <div>
      <HeaderBlock name={property.name} />
      <ImageGallery name={property.name} images={images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StatsHeader
            city={property.city}
            address={property.address}
            description={property.description}
            rating={rating}
            reviewCount={reviewCount}
            maxGuests={property.maxGuests}
            bedrooms={totalBedrooms}
            bathrooms={totalBathrooms}
          />
          <div className="space-y-8">
            <AmenitiesSection
              property={{
                id: property.id,
                name: property.name,
                city: property.city,
                address: property.address,
                facilities: property.Facilities?.map((f) => ({
                  id: f.id,
                  propertyId: f.propertyId,
                  facility: f.facility,
                })),
              }}
            />
            <LocationSection address={property.address} city={property.city} />
            <Reviews reviews={details.reviews} total={reviewCount} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <BookingSidebar
            pricePerNight={Number(property.Rooms?.[0]?.basePrice ?? 0)}
            maxGuests={property.maxGuests}
          />
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailClient;
