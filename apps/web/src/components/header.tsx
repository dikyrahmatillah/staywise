"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { UserMenu } from "./user-menu";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SearchButton } from "./search/search-button";
import { ExpandedSearch } from "./search/expanded-search";
import { format } from "date-fns";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [location, setLocation] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [userClosedSearch, setUserClosedSearch] = useState(false);
  const mountedRef = useRef(false);
  const [openSection, setOpenSection] = useState<
    "location" | "dates" | "guests" | null
  >(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.pageYOffset;
      const nearTop = scrollTop < 5;
      setIsAtTop(nearTop);

      const isDesktop =
        typeof window !== "undefined" && window.innerWidth >= 640;
      const auto =
        isDesktop && (pathname === "/" || pathname === "/properties");

      if (scrollTop >= 60) {
        if (isSearchOpen && !userClosedSearch && auto) setIsSearchOpen(false);
        return;
      }

      if (nearTop && !isSearchOpen && !userClosedSearch && auto)
        setIsSearchOpen(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isSearchOpen, userClosedSearch, pathname]);

  useEffect(() => void (mountedRef.current = true), []);

  useEffect(() => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 640;
    const shouldAutoOpen =
      (pathname === "/" || pathname === "/properties") && isDesktop;
    if (shouldAutoOpen) {
      setUserClosedSearch(false);
      setIsSearchOpen(true);
      return;
    }
    setIsSearchOpen(false);
    setUserClosedSearch(false);
    setOpenSection(null);
  }, [pathname]);

  useEffect(() => {
    if (!isAtTop) return;
    const t = setTimeout(() => setUserClosedSearch(false), 500);
    return () => clearTimeout(t);
  }, [isAtTop]);
  const handleOpenChange = (
    section: "location" | "dates" | "guests" | null,
    open: boolean
  ) => setOpenSection(open ? section : null);

  const setSearchOpenManual = (open: boolean) => {
    setIsSearchOpen(open);
    setUserClosedSearch(isAtTop ? !open : open);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (location) searchParams.set("location", location);
    if (checkIn) searchParams.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) searchParams.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    if (adults > 0) searchParams.set("adults", adults.toString());
    if (children > 0) searchParams.set("children", children.toString());
    if (pets > 0) searchParams.set("pets", pets.toString());
    router.push(`/properties?${searchParams.toString()}`);
    setSearchOpenManual(false);
  };

  const handleSearchToggle = () => setSearchOpenManual(!isSearchOpen);
  const handleSearchClose = () => setSearchOpenManual(false);

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
              onToggle={handleSearchToggle}
            />
          </div>

          <div className="flex items-center justify-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/icon.svg"
                alt="StayWise"
                width={28}
                height={28}
                className="h-9 w-9 sm:hidden"
                priority={true}
              />

              <Image
                src="/staywise_logo_type.svg"
                alt="StayWise"
                width={120}
                height={32}
                className="hidden sm:inline-block h-6 w-auto sm:h-7 ml-2"
                priority={true}
              />
            </Link>
          </div>

          <div className="flex items-center flex-1 justify-end min-w-0">
            <UserMenu />
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
            locationOpen={openSection === "location"}
            datesOpen={openSection === "dates"}
            guestsOpen={openSection === "guests"}
            onLocationOpenChange={(o) => handleOpenChange("location", o)}
            onDatesOpenChange={(o) => handleOpenChange("dates", o)}
            onGuestsOpenChange={(o) => handleOpenChange("guests", o)}
            onClose={handleSearchClose}
          />
        )}
      </div>
    </header>
  );
}
