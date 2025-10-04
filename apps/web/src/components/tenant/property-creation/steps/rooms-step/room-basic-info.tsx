import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BED_TYPES, RoomFormData } from "./types";

type Props = {
  formData: RoomFormData;
  onFieldChange: (field: string, value: string | number) => void;
};

export function RoomBasicInfo({ formData, onFieldChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="roomName" className="text-sm font-medium">
          Room Name *
        </Label>
        <Input
          id="roomName"
          value={formData.name || ""}
          onChange={(e) => onFieldChange("name", e.target.value)}
          placeholder="e.g., Deluxe Ocean View"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomDescription" className="text-sm font-medium">
          Description <span className="text-gray-400">(Optional)</span>
        </Label>
        <Textarea
          id="roomDescription"
          value={formData.description || ""}
          onChange={(e) => onFieldChange("description", e.target.value)}
          placeholder="Describe this room's features, amenities, and what makes it special..."
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="basePrice" className="text-sm font-medium">
              Base Price (per night) *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="basePrice"
                type="number"
                min={0}
                step={0.01}
                value={formData.basePrice || ""}
                onChange={(e) =>
                  onFieldChange("basePrice", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="capacity" className="text-sm font-medium">
              Guest
            </Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              value={formData.capacity ?? 1}
              onChange={(e) =>
                onFieldChange("capacity", parseInt(e.target.value || "1"))
              }
              className="h-11 max-w-[90px]"
            />
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="bedCount" className="text-sm font-medium">
              Beds
            </Label>
            <Input
              id="bedCount"
              type="number"
              min={1}
              value={formData.bedCount ?? 1}
              onChange={(e) =>
                onFieldChange("bedCount", parseInt(e.target.value || "1"))
              }
              className="h-11 max-w-[90px]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bedType" className="text-sm font-medium">
              Bed Type
            </Label>
            <Select
              value={formData.bedType || "KING"}
              onValueChange={(value) => onFieldChange("bedType", value)}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select bed type" />
              </SelectTrigger>
              <SelectContent>
                {BED_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomBasicInfo;
