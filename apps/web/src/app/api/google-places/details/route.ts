import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/lib/axios";

type PlacesApiResponse = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  shortFormattedAddress?: string;
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types?: string[];
  }>;
  location?: { latitude?: number; longitude?: number };
};

const FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "shortFormattedAddress",
  "addressComponents",
  "location",
].join(",");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("place_id");
  const language = searchParams.get("language") || "en";

  if (!placeId)
    return NextResponse.json(
      { error: "place_id is required" },
      { status: 400 }
    );

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!API_KEY)
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY not configured" },
      { status: 500 }
    );

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
    placeId
  )}?languageCode=${encodeURIComponent(language)}`;

  try {
    const resp = await apiClient.get(url, {
      headers: { "X-Goog-Api-Key": API_KEY, "X-Goog-FieldMask": FIELD_MASK },
      timeout: 5000,
    });

    const body = resp.data as PlacesApiResponse;
    return NextResponse.json(body);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    );
  }
}
