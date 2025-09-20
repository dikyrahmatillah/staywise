"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import type { BedType } from "@/types/room";

interface Props {
  formData: any;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<any>) => void;
  handleSelectChange: (value: BedType) => void;
  bedTypeOptions: { value: BedType; label: string }[];
  room?: any;
}

export default function RoomDetails({
  formData,
  errors,
  isSubmitting,
  handleInputChange,
  handleSelectChange,
  bedTypeOptions,
  room,
}: Props) {
  return (
    <TabsContent value="room">
      <div className="space-y-2">
        <Label htmlFor="name">Room Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter room name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2 mt-4">
        <Label htmlFor="description">Description (optional)</Label>
        <textarea
          id="description"
          name="description"
          placeholder="A short description of the room"
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none"
          value={formData.description}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2 mt-4">
        <Label htmlFor="price">Price (per night)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="0"
          min={0}
          value={formData.price}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            placeholder="1"
            min={0}
            value={formData.capacity}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          {errors.capacity && (
            <p className="text-sm text-red-500">{errors.capacity}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedCount">Bed Count</Label>
          <Input
            id="bedCount"
            name="bedCount"
            type="number"
            placeholder="1"
            min={0}
            value={formData.bedCount}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          {errors.bedCount && (
            <p className="text-sm text-red-500">{errors.bedCount}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <Label htmlFor="bedType">Bed Type</Label>
        <Select
          onValueChange={handleSelectChange}
          value={formData.bedType}
          disabled={isSubmitting}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Select bed type" />
          </SelectTrigger>
          <SelectContent>
            {bedTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.bedType && <p className="text-sm text-red-500">{errors.bedType}</p>}
      </div>
    </TabsContent>
  );
}
