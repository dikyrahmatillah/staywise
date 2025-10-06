import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onUseCurrentLocation: () => void;
  isLoading?: boolean;
  inputClassName?: string;
}

export function LocationSearchInput({
  value,
  onChange,
  onUseCurrentLocation,
  isLoading = false,
  inputClassName = "w-full",
}: Props) {
  return (
    <div className="relative flex items-center">
      <Input
        type="text"
        placeholder="Search for a location..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClassName} truncate overflow-hidden whitespace-nowrap pr-12 text-sm`}
        title={value}
        autoComplete="off"
      />
      {value && value.length > 0 && (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => onChange("")}
          className="absolute right-11 p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onUseCurrentLocation}
        disabled={isLoading}
        title="Use current location"
        className="ml-2"
      >
        <Navigation className="h-4 w-4" />
      </Button>
    </div>
  );
}
