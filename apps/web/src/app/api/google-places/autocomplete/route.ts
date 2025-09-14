import {
  Client,
  PlaceAutocompleteType,
} from "@googlemaps/google-maps-services-js";
import { NextRequest, NextResponse } from "next/server";

const googleMapsClient = new Client({});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");
    const typesParam = searchParams.get("types");
    const components = searchParams.get("components");

    if (!input || input.length < 3) {
      return NextResponse.json({ predictions: [] });
    }

    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key not configured");
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

    // Build the autocomplete request
    const requestParams: {
      input: string;
      key: string;
      types?: PlaceAutocompleteType;
      components?: string[];
    } = {
      input,
      key: GOOGLE_MAPS_API_KEY,
    };

    if (typesParam) {
      requestParams.types = typesParam as PlaceAutocompleteType;
    }

    if (components) {
      requestParams.components = [components];
    }

    const response = await googleMapsClient.placeAutocomplete({
      params: requestParams,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Google Places Autocomplete API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch autocomplete predictions" },
      { status: 500 }
    );
  }
}
