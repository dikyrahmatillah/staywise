import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

type AutocompletePlacePred = {
  placeId?: string;
  structuredFormat?: {
    mainText?: { text?: string };
    secondaryText?: { text?: string };
  };
  text?: { text?: string };
  types?: string[];
};

type PlacesAutocompleteSuggestion = { placePrediction?: AutocompletePlacePred };

const AUTOCOMPLETE_FIELD_MASK = [
  "suggestions.placePrediction.placeId",
  "suggestions.placePrediction.structuredFormat",
  "suggestions.placePrediction.text",
  "suggestions.placePrediction.types",
].join(",");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input");
  const language = searchParams.get("language") || "en";

  if (!input || input.trim().length < 3)
    return NextResponse.json({ suggestions: [], status: "ZERO_RESULTS" });

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!API_KEY)
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY not configured" },
      { status: 500 }
    );

  try {
    const resp = await axios.post(
      "https://places.googleapis.com/v1/places:autocomplete",
      { input, languageCode: language },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": AUTOCOMPLETE_FIELD_MASK,
        },
        timeout: 5000,
      }
    );

    const body = resp.data as { suggestions?: PlacesAutocompleteSuggestion[] };
    const suggestions = body.suggestions || [];
    return NextResponse.json({ suggestions, status: "OK" });
  } catch (err) {
    console.error("places autocomplete error", err);
    return NextResponse.json(
      { error: "Failed to fetch autocomplete predictions" },
      { status: 500 }
    );
  }
}
