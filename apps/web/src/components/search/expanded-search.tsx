"use client";

import { Button } from "@/components/ui/button";
import { IoSearch } from "react-icons/io5";
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
        className="search-container absolute left-0 right-0 bg-white/95 backdrop-blur-xl rounded-b-3xl border-2 border-t-0 py-4 sm:py-5 px-4 sm:px-7 z-50 animate-in slide-in-from-top-2 fade-in duration-500 ease-out "
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="container flex flex-col sm:flex-row sm:flex-nowrap items-stretch sm:items-center mx-auto max-w-3xl gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row rounded-2xl border border-gray-300 overflow-hidden flex-1 min-w-0  bg-white/80">
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
            aria-label="Search listings"
            className="group relative flex h-12 w-full min-w-[8rem] items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-primary px-6 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-14 sm:w-auto sm:px-8"
          >
            <span className="font-display font-semibold relative z-10 flex items-center gap-3 transition-all duration-300 ease-out group-hover:-translate-y-4 group-hover:opacity-0 text-base sm:text-lg">
              Search
            </span>
            <span className="absolute inset-0 flex translate-y-6 items-center justify-center opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              <IoSearch className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
