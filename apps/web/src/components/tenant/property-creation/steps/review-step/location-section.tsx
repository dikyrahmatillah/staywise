import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationSectionProps {
  country?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  onEdit: () => void;
}

export const LocationSection = ({
  country,
  city,
  address,
  latitude,
  longitude,
  onEdit,
}: LocationSectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <MapPin className="w-5 h-5 text-gray-500" />
      <Label className="text-base font-medium">Location</Label>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto"
        onClick={onEdit}
      >
        Edit
      </Button>
    </div>
    <div className="ml-7 space-y-2 text-sm">
      <p>
        <span>Country:</span> {country || "Not set"}
      </p>
      <p>
        <span>City:</span> {city || "Not set"}
      </p>
      <p>
        <span>Address:</span> {address || "Not set"}
      </p>
      {latitude && longitude && (
        <p>
          <span>Coordinates:</span> {latitude}, {longitude}
        </p>
      )}
    </div>
  </div>
);
