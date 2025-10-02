"use client";

import { useState, useCallback, useEffect } from "react";
import type { PlacesAutocompleteSuggestion } from "@/types/google-places";
import { useLocationAutocomplete } from "@/hooks/use-location-autocomplete";
import { toast } from "sonner";
import { getLocationDetails, type LocationDetails } from "@/lib/location.utils";
import { processPlaceSelection } from "@/lib/google-places.service";

interface UseLocationPickerProps {
  onLocationSelect: (location: LocationDetails) => void;
  initialLocation?: {
    lat: number;
    lng: number;
  };
  onFieldsChange?: (fields: {
    address?: string;
    city?: string;
    country?: string;
  }) => void;
}

type LatLng = { lat: number; lng: number };

export function useLocationPicker({
  onLocationSelect,
  initialLocation,
  onFieldsChange,
}: UseLocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    initialLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);

  const {
    suggestions,
    isLoading: suggestionsLoading,
    error: suggestionsError,
    fetchSuggestions,
    clearSuggestions,
  } = useLocationAutocomplete();

  useEffect(() => {
    if (suppressSuggestions) return;

    const query = searchValue.trim();
    if (query.length >= 3) {
      fetchSuggestions(query);
    } else {
      clearSuggestions();
    }
  }, [searchValue, fetchSuggestions, clearSuggestions, suppressSuggestions]);

  const updateSearchValue = useCallback((value: string) => {
    setSuppressSuggestions(false);
    setSearchValue(value);
  }, []);

  const notifyLocationChange = useCallback(
    (location: LocationDetails) => {
      onLocationSelect(location);
      if (onFieldsChange) {
        onFieldsChange({
          address: location.address,
          city: location.city,
          country: location.country,
        });
      }
    },
    [onLocationSelect, onFieldsChange]
  );

  const extractLocationDetails = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true);
      try {
        const locationDetails = await getLocationDetails(lat, lng);
        if (locationDetails) {
          notifyLocationChange(locationDetails);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [notifyLocationChange]
  );

  const handleSuggestionSelect = useCallback(
    async (suggestion: PlacesAutocompleteSuggestion) => {
      setIsLoading(true);
      try {
        const locationDetails = await processPlaceSelection(suggestion);

        if (!locationDetails) {
          return;
        }

        setSelectedLocation({
          lat: locationDetails.lat,
          lng: locationDetails.lng,
        });
        updateSearchValue(locationDetails.address);
        setSuppressSuggestions(true);
        notifyLocationChange(locationDetails);
        clearSuggestions();
      } finally {
        setIsLoading(false);
      }
    },
    [notifyLocationChange, clearSuggestions, updateSearchValue]
  );

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation({ lat: latitude, lng: longitude });
        await extractLocationDetails(latitude, longitude);
      },
      (error) => {
        setIsLoading(false);
        const errorMessage =
          (
            {
              1: "Location access denied by user.",
              2: "Location information is unavailable.",
              3: "Location request timed out.",
            } as Record<number, string>
          )[error?.code as number] ?? "An unknown error occurred.";
        toast.error(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [extractLocationDetails]);

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

  return {
    selectedLocation,
    isLoading,
    searchValue,
    setSearchValue: updateSearchValue,
    suggestions,
    suggestionsLoading,
    suggestionsError,
    handleSuggestionSelect,
    handleCurrentLocation,
    handleMapClick,
  };
}
