"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SearchOverlay } from "./search-overlay";
import { LocationInput } from "./location-input";
import { DateRangePicker } from "./date-range-picker";
import { GuestSelector } from "./guest-selector";
import type { SearchState, SearchActions } from "./types";

interface ExpandedSearchProps extends SearchState, SearchActions {
  locationOpen: boolean;
  datesOpen: boolean;
  guestsOpen: boolean;
  onLocationOpenChange: (open: boolean) => void;
  onDatesOpenChange: (open: boolean) => void;
  onGuestsOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function ExpandedSearch({
  location,
  checkIn,
  checkOut,
  adults,
  childrenCount,
  pets,
  setLocation,
  setCheckIn,
  setCheckOut,
  setAdults,
  setChildrenCount,
  setPets,
  onSearch,
  locationOpen,
  datesOpen,
  guestsOpen,
  onLocationOpenChange,
  onDatesOpenChange,
  onGuestsOpenChange,
  onClose,
}: ExpandedSearchProps) {
  return (
    <>
      <SearchOverlay onClose={onClose} />

      <div
        id="expanded-search"
        className="search-container absolute left-0 right-0 bg-white rounded-b-2xl border border-gray-200 border-t-0 py-3 sm:py-4 px-3 sm:px-6 z-50 animate-in slide-in-from-top-2 fade-in duration-300 ease-out"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="container flex flex-col sm:flex-row sm:flex-nowrap items-stretch sm:items-center mx-auto max-w-3xl gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row rounded-2xl border border-gray-300 overflow-hidden flex-1 min-w-0">
            <LocationInput
              location={location}
              onLocationChange={setLocation}
              onSearch={onSearch}
              isOpen={locationOpen}
              onOpenChange={onLocationOpenChange}
            />

            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              isOpen={datesOpen}
              onOpenChange={onDatesOpenChange}
            />

            <GuestSelector
              adults={adults}
              childrenCount={childrenCount}
              pets={pets}
              onAdultsChange={setAdults}
              onChildrenChange={setChildrenCount}
              onPetsChange={setPets}
              isOpen={guestsOpen}
              onOpenChange={onGuestsOpenChange}
            />
          </div>

          <Button
            onClick={onSearch}
            className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 sm:px-6 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-colors border border-gray-300 h-12 sm:h-14 w-full sm:w-auto cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </div>
      </div>
    </>
  );
}
