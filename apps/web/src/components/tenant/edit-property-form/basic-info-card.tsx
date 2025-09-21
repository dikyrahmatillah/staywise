"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import React from "react";

type Props = {
  values: {
    name: string;
    description: string;
    maxGuests: number;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export function BasicInfoCard({ values, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Property Name</Label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={onChange}
            placeholder="Enter property name"
            maxLength={100}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={onChange}
            placeholder="Describe your property..."
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxGuests">Maximum Guests</Label>
          <Input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min="1"
            value={values.maxGuests}
            onChange={onChange}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
