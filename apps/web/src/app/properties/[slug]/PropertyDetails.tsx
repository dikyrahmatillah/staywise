"use client";

import React from "react";
import Link from "next/link";
import Ellipsis from "@/components/ui/ellipsis";
import usePropertyDetails from "@/hooks/usePropertyDetails";
import { HeaderBlock } from "./components/HeaderBlock";
import { ImageGallery } from "./components/ImageGallery";
import { StatsHeader } from "./components/StatsHeader";
import { getGuestRange } from "@/components/tenant/property-utils";
import { AmenitiesSection } from "./components/AmenitiesSection";
import { Reviews } from "./components/Reviews";
import { BookingSidebar } from "./components/BookingSidebar";
import { RoomsSection } from "./components/RoomsSection";
import { LocationSection } from "./components/LocationSection";
import type { Room, DetailResponse } from "@/types/property-detail";

interface PropertyDetailsProps {
  slug: string;
  initialData: DetailResponse | null;
}

export function PropertyDetails({ slug, initialData }: PropertyDetailsProps) {
  const {
    data: property,
    isLoading,
    error,
    selectedRoom,
    setSelectedRoom,
    unavailableDates,
  } = usePropertyDetails(slug, initialData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Ellipsis size={10} />
          <p className="text-sm text-muted-foreground">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (!property || error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Property not found</h2>
            <p className="text-sm text-muted-foreground">
              The property you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

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
  const totalBeds =
    property.Rooms?.reduce((sum, room) => sum + (room.bedCount || 0), 0) || 0;
  type PropLike = { Rooms?: unknown[]; maxGuests?: number };
  const guestRange = getGuestRange(property as PropLike);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <HeaderBlock name={property.name} />
      <ImageGallery name={property.name} images={images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2">
          <StatsHeader
            city={property.city}
            address={property.address}
            description={property.description}
            rating={rating}
            reviewCount={reviewCount}
            minGuests={guestRange.min}
            maxGuests={guestRange.max}
            bedrooms={totalBedrooms}
            totalBeds={totalBeds}
          />
          <div className="space-y-12">
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
            <div className="border-t border-gray-100 pt-8">
              <RoomsSection
                rooms={property.Rooms || []}
                selectedRoomId={selectedRoom?.id}
                onRoomSelect={handleRoomSelect}
              />
            </div>
            <div className="border-t border-gray-100 pt-8">
              <LocationSection
                address={property.address}
                city={property.city}
                latitude={
                  property.latitude === undefined || property.latitude === null
                    ? undefined
                    : Number(property.latitude as unknown)
                }
                longitude={
                  property.longitude === undefined ||
                  property.longitude === null
                    ? undefined
                    : Number(property.longitude as unknown)
                }
              />
            </div>
            <div className="border-t border-gray-100 pt-8">
              <Reviews reviews={details.reviews} total={reviewCount} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingSidebar
              pricePerNight={Number(property.Rooms?.[0]?.basePrice ?? 0)}
              maxGuests={guestRange.max}
              propertyId={property.id}
              selectedRoom={selectedRoom}
              unavailableDates={unavailableDates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
