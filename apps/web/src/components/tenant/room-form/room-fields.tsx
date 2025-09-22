"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bedTypeOptions } from "./constants";
import type { BedType } from "@/types/room";
import type { RoomFormErrors, RoomFormState } from "./types";

type Props = {
  values: RoomFormState;
  errors: RoomFormErrors;
  disabled?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (value: BedType) => void;
};

export function RoomFields({
  values,
  errors,
  disabled,
  onChange,
  onSelectChange,
}: Props) {
  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor="name">Room Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter room name"
          value={values.name}
          onChange={onChange}
          disabled={disabled}
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
          value={values.description}
          onChange={onChange}
          disabled={disabled}
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
          placeholder="1"
          min={1}
          value={values.price}
          onChange={onChange}
          disabled={disabled}
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
            min={1}
            value={values.capacity}
            onChange={onChange}
            disabled={disabled}
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
            min={1}
            value={values.bedCount}
            onChange={onChange}
            disabled={disabled}
          />
          {errors.bedCount && (
            <p className="text-sm text-red-500">{errors.bedCount}</p>
          )}
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="bedType">Bed Type</Label>
        <Select
          onValueChange={onSelectChange}
          value={values.bedType}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select bed type" />
          </SelectTrigger>
          <SelectContent>
            {bedTypeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.bedType && (
          <p className="text-sm text-red-500">{errors.bedType}</p>
        )}
      </div>
    </div>
  );
}
