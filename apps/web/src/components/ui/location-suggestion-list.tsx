"use client";

import React from "react";
import { PlacesAutocompleteSuggestion } from "@/types/google-places";
import { IoLocationOutline } from "react-icons/io5";

interface LocationSuggestionListProps {
  suggestions: PlacesAutocompleteSuggestion[];
  isLoading: boolean;
  error?: string | null;
  onSelect: (suggestion: PlacesAutocompleteSuggestion) => void;
}

export function LocationSuggestionList({
  suggestions,
  isLoading,
  error,
  onSelect,
}: LocationSuggestionListProps) {
  return (
    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-sm max-h-64 overflow-auto text-sm">
      {isLoading && <div className="p-3 text-gray-500">Searching...</div>}
      {!isLoading && suggestions.length === 0 && !error && (
        <div className="p-3 text-gray-500">No results</div>
      )}
      {error && <div className="p-3 text-sm text-red-500">{error}</div>}
      {suggestions.map((suggestion, idx) => {
        const main =
          suggestion.placePrediction?.structuredFormat?.mainText?.text ||
          suggestion.placePrediction?.text?.text ||
          "";
        const secondary =
          suggestion.placePrediction?.structuredFormat?.secondaryText?.text ||
          "";
        return (
          <button
            key={suggestion.placePrediction?.placeId || idx}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          >
            <div className="flex items-start gap-3">
              <IoLocationOutline className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {main}
                </div>
                {secondary && (
                  <div className="text-xs text-gray-500 truncate">
                    {secondary}
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
