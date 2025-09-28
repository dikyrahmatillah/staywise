"use client";

import { memo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiMinus, FiPlus } from "react-icons/fi";
import { GuestCounterProps } from "./types";

export const GuestCounter = memo(function GuestCounter({
  label,
  subtitle,
  value,
  onDec,
  onInc,
  disableDec,
}: GuestCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    if (value !== displayValue) {
      setDirection(value > displayValue ? "up" : "down");
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

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
        <div className="relative w-8 h-6 overflow-hidden">
          <span
            className={`absolute inset-0 flex items-center justify-center font-medium transition-transform duration-150 ease-in-out ${
              isAnimating
                ? direction === "up"
                  ? "-translate-y-full"
                  : "translate-y-full"
                : "translate-y-0"
            }`}
          >
            {displayValue}
          </span>
          {isAnimating && (
            <span
              className={`absolute inset-0 flex items-center justify-center font-medium transition-transform duration-150 ease-in-out ${
                direction === "up" ? "translate-y-full" : "-translate-y-full"
              }`}
            >
              {value}
            </span>
          )}
        </div>
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
