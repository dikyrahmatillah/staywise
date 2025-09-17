import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

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
        className={inputClassName}
        autoComplete="off"
      />
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
