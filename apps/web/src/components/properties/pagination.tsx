"use client";

import React from "react";
import type { GetPropertiesQuery } from "@/schemas";
import PagerControls from "@/components/ui/pager-controls";

interface PaginationProps {
  totalPages: number;
  params: GetPropertiesQuery;
  onPage: (page: number) => void;
}

export function Pagination({ totalPages, params, onPage }: PaginationProps) {
  const currentPage = params.page || 1;
  const currentIndex = currentPage - 1;
  const maxIndex = totalPages - 1;

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPage(currentPage + 1);
  };

  const handleJump = (index: number) => {
    const targetPage = Math.max(0, Math.min(maxIndex, index)) + 1;
    onPage(targetPage);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted-foreground text-center">
        Page {currentPage} of {totalPages}
      </div>

      <PagerControls
        current={currentIndex}
        maxIndex={maxIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onJump={handleJump}
      />
    </div>
  );
}
