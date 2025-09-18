"use client";

import React from "react";
import type { GetPropertiesQuery } from "@repo/schemas";

interface PaginationProps {
  totalPages: number;
  params: GetPropertiesQuery;
  onPage: (page: number) => void;
}

export function Pagination({ totalPages, params, onPage }: PaginationProps) {
  const currentPage = params.page || 1;
  const currentIndex = currentPage - 1; // Convert to 0-based index for progress calculation
  const maxIndex = totalPages - 1; // Convert to 0-based index

  const trackRef = React.useRef<HTMLDivElement | null>(null);

  if (totalPages <= 1) return null;

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const targetPage = Math.round(ratio * maxIndex) + 1; // Convert back to 1-based page
    onPage(targetPage);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted-foreground text-center">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div
            ref={trackRef}
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalPages}
            aria-valuenow={currentPage}
            className="w-full h-2 bg-slate-100 rounded overflow-hidden cursor-pointer"
          >
            <div
              className="h-2 bg-primary transition-[width] duration-300"
              style={{
                width:
                  maxIndex > 0 ? `${(currentIndex / maxIndex) * 100}%` : "0%",
              }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            aria-label="Previous page"
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="h-9 w-9 rounded bg-white flex items-center justify-center disabled:opacity-50"
          >
            ‹
          </button>
          <button
            aria-label="Next page"
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="h-9 w-9 rounded bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
