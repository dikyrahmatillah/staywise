"use client";

import React from "react";

type SkeletonCardProps = {
  className?: string;
};

export default function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`block ${className}`}>
      <div className="overflow-hidden py-0 transition-shadow border bg-white shadow-sm rounded-2xl">
        <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden animate-pulse" />
        <div className="px-3 py-3">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-1/2 mb-3 animate-pulse" />
          <div className="h-10 bg-slate-200 rounded w-full mb-2 animate-pulse" />
          <div className="flex items-center justify-between">
            <div className="h-5 bg-slate-200 rounded w-1/3 animate-pulse" />
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
