import axios from "axios";
import { toast } from "sonner";
import type {
  PlacesAutocompleteSuggestion,
  AddressComponent,
} from "@/types/google-places";
import {
  getCityCountry,
  inferCityCountryFromAddress,
  type LocationDetails,
} from "./location.utils";

interface PlaceDetailsResult {
  geometry?: {
    location?: {
      lat: number | (() => number);
      lng: number | (() => number);
    };
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
  formatted_address?: string;
  formattedAddress?: string;
  address_components?: AddressComponent[];
  addressComponents?: AddressComponent[];
}

export async function getPlaceDetails(placeId: string) {
  const resp = await axios.get("/api/google-places/details", {
    params: { place_id: placeId },
  });
  return resp.data as PlaceDetailsResult;
}

export function extractCoordinates(
  result: PlaceDetailsResult
): { lat: number; lng: number } | null {
  const geometryLocation = result?.geometry?.location;
  const serverLocation = result?.location;

  let lat: number | undefined;
  let lng: number | undefined;

  if (geometryLocation && typeof geometryLocation.lat === "function") {
    lat = geometryLocation.lat();
    lng =
      typeof geometryLocation.lng === "function"
        ? geometryLocation.lng()
        : geometryLocation.lng;
  } else if (geometryLocation?.lat != null && geometryLocation?.lng != null) {
    lat = geometryLocation.lat as number;
    lng = geometryLocation.lng as number;
  } else if (
    serverLocation?.latitude != null &&
    serverLocation?.longitude != null
  ) {
    lat = Number(serverLocation.latitude);
    lng = Number(serverLocation.longitude);
  }

  if (lat == null || lng == null) {
    return null;
  }

  return { lat, lng };
}

export function extractLocationFromPlace(
  result: PlaceDetailsResult,
  suggestion: PlacesAutocompleteSuggestion,
  coordinates: { lat: number; lng: number }
): LocationDetails {
  const mainText =
    suggestion.placePrediction?.structuredFormat?.mainText?.text ??
    suggestion.placePrediction?.text?.text ??
    "";

  const address =
    result.formatted_address ?? result.formattedAddress ?? mainText;

  const rawComponents =
    result.address_components ?? result.addressComponents ?? [];

  let { city, country } = getCityCountry(rawComponents);

  if (city === "Unknown" || country === "Unknown") {
    const secondary =
      suggestion.placePrediction?.structuredFormat?.secondaryText?.text ??
      suggestion.placePrediction?.text?.text ??
      "";
    const inferred = inferCityCountryFromAddress(address, secondary);
    city = city === "Unknown" ? inferred.city : city;
    country = country === "Unknown" ? inferred.country : country;
  }

  return {
    lat: coordinates.lat,
    lng: coordinates.lng,
    address,
    city,
    country,
  };
}

export async function processPlaceSelection(
  suggestion: PlacesAutocompleteSuggestion
): Promise<LocationDetails | null> {
  const placeId = suggestion.placePrediction?.placeId;

  if (!placeId) {
    toast.error("Invalid place selection");
    return null;
  }

  try {
    const result = await getPlaceDetails(placeId);
    const coordinates = extractCoordinates(result);

    if (!coordinates) {
      toast.error("Location not available for the selected place");
      return null;
    }

    return extractLocationFromPlace(result, suggestion, coordinates);
  } catch {
    toast.error("Failed to select place");
    return null;
  }
}
