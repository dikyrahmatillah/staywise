"use client";

import { useState, useCallback, useEffect } from "react";
import {
  PlacesAutocompleteSuggestion,
  AddressComponent,
} from "@/types/google-places";
import { useLocationAutocomplete } from "@/hooks/use-location-autocomplete";
import { toast } from "sonner";
import axios from "axios";

interface UseLocationPickerProps {
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
}

export function useLocationPicker({
  onLocationSelect,
  initialLocation,
}: UseLocationPickerProps) {
  const getCityCountry = (components?: AddressComponent[]) => {
    if (!components?.length) return { city: "Unknown", country: "Unknown" };
    const findByType = (type: string) =>
      components.find((c) => c.types.includes(type))?.long_name;
    const city =
      findByType("locality") ||
      findByType("administrative_area_level_1") ||
      "Unknown";
    const country = findByType("country") || "Unknown";
    return { city, country };
  };

  const getPlaceDetails = async (placeId: string) => {
    const resp = await axios.get(`/api/google-places/details`, {
      params: { place_id: placeId },
    });
    return resp.data?.result;
  };

  type LatLng = { lat: number; lng: number };
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    initialLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const {
    suggestions,
    isLoading: suggestionsLoading,
    error: suggestionsError,
    fetchSuggestions,
    clearSuggestions,
  } = useLocationAutocomplete();

  useEffect(() => {
    const q = searchValue.trim();
    if (q.length >= 3) {
      fetchSuggestions(q);
    } else {
      clearSuggestions();
    }
  }, [searchValue, fetchSuggestions, clearSuggestions]);

  const extractLocationDetails = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/google-places/geocode`, {
          params: { lat, lng },
        });
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const { city, country } = getCityCountry(result.address_components);
          onLocationSelect({
            lat,
            lng,
            address: result.formatted_address,
            city,
            country,
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

  const handleSuggestionSelect = useCallback(
    async (suggestion: PlacesAutocompleteSuggestion) => {
      setIsLoading(true);
      try {
        const placeId = suggestion.placePrediction?.placeId;
        if (!placeId) {
          toast.error("Invalid place selection");
          return;
        }

        const result = await getPlaceDetails(placeId);
        const loc = result?.geometry?.location;
        if (!loc) {
          toast.error("Location not available for the selected place");
          return;
        }

        const { lat, lng } = loc;
        setSelectedLocation({ lat, lng });

        const mainText =
          suggestion.placePrediction?.structuredFormat?.mainText?.text ??
          suggestion.placePrediction?.text?.text ??
          "";
        const address = result.formatted_address ?? mainText;

        const { city, country } = getCityCountry(result.address_components);
        setSearchValue(address);
        onLocationSelect({ lat, lng, address, city, country });
        clearSuggestions();
      } catch {
        toast.error("Failed to select place");
      } finally {
        setIsLoading(false);
      }
    },
    [onLocationSelect, clearSuggestions]
  );

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation)
      return toast.error("Geolocation is not supported by this browser.");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation({ lat: latitude, lng: longitude });
        await extractLocationDetails(latitude, longitude);
      },
      (err) => {
        setIsLoading(false);
        const code = err?.code;
        const msgMap: Record<number, string> = {
          1: "Location access denied by user.",
          2: "Location information is unavailable.",
          3: "Location request timed out.",
        };
        toast.error(msgMap[code] ?? "An unknown error occurred.");
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

  const onMapLoad = useCallback(() => {}, []);

  return {
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
  };
}
