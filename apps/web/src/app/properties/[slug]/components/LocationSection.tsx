"use client";

// MapPin removed - using embedded Google Maps instead

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
    <section id="location">
      <h3 className="text-xl font-semibold mb-4">Location</h3>

      <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden">
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
      </div>
    </section>
  );
}
