import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { Property } from "./types";
import type { CreateFacilityInput, AmenityType } from "@repo/schemas";
import FacilitiesEditor from "@/components/tenant/facilities-editor";

type Props = {
  property?: Property;
  selected?: CreateFacilityInput[];
  onChange?: (selected: CreateFacilityInput[]) => void;
};

export function FacilitiesCard({
  property,
  selected: controlledSelected,
  onChange,
}: Props) {
  const toCreateFacility = (
    f: string | { facility?: string }
  ): CreateFacilityInput =>
    typeof f === "string"
      ? { facility: f as AmenityType }
      : { facility: (f.facility as string) || "" };

  const initial: CreateFacilityInput[] =
    controlledSelected ??
    (property?.Facilities || []).map(
      (f: string | { facility?: string; note?: string | null }) =>
        toCreateFacility(f)
    );

  const [selected, setSelected] = useState<CreateFacilityInput[]>(initial);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (controlledSelected) {
      setSelected(controlledSelected);
      return;
    }
    const mapped: CreateFacilityInput[] = (property?.Facilities || []).map(
      (f: string | { facility?: string; note?: string | null }) =>
        toCreateFacility(f)
    );
    setSelected(mapped);
  }, [property, controlledSelected]);

  const selectedFacilities = selected.map((f) => f.facility);

  const updateSelected = (next: CreateFacilityInput[]) => {
    setSelected(next);
    if (onChange) {
      onChange(next);
    }
  };

  const handleFacilityToggle = (facility: string) => {
    const isSelected = selectedFacilities.includes(facility);
    if (isSelected) {
      updateSelected(selected.filter((f) => f.facility !== facility));
    } else {
      updateSelected([...selected, { facility: facility as AmenityType }]);
    }
  };

  return (
    <Card>
      <CardHeader className="mb-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Facilities & Amenities
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select amenities available at this property
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FacilitiesEditor
          selected={selected}
          onToggle={handleFacilityToggle}
          query={query}
          setQuery={setQuery}
        />
      </CardContent>
    </Card>
  );
}
