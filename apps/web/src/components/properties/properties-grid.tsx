import type { Property } from "@/types/property";
import { PropertyCard } from "./property-card";

interface PropertiesGridProps {
  properties: Property[];
}

export function PropertiesGrid({ properties }: PropertiesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
