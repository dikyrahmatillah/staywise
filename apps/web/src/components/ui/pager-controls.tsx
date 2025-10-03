"use client";

import React from "react";

type Props = {
  current: number;
  maxIndex: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  onJump?: (index: number) => void;
  nextLabel?: string;
  prevLabel?: string;
  canGoNext?: boolean;
  canGoPrev?: boolean;
  isLoading?: boolean;
};

export default function PagerControls({
  current,
  maxIndex,
  onPrev,
  onNext,
  className = "",
  onJump,
  nextLabel,
  prevLabel,
  canGoNext = true,
  canGoPrev = true,
  isLoading = false,
}: Props) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  const prevDisabled = current === 0 || !canGoPrev || isLoading;
  const nextDisabled = !canGoNext || isLoading;

  const handleClick = (e: React.MouseEvent) => {
    if (!trackRef.current || typeof onJump !== "function") return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(ratio * maxIndex);
    onJump(index);
  };

  return (
    <div className={`flex items-center gap-4 mt-4 ${className}`}>
      <div className="flex-1">
        <div
          ref={trackRef}
          onClick={handleClick}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={current}
          className="w-full h-2 bg-slate-100 rounded overflow-hidden cursor-pointer"
        >
          <div
            className="h-2 bg-primary transition-[width] duration-300"
            style={{
              width: maxIndex > 0 ? `${(current / maxIndex) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          aria-label={prevLabel || "Previous"}
          onClick={onPrev}
          disabled={prevDisabled}
          className={`rounded-md border-2 bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors w-10 h-10 ${
            prevDisabled ? "" : "cursor-pointer"
          }`}
        >
          <span aria-hidden="true" className="text-lg">
            ‹
          </span>
        </button>
        <button
          aria-label={nextLabel || "Next"}
          onClick={onNext}
          disabled={nextDisabled}
          className={`rounded-md bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors relative ${
            nextLabel ? "px-4 py-2 min-w-[140px]" : "w-10 h-10"
          } ${nextDisabled ? "" : "cursor-pointer"}`}
        >
          {isLoading ? (
            nextLabel ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                Creating...
              </>
            ) : (
              <div
                className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"
                aria-hidden="true"
              />
            )
          ) : nextLabel ? (
            <span>{nextLabel}</span>
          ) : (
            <span aria-hidden="true" className="text-lg">
              ›
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
