import axios from "axios";
import { toast } from "sonner";
import type { AddressComponent, GeocodeResult } from "@/types/google-places";

export interface LocationDetails {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
}

const CITY_ADDRESS_TYPES = [
  "locality",
  "postal_town",
  "administrative_area_level_2",
  "administrative_area_level_1",
] as const;

const COUNTRY_ADDRESS_TYPE = "country";

export function getCityCountry(components?: AddressComponent[]) {
  if (!components?.length) {
    return { city: "Unknown", country: "Unknown" };
  }

  const findByTypes = (typesToCheck: readonly string[]) => {
    for (const type of typesToCheck) {
      const found = components.find((c) => c.types?.includes(type));
      if (found) return found.long_name;
    }
    return undefined;
  };

  const city = findByTypes(CITY_ADDRESS_TYPES) || "Unknown";
  const country = findByTypes([COUNTRY_ADDRESS_TYPE]) || "Unknown";

  return { city, country };
}

export function inferCityCountryFromAddress(
  address?: string,
  secondary?: string
) {
  const source = secondary || address || "";
  const parts = source
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    city: parts.length > 1 ? parts[parts.length - 2] : "Unknown",
    country: parts.length > 0 ? parts[parts.length - 1] : "Unknown",
  };
}

export async function geocodeLocation(
  lat: number,
  lng: number
): Promise<GeocodeResult | null> {
  try {
    const { data } = await axios.get("/api/google-places/geocode", {
      params: { lat, lng },
    });

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    return null;
  } catch {
    toast.error("Failed to retrieve address details. Please try again.");
    return null;
  }
}

export function parseLocationDetails(
  result: GeocodeResult,
  lat: number,
  lng: number
): LocationDetails {
  const address = result.formatted_address ?? "";
  let { city, country } = getCityCountry(result.address_components);

  if (city === "Unknown" || country === "Unknown") {
    const inferred = inferCityCountryFromAddress(address);
    city = city === "Unknown" ? inferred.city : city;
    country = country === "Unknown" ? inferred.country : country;
  }

  return { lat, lng, address, city, country };
}

export async function getLocationDetails(
  lat: number,
  lng: number
): Promise<LocationDetails | null> {
  const result = await geocodeLocation(lat, lng);

  if (!result) {
    return null;
  }

  return parseLocationDetails(result, lat, lng);
}
