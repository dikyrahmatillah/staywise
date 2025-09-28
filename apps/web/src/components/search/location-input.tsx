"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoClose, IoLocationOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { useLocationAutocomplete } from "@/hooks/use-location-autocomplete";
import { PlacesAutocompleteSuggestion } from "@/types/google-places";

interface LocationInputProps {
  location: string;
  onLocationChange: (location: string) => void;
  onSearch: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocationInput({
  location,
  onLocationChange,
  onSearch,
  isOpen,
  onOpenChange,
}: LocationInputProps) {
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState(location);
  const { suggestions, isLoading, error, fetchSuggestions, clearSuggestions } =
    useLocationAutocomplete();

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => {
        locationInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen]);

  useEffect(() => {
    setInputValue(location);
  }, [location]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onLocationChange(value);

    if (value.length >= 3) {
      fetchSuggestions(value);
    } else {
      clearSuggestions();
    }
  };

  const handleSuggestionSelect = (suggestion: PlacesAutocompleteSuggestion) => {
    const main =
      suggestion.placePrediction?.structuredFormat?.mainText?.text ||
      suggestion.placePrediction?.text?.text ||
      "";
    const selectedLocation = main || "";
    setInputValue(selectedLocation);
    onLocationChange(selectedLocation);
    clearSuggestions();
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSuggestionSelect(suggestions[0]);
      }
      onSearch();
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  const showSuggestions =
    isOpen && (suggestions.length > 0 || isLoading || error);

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "flex-1 min-w-0 py-2 px-3 sm:px-6 text-left h-12 sm:h-14 items-center overflow-hidden cursor-pointer transition-all duration-300 ease-out",
            isOpen
              ? "bg-white border-l-2 border-t-2 border-b-2 border-r-2 border-gray-300 rounded-xl shadow-2xl shadow-gray-200/60 transform scale-[1.02] ring-4 ring-gray-100/50"
              : "bg-transparent border-r-2 border-gray-200  hover:border-r-gray-300 hover:shadow-md"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex-1 min-w-0">
              <div className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                Where
              </div>
              <Input
                ref={locationInputRef}
                placeholder="Search destinations"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="rounded-none border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:outline-none h-auto w-full truncate min-w-0 shadow-none"
              />
            </div>
            {inputValue && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setInputValue("");
                  onLocationChange("");
                  clearSuggestions();
                }}
                className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 cursor-pointer"
                aria-label="Clear location"
              >
                <IoClose className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </PopoverTrigger>

      {showSuggestions && (
        <PopoverContent
          className="w-full sm:w-80 md:w-96 p-0 mt-1"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="max-h-64 overflow-y-auto">
            {isLoading && (
              <div className="p-3 text-sm text-gray-500 text-center">
                Searching locations...
              </div>
            )}

            {error && (
              <div className="p-3 text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="py-1">
                {suggestions.map((suggestion, idx) => {
                  const main =
                    suggestion.placePrediction?.structuredFormat?.mainText
                      ?.text ||
                    suggestion.placePrediction?.text?.text ||
                    "";
                  const secondary =
                    suggestion.placePrediction?.structuredFormat?.secondaryText
                      ?.text || "";
                  return (
                    <button
                      key={suggestion.placePrediction?.placeId || idx}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors cursor-pointer"
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
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
