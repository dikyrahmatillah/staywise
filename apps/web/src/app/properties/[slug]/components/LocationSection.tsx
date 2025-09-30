"use client";

import { MapPin } from "lucide-react";

export function LocationSection({
  address,
  city,
  latitude,
  longitude,
}: {
  address?: string | null;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
}) {
  return (
    <section id="location" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-slate-800">Location</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              {address ? `${address}, ${city}` : city}
            </span>
          </div>
        </div>

        <div className="aspect-[16/9] bg-slate-100 overflow-hidden relative group">
          {(() => {
            if (typeof latitude === "number" && typeof longitude === "number") {
              const fallback = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
              return (
                <iframe
                  title="Property location"
                  src={fallback}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              );
            }

            const query = encodeURIComponent(
              `${address ? address + ", " : ""}${city}`
            );
            const src = `https://www.google.com/maps?q=${query}&output=embed`;
            return (
              <iframe
                title="Property location"
                src={src}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
