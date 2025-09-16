export type PlacesAutocompleteSuggestion = {
  placePrediction?: {
    placeId?: string;
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
    text?: { text?: string };
    types?: string[];
  };
};

export interface AutocompleteResponse {
  suggestions?: PlacesAutocompleteSuggestion[];
  status: string;
  error_message?: string;
}

export interface AutocompleteErrorResponse {
  error: string;
}

export type LocationSearchResult = PlacesAutocompleteSuggestion & {
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
