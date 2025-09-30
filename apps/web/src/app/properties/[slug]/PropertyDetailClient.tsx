"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Amenities } from "./components/types";
import type { ApiResponse } from "@/types/api";
import { HeaderBlock } from "./components/HeaderBlock";
import { ImageGallery } from "./components/ImageGallery";
import { StatsHeader } from "./components/StatsHeader";
import { getGuestRange } from "@/components/tenant/property-utils";
import { AmenitiesSection } from "./components/AmenitiesSection";
import { Reviews } from "./components/Reviews";
import { BookingSidebar } from "./components/BookingSidebar";
import { RoomsSection } from "./components/RoomsSection";
import { LocationSection } from "./components/LocationSection";

type Room = {
  id: string;
  name: string;
  basePrice: string | number;
  bedCount?: number;
  bedType?: string | null;
  maxGuests?: number;
  capacity?: number;
  imageUrl?: string | null;
};

type DetailResponse = {
  id: string;
  name: string;
  city: string;
  address: string;
  description?: string | null;
  maxGuests?: number;
  Rooms: Room[];
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
  reviewCount?: number;
  averageRating?: number | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

async function fetchProperty(slug: string): Promise<DetailResponse> {
  const res = await api.get<ApiResponse<DetailResponse>>(`/properties/${slug}`);
  return res.data.data;
}

export function PropertyDetailClient({ slug }: { slug: string }) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  const { data, isLoading, error } = useQuery<DetailResponse, Error>({
    queryKey: ["property", slug],
    queryFn: () => fetchProperty(slug),
  });

  useEffect(() => {
    if (!data) return;
    if (selectedRoom) return;

    const firstRoom =
      data.Rooms && data.Rooms.length > 0 ? data.Rooms[0] : null;
    if (firstRoom) {
      setSelectedRoom(firstRoom as Room);
    }
  }, [data, selectedRoom]);

  const { data: unavailableDatesData } = useQuery({
    queryKey: ["unavailable-dates", selectedRoom?.id],
    queryFn: async () => {
      if (!selectedRoom?.id) return null;
      const res = await api.get(`/rooms/${selectedRoom.id}/unavailable-dates`);
      return res.data.data;
    },
    enabled: !!selectedRoom?.id,
  });

  useEffect(() => {
    if (unavailableDatesData?.unavailableDates) {
      const dates = unavailableDatesData.unavailableDates.map(
        (dateStr: string) => new Date(dateStr + "T00:00:00")
      );
      setUnavailableDates(dates);
    } else {
      setUnavailableDates([]);
    }
  }, [unavailableDatesData]);

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

export default PropertyDetailClient;
