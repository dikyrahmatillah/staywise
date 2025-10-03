"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { CreateFacilityInput } from "@repo/schemas";

interface FacilitiesFormDialogProps {
  propertyId: string;
  onClose: () => void;
}

function FacilitiesEditor({ propertyId, onClose }: FacilitiesFormDialogProps) {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selected, setSelected] = useState<CreateFacilityInput[]>([]);
  const [query, setQuery] = useState("");

  const FACILITY_LABELS: Record<string, string> = {
    WIFI: "WiFi",
    AIR_CONDITIONER: "Air Conditioner",
    PARKING: "Parking",
    SWIMMING_POOL: "Swimming Pool",
    KITCHEN: "Kitchen",
    TV: "TV",
    WATER_HEATER: "Water Heater",
    WASHING_MACHINE: "Washing Machine",
    REFRIGERATOR: "Refrigerator",
    MICROWAVE: "Microwave",
    ELEVATOR: "Elevator",
    GYM: "Gym",
    RECEPTION_24H: "24h Reception",
    SECURITY: "Security",
    CCTV: "CCTV",
    PET_FRIENDLY: "Pet Friendly",
    SMOKING_ALLOWED: "Smoking Allowed",
    NON_SMOKING: "Non Smoking",
    WHEELCHAIR_ACCESS: "Wheelchair Access",
    BREAKFAST: "Breakfast",
    BALCONY: "Balcony",
    SEA_VIEW: "Sea View",
    MOUNTAIN_VIEW: "Mountain View",
    GARDEN: "Garden",
    BBQ: "BBQ",
  };

  const FACILITY_CATEGORIES: Record<string, string[]> = {
    "Basic Amenities": [
      "WIFI",
      "AIR_CONDITIONER",
      "PARKING",
      "KITCHEN",
      "TV",
      "WATER_HEATER",
    ],
    Appliances: ["WASHING_MACHINE", "REFRIGERATOR", "MICROWAVE"],
    Recreation: ["SWIMMING_POOL", "GYM", "BBQ", "GARDEN"],
    Services: ["RECEPTION_24H", "SECURITY", "CCTV", "BREAKFAST"],
    Accessibility: ["ELEVATOR", "WHEELCHAIR_ACCESS"],
    Policies: ["PET_FRIENDLY", "SMOKING_ALLOWED", "NON_SMOKING"],
    "Views & Spaces": ["SEA_VIEW", "MOUNTAIN_VIEW", "BALCONY"],
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get(`/properties/id/${propertyId}`);
        if (!mounted) return;
        const property = res.data;

        const existing: CreateFacilityInput[] = (property.facilities || []).map(
          (f: string | { facility?: string; note?: string | null }) =>
            typeof f === "string"
              ? { facility: f, note: null }
              : { facility: f.facility || "", note: f.note || null }
        );

        setSelected(existing);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load current facilities");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [propertyId]);

  const isSelected = (facility: string) =>
    selected.some((s) => s.facility === facility);

  const toggleFacility = (facility: string) => {
    if (isSelected(facility)) {
      setSelected((prev) => prev.filter((p) => p.facility !== facility));
    } else {
      setSelected((prev) => [...prev, { facility, note: null }]);
    }
  };

  const updateNote = (facility: string, note: string) => {
    setSelected((prev) =>
      prev.map((p) =>
        p.facility === facility ? { ...p, note: note || null } : p
      )
    );
  };

  const clearAll = () => setSelected([]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/properties/id/${propertyId}`, {
        facilities: selected,
      });

      toast.success("Facilities updated");
      qc.invalidateQueries({ queryKey: ["property", propertyId] });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update facilities");
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = Object.entries(FACILITY_CATEGORIES).reduce(
    (acc: Record<string, string[]>, [cat, items]) => {
      if (!query.trim()) {
        acc[cat] = items;
      } else {
        const q = query.toLowerCase();
        const matches = items.filter((key) =>
          FACILITY_LABELS[key].toLowerCase().includes(q)
        );
        if (matches.length) acc[cat] = matches;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading facilities...
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <input
              className="border rounded px-2 py-1 text-sm flex-1"
              placeholder="Search facilities (e.g., WiFi, Gym)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              disabled={selected.length === 0}
            >
              Clear
            </Button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {Object.entries(filteredCategories).map(([category, items]) => (
              <div key={category} className="mb-3">
                <div className="text-sm font-medium mb-1">{category}</div>
                <div className="grid grid-cols-1 gap-2">
                  {items.map((key) => (
                    <div key={key} className="p-1 border rounded">
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={isSelected(key)}
                            onChange={() => toggleFacility(key)}
                          />
                          <span className="font-medium">
                            {FACILITY_LABELS[key] || key}
                          </span>
                        </label>
                      </div>

                      {isSelected(key) && (
                        <textarea
                          placeholder={`Optional note for ${
                            FACILITY_LABELS[key] || key
                          }...`}
                          value={
                            selected.find((s) => s.facility === key)?.note || ""
                          }
                          onChange={(e) => updateNote(key, e.target.value)}
                          className="w-full mt-2 border rounded p-2 text-sm h-14 resize-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

export function FacilitiesFormDialog({
  propertyId,
  onClose,
}: FacilitiesFormDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Facilities</DialogTitle>
        <DialogDescription>
          Choose amenities and facilities for this property.
        </DialogDescription>
      </DialogHeader>

      <FacilitiesEditor propertyId={propertyId} onClose={onClose} />
    </DialogContent>
  );
}
