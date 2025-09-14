"use client";

import { useState, useCallback, useRef } from "react";
import { AutocompleteResponse, PlacePrediction } from "@/types/google-places";

export function useLocationAutocomplete() {
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/google-places/autocomplete?input=${encodeURIComponent(input)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AutocompleteResponse = await response.json();

      if (data.error_message) {
        throw new Error(data.error_message);
      }

      setSuggestions(data.predictions || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch suggestions"
      );
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced fetch function
  const debouncedFetchSuggestions = useCallback(
    (input: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(input);
      }, 300);
    },
    [fetchSuggestions]
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions: debouncedFetchSuggestions,
    clearSuggestions,
  };
}
