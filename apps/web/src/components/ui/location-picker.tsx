"use client";

import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { LocationSearchInput } from "@/components/ui/location-search-input";
import { LocationSuggestionList } from "@/components/ui/location-suggestion-list";
import { useLocationPicker } from "@/hooks/use-location-picker";
import { useGoogleMaps } from "@/components/providers/google-maps-provider";

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
  className?: string;
  onFieldsChange?: (fields: {
    address?: string;
    city?: string;
    country?: string;
  }) => void;
}

export function LocationPicker({
  onLocationSelect,
  initialLocation,
  className = "",
  onFieldsChange,
}: LocationPickerProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const {
    selectedLocation,
    isLoading,
    searchValue,
    setSearchValue,
    suggestions,
    suggestionsLoading,
    suggestionsError,
    handleSuggestionSelect,
    handleCurrentLocation,
    handleMapClick,
  } = useLocationPicker({ onLocationSelect, initialLocation, onFieldsChange });

  interface GoogleWindow {
    google?: {
      maps?: {
        Animation?: {
          DROP?: number;
        };
      };
    };
  }

  const getMarkerAnimation = (): number | undefined => {
    if (typeof window === "undefined") return undefined;
    const gw = window as unknown as GoogleWindow;
    return gw.google?.maps?.Animation?.DROP as number | undefined;
  };

  if (loadError) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center text-red-500">
          Error loading maps: {loadError.message}
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center text-gray-500">Loading maps...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <LocationSearchInput
                value={searchValue}
                onChange={setSearchValue}
                onUseCurrentLocation={handleCurrentLocation}
                isLoading={isLoading}
              />

              {searchValue.length >= 3 &&
                (suggestionsLoading ||
                  suggestions.length > 0 ||
                  !!suggestionsError) && (
                  <LocationSuggestionList
                    suggestions={suggestions}
                    isLoading={suggestionsLoading}
                    error={suggestionsError}
                    onSelect={handleSuggestionSelect}
                  />
                )}
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "400px",
            }}
            center={
              selectedLocation || {
                lat: -6.2088,
                lng: 106.8456,
              }
            }
            zoom={selectedLocation ? 15 : 10}
            onClick={handleMapClick}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {selectedLocation && (
              <Marker
                position={selectedLocation}
                animation={getMarkerAnimation()}
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
    </div>
  );
}
