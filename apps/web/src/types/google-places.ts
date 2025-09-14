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
  id: string; // Using place_id as the id for React keys
};
