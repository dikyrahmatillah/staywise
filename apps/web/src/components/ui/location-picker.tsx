"use client";

import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { LocationSearchInput } from "@/components/ui/location-search-input";
import { LocationSuggestionList } from "@/components/ui/location-suggestion-list";
import { useLocationPicker } from "@/hooks/use-location-picker";

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

export function LocationPicker({
  onLocationSelect,
  initialLocation,
  apiKey,
  className = "",
}: LocationPickerProps) {
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
    onMapLoad,
  } = useLocationPicker({ onLocationSelect, initialLocation });

  return (
    <div className={`space-y-4 ${className}`}>
      <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
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

                {searchValue.length >= 3 && (
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

          <div>
            <p className="text-sm text-gray-600">
              Search for a location or click anywhere on the map to set the
              location for your property.
            </p>
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
