"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  Home,
  Plus,
  Minus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect, useRef } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const totalGuests = adults + children + pets;
  const [location, setLocation] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (location) {
      searchParams.set("location", location);
    }

    if (checkIn) {
      searchParams.set("checkIn", checkIn.toISOString());
    }

    if (checkOut) {
      searchParams.set("checkOut", checkOut.toISOString());
    }

    searchParams.set("adults", adults.toString());
    searchParams.set("children", children.toString());
    searchParams.set("pets", pets.toString());

    router.push(`/search?${searchParams.toString()}`);
    setIsSearchOpen(false);
  };

  useEffect(() => {
    if (!isSearchOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".search-container") &&
        !target.closest(".search-button")
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    if (locationOpen) {
      setTimeout(() => locationInputRef.current?.focus(), 0);
    }
  }, [locationOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white ",
        isSearchOpen ? "h-[120px]" : "h-16"
      )}
    >
      <div className="container mx-auto max-w-screen-2xl px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1">
            <Button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              variant="outline"
              className="search-button h-10 px-3 py-2 rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow justify-start text-left font-normal"
            >
              <Search className="ml-auto h-4 w-4 font-sans text-rose-500" />
              Search
            </Button>
          </div>

          <div className="flex items-center justify-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 font-sans text-rose-500" />
              <span className="font-bold text-xl text-rose-500 hidden sm:inline-block">
                StayWise
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 flex-1 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 px-3 rounded-full border-gray-300 hover:shadow-md transition-shadow"
                >
                  Login
                  <User className="h-6 w-6 bg-gray-500 rounded-full p-1 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-20">
                <DropdownMenuItem className="cursor-pointer">
                  <span>Guest</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Tenant</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isSearchOpen && (
          <div className="search-container absolute left-0 right-0 bg-white  rounded-b-2xl border border-gray-200 border-t-0 py-4 px-6">
            <div className="container flex items-center mx-auto max-w-3xl gap-4">
              <div className="flex rounded-2xl border border-gray-300 overflow-hidden flex-1 h-14">
                <Popover
                  open={locationOpen}
                  onOpenChange={(open) => {
                    setLocationOpen(open);
                    if (open) {
                      setDatesOpen(false);
                      setGuestsOpen(false);
                    }
                  }}
                  modal={false}
                >
                  <PopoverTrigger asChild>
                    <div
                      role="button"
                      tabIndex={0}
                      className={cn(
                        "flex-1 py-2 px-6 text-left h-14 items-center",
                        locationOpen ? "bg-gray-100" : "bg-transparent"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1">
                          <div className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                            Where
                          </div>
                          <Input
                            ref={locationInputRef}
                            placeholder="Search destinations"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSearch();
                              }
                            }}
                            className="rounded-none border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus-visible:ring-0 h-auto w-full"
                          />
                        </div>
                        {location && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocation("");
                            }}
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </PopoverTrigger>
                </Popover>

                <Popover
                  open={datesOpen}
                  onOpenChange={(open) => {
                    setDatesOpen(open);
                    if (open) {
                      setLocationOpen(false);
                      setGuestsOpen(false);
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <div
                      role="button"
                      tabIndex={0}
                      className={cn(
                        "flex-1 py-2 px-6 border-l border-gray-300 text-left h-14 items-center",
                        datesOpen ? "bg-gray-100" : "bg-transparent"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1">
                          <div className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                            When
                          </div>
                          <div
                            className={cn(
                              "text-sm",
                              checkIn && checkOut
                                ? "text-gray-900"
                                : "text-gray-400"
                            )}
                          >
                            {checkIn && checkOut
                              ? `${format(checkIn, "MMM d")} - ${format(
                                  checkOut,
                                  "MMM d"
                                )}`
                              : "Add dates"}
                          </div>
                        </div>
                        {(checkIn || checkOut) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCheckIn(undefined);
                              setCheckOut(undefined);
                            }}
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="p-4">
                      <div className="flex gap-4 items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentMonth(subMonths(currentMonth, 1));
                              }}
                              disabled={currentMonth <= new Date()}
                              className="h-8 w-8 rounded-full"
                            >
                              <ChevronLeft />
                            </Button>

                            <h4 className="text-sm font-semibold text-center w-full">
                              {format(currentMonth, "MMMM yyyy")}
                            </h4>
                          </div>

                          <CalendarComponent
                            mode="range"
                            selected={{ from: checkIn, to: checkOut }}
                            onSelect={(range) => {
                              if (range?.from) setCheckIn(range.from);
                              if (range?.to) setCheckOut(range.to);
                            }}
                            disabled={(date) => date < new Date()}
                            numberOfMonths={1}
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            className="w-full"
                            classNames={{
                              month_caption: "hidden",
                              nav: "hidden",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell:
                                "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] text-center",
                              row: "flex w-full mt-2",
                              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 focus-within:relative focus-within:z-20",
                              day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                              day_selected: "bg-black text-white rounded-md",
                              day_range_start:
                                "bg-black text-white rounded-l-md rounded-r-none",
                              day_range_end:
                                "bg-black text-white rounded-r-md rounded-l-none",
                              day_range_middle:
                                "bg-gray-100 text-gray-900 rounded-none",
                              day_today:
                                "bg-gray-100 text-gray-900 font-semibold",
                              day_outside: "text-gray-400 opacity-50",
                              day_disabled:
                                "text-gray-400 opacity-50 cursor-not-allowed",
                              day_hidden: "invisible",
                            }}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-center w-full">
                              {format(addMonths(currentMonth, 1), "MMMM yyyy")}
                            </h4>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setCurrentMonth(addMonths(currentMonth, 1))
                              }
                              className="h-8 w-8 rounded-full"
                            >
                              <ChevronRight />
                            </Button>
                          </div>

                          <CalendarComponent
                            mode="range"
                            selected={{ from: checkIn, to: checkOut }}
                            onSelect={(range) => {
                              if (range?.from) setCheckIn(range.from);
                              if (range?.to) setCheckOut(range.to);
                            }}
                            disabled={(date) => date < new Date()}
                            numberOfMonths={1}
                            month={addMonths(currentMonth, 1)}
                            onMonthChange={(m) =>
                              setCurrentMonth(subMonths(m, 1))
                            }
                            className="w-full"
                            classNames={{
                              month_caption: "hidden",
                              nav: "hidden",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell:
                                "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] text-center",
                              row: "flex w-full mt-2",
                              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 focus-within:relative focus-within:z-20",
                              day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                              day_selected: "bg-black text-white rounded-md",
                              day_range_start:
                                "bg-black text-white rounded-l-md rounded-r-none",
                              day_range_end:
                                "bg-black text-white rounded-r-md rounded-l-none",
                              day_range_middle:
                                "bg-gray-100 text-gray-900 rounded-none",
                              day_today:
                                "bg-gray-100 text-gray-900 font-semibold",
                              day_outside: "text-gray-400 opacity-50",
                              day_disabled:
                                "text-gray-400 opacity-50 cursor-not-allowed",
                              day_hidden: "invisible",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover
                  open={guestsOpen}
                  onOpenChange={(open) => {
                    setGuestsOpen(open);
                    if (open) {
                      setLocationOpen(false);
                      setDatesOpen(false);
                    }
                  }}
                  modal={false}
                >
                  <PopoverTrigger asChild>
                    <div
                      role="button"
                      tabIndex={0}
                      className={cn(
                        "flex-1 py-2 px-6 border-l border-gray-300 text-left h-14 flex items-center justify-between",
                        guestsOpen ? "bg-gray-100" : "bg-transparent"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wide mb-1">
                            Who
                          </div>
                          <div
                            className={cn(
                              "text-sm",
                              totalGuests === 0
                                ? "text-gray-400"
                                : "text-gray-900"
                            )}
                          >
                            {totalGuests === 0
                              ? "Add guest"
                              : `${adults} adult${adults > 1 ? "s" : ""}${
                                  children > 0
                                    ? `, ${children} child${
                                        children > 1 ? "ren" : ""
                                      }`
                                    : ""
                                }${
                                  pets > 0
                                    ? `, ${pets} pet${pets > 1 ? "s" : ""}`
                                    : ""
                                }`}
                          </div>
                        </div>
                        {totalGuests > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              // reset to sensible defaults: 1 adult, 0 children, 0 pets
                              setAdults(1);
                              setChildren(0);
                              setPets(0);
                            }}
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-4"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-sans font-semibold">
                            Adults
                          </div>
                          <div className="text-xs font-sans text-gray-500">
                            Ages 13 or above
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {adults}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setAdults(adults + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-sans font-semibold">
                            Children
                          </div>
                          <div className="text-xs font-sans text-gray-500">
                            Ages 2–12
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              setChildren(Math.max(0, children - 1))
                            }
                            disabled={children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {children}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setChildren(children + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Pets */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-sans font-semibold">
                            Pets
                          </div>
                          <div className="text-xs font-sans text-gray-500">
                            Service animals allowed
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setPets(Math.max(0, pets - 1))}
                            disabled={pets <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {pets}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setPets(pets + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <button
                onClick={handleSearch}
                className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-6 rounded-full flex items-center gap-2 text-sm font-medium transition-colors border border-gray-300 h-14"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
