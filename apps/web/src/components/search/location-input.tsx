"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => {
        locationInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "flex-1 min-w-0 py-2 px-3 sm:px-6 text-left h-12 sm:h-14 items-center overflow-hidden cursor-pointer",
            isOpen ? "bg-gray-100" : "bg-transparent"
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
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearch();
                  }
                }}
                className="rounded-none border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus-visible:ring-0 h-auto w-full truncate min-w-0"
              />
            </div>
            {location && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLocationChange("")}
                className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
                aria-label="Clear location"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </PopoverTrigger>
    </Popover>
  );
}
