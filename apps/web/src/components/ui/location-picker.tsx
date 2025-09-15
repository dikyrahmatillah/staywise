"use client";

import React, { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  }) => void;
  initialLocation?: {
    lat: number;
    lng: number;
  };
  apiKey: string;
  className?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -6.2088,
  lng: 106.8456,
};

const libraries: "places"[] = ["places"];

export function LocationPicker({
  onLocationSelect,
  initialLocation,
  apiKey,
  className = "",
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(initialLocation || null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const extractLocationDetails = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/google-places/geocode`, {
          params: { lat, lng },
        });

        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const addressComponents = result.address_components;

          let city = "";
          let country = "";

          addressComponents.forEach(
            (component: {
              long_name: string;
              short_name: string;
              types: string[];
            }) => {
              if (component.types.includes("locality")) {
                city = component.long_name;
              } else if (
                component.types.includes("administrative_area_level_1")
              ) {
                if (!city) city = component.long_name;
              } else if (component.types.includes("country")) {
                country = component.long_name;
              }
            }
          );

          onLocationSelect({
            lat,
            lng,
            address: result.formatted_address,
            city: city || "Unknown",
            country: country || "Unknown",
          });
        }
      } catch {
        toast.error("Failed to retrieve address details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [onLocationSelect]
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedLocation({ lat, lng });
        extractLocationDetails(lat, lng);
      }
    },
    [extractLocationDetails]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              Click anywhere on the map to set the location for your property.
            </p>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={selectedLocation || defaultCenter}
              zoom={selectedLocation ? 15 : 10}
              onClick={handleMapClick}
              onLoad={onMapLoad}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {selectedLocation && (
                <Marker
                  position={selectedLocation}
                  animation={google.maps.Animation.DROP}
                />
              )}
            </GoogleMap>
          </div>

          {isLoading && (
            <div className="text-center text-sm text-gray-500">
              Getting location details...
            </div>
          )}
        </div>
      </LoadScript>
    </div>
  );
}
