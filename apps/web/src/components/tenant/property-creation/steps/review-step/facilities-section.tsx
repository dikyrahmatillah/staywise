import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFacilityInput } from "@repo/schemas/src/facility.schema.js";
import { Wind } from "lucide-react";

interface FacilitiesSectionProps {
  facilities?: CreateFacilityInput[];
  onEdit: () => void;
}

export const FacilitiesSection = ({
  facilities,
  onEdit,
}: FacilitiesSectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Wind className="w-5 h-5 text-gray-500" />
      <Label className="text-base font-medium">
        Facilities ({facilities?.length || 0})
      </Label>
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
    <div className="ml-7">
      {facilities && facilities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {facilities.map((facility, index) => (
            <Badge key={index} variant="secondary">
              {facility.facility
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No facilities selected</p>
      )}
    </div>
  </div>
);
