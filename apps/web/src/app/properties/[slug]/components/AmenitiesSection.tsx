"use client";

import { AmenityIcon } from "./AmenityIcon";
import type { Property } from "./types";

export function AmenitiesSection({ property }: { property: Property }) {
  if (!property.facilities?.length) return null;
  return (
    <section id="amenities" className="mt-6">
      <h3 className="text-xl font-semibold mb-6">Amenities & Facilities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {property.facilities?.map((facility) => (
          <div key={facility.id} className="flex items-center gap-2">
            <AmenityIcon amenity={facility.facility} />
          </div>
        ))}
      </div>
    </section>
  );
}
