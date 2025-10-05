import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface BasicInfoSectionProps {
  name?: string;
  description?: string;
  maxGuests: number;
  onEdit: () => void;
}

export const BasicInfoSection = ({
  name,
  description,
  maxGuests,
  onEdit,
}: BasicInfoSectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Building2 className="w-5 h-5 text-gray-500" />
      <Label className="text-base font-medium">Basic Information</Label>
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
    <div className="ml-7 space-y-2">
      <p>
        <span className="font-medium">Name:</span> {name || "Not set"}
      </p>
      <p>
        <span className="font-medium">Description:</span>{" "}
        {description || "Not set"}
      </p>
      <p>
        <span className="font-medium">Maximum Guests:</span> {maxGuests}
      </p>
    </div>
  </div>
);
