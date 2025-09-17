"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import {
  AutocompleteResponse,
  PlacesAutocompleteSuggestion,
} from "@/types/google-places";

function hasErrorMessage(obj: unknown): obj is { error_message: string } {
  if (typeof obj !== "object" || obj === null) return false;
  const rec = obj as Record<string, unknown>;
  return (
    Object.prototype.hasOwnProperty.call(rec, "error_message") &&
    typeof rec["error_message"] === "string"
  );
}

export function useLocationAutocomplete() {
  const [suggestions, setSuggestions] = useState<
    PlacesAutocompleteSuggestion[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const resp = await axios.get<AutocompleteResponse>(
        "/api/google-places/autocomplete",
        {
          params: { input },
          signal: controller.signal,
        }
      );

      const data = resp.data as unknown;
      if (hasErrorMessage(data)) {
        throw new Error(data.error_message);
      }

      const responseObj = data as {
        suggestions?: PlacesAutocompleteSuggestion[];
      };
      setSuggestions(responseObj.suggestions || []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
        return;
      }

      setError(
        err instanceof Error ? err.message : "Failed to fetch suggestions"
      );
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions: debouncedFetchSuggestions,
    clearSuggestions,
  };
}
