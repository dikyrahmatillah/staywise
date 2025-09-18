"use client";

import React from "react";

type Props = {
  current: number;
  maxIndex: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  onJump?: (index: number) => void;
};

export default function PagerControls({
  current,
  maxIndex,
  onPrev,
  onNext,
  className = "",
  onJump,
}: Props) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);

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

      <div className="flex gap-2">
        <button
          aria-label="Previous"
          onClick={onPrev}
          disabled={current === 0}
          className="h-9 w-9 rounded bg-white flex items-center justify-center disabled:opacity-50"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={onNext}
          disabled={current === maxIndex}
          className="h-9 w-9 rounded bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90"
        >
          ›
        </button>
      </div>
    </div>
  );
}
