export interface PlacePrediction {
  description: string;
  matched_substrings: MatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: string[];
}

export interface MatchedSubstring {
  length: number;
  offset: number;
}

export interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings?: MatchedSubstring[];
  secondary_text?: string;
  secondary_text_matched_substrings?: MatchedSubstring[];
}

export interface Term {
  offset: number;
  value: string;
}

export interface AutocompleteResponse {
  predictions: PlacePrediction[];
  status: string;
  error_message?: string;
}

export interface AutocompleteErrorResponse {
  error: string;
}

export type LocationSearchResult = PlacePrediction & {
  id: string;
};

export interface PlaceDetailsResponse {
  result: PlaceDetails;
  status: string;
  error_message?: string;
}

export interface PlaceDetails {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  address_components: AddressComponent[];
  name?: string;
  place_id: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
  error_message?: string;
}

export interface GeocodeResult {
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  place_id: string;
  types: string[];
}
