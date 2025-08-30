"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { FiMinus, FiPlus } from "react-icons/fi";

interface GuestCounterProps {
  label: string;
  subtitle: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  disableDec: boolean;
}

export const GuestCounter = memo(function GuestCounter({
  label,
  subtitle,
  value,
  onDec,
  onInc,
  disableDec,
}: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-sans font-semibold">{label}</div>
        <div className="text-xs font-sans text-gray-500">{subtitle}</div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full cursor-pointer"
          onClick={onDec}
          disabled={disableDec}
        >
          <FiMinus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full cursor-pointer"
          onClick={onInc}
        >
          <FiPlus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});
