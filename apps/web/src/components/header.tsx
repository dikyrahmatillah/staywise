"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiHome } from "react-icons/hi";

import { LoginButton } from "./signin-button";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchButton } from "./search/search-button";
import { ExpandedSearch } from "./search/expanded-search";

export function Header() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [location, setLocation] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const openSection = (section: "location" | "dates" | "guests" | null) => {
    setLocationOpen(section === "location");
    setDatesOpen(section === "dates");
    setGuestsOpen(section === "guests");
  };

  const handleLocationOpenChange = (open: boolean) => {
    if (open) openSection("location");
    else setLocationOpen(false);
  };

  const handleDatesOpenChange = (open: boolean) => {
    if (open) openSection("dates");
    else setDatesOpen(false);
  };

  const handleGuestsOpenChange = (open: boolean) => {
    if (open) openSection("guests");
    else setGuestsOpen(false);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (location) searchParams.set("location", location);
    if (checkIn) searchParams.set("checkIn", checkIn.toISOString());
    if (checkOut) searchParams.set("checkOut", checkOut.toISOString());
    if (adults > 0) searchParams.set("adults", adults.toString());
    if (children > 0) searchParams.set("children", children.toString());
    if (pets > 0) searchParams.set("pets", pets.toString());

    router.push(`/search?${searchParams.toString()}`);
    setIsSearchOpen(false);
  };

  return (
    <header
      onMouseDown={(e) => e.stopPropagation()}
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white transition-all duration-300 ease-in-out",
        isSearchOpen ? "h-[140px] sm:h-[120px]" : "h-16"
      )}
    >
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <SearchButton
              isSearchOpen={isSearchOpen}
              onToggle={() => setIsSearchOpen(!isSearchOpen)}
            />
          </div>

          <div className="flex items-center justify-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
              <HiHome className="h-6 w-6 sm:h-8 sm:w-8 font-sans text-rose-500" />
              <span className="font-bold text-lg sm:text-xl text-rose-500 hidden sm:inline-block">
                StayWise
              </span>
            </Link>
          </div>

          <div className="flex items-center flex-1 justify-end min-w-0">
            <LoginButton />
          </div>
        </div>

        {isSearchOpen && (
          <ExpandedSearch
            location={location}
            checkIn={checkIn}
            checkOut={checkOut}
            adults={adults}
            childrenCount={children}
            pets={pets}
            setLocation={setLocation}
            setCheckIn={setCheckIn}
            setCheckOut={setCheckOut}
            setAdults={setAdults}
            setChildrenCount={setChildren}
            setPets={setPets}
            onSearch={handleSearch}
            locationOpen={locationOpen}
            datesOpen={datesOpen}
            guestsOpen={guestsOpen}
            onLocationOpenChange={handleLocationOpenChange}
            onDatesOpenChange={handleDatesOpenChange}
            onGuestsOpenChange={handleGuestsOpenChange}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </div>
    </header>
  );
}
