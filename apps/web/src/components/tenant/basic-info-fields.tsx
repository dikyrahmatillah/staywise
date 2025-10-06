"use client";

import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  nameValue: string;
  descriptionValue: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onUpdate?: (next: { name?: string; description?: string }) => void;
};

export function BasicInfoFields({
  nameValue,
  descriptionValue,
  onChange,
  onUpdate,
}: Props) {
  const nameProgress = useMemo(() => {
    const length = nameValue?.length || 0;
    return Math.min((length / 100) * 100, 100);
  }, [nameValue]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center">
          <div>
            <Label htmlFor="name">Property Name</Label>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            id="name"
            name="name"
            value={nameValue}
            onChange={(e) => {
              if (onChange) onChange(e);
              if (onUpdate) {
                const target = e.target as HTMLInputElement;
                onUpdate({ name: target.value });
              }
            }}
            placeholder="e.g., Luxury Beachfront Villa with Ocean Views"
            className="h-12 text-sm border-2 border-slate-200 focus:ring-2 focus-visible:border-primary/50 focus-visible:ring-primary/10 transition-all duration-200"
            maxLength={100}
            required
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {nameValue?.length || 0} of 100 characters
              </span>
              <span
                className={`text-xs font-medium ${
                  nameProgress > 90
                    ? "text-amber-600"
                    : nameProgress > 80
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {nameProgress.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  nameProgress > 90
                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : nameProgress > 80
                    ? "bg-gradient-to-r from-orange-400 to-red-500"
                    : "bg-gradient-to-r from-green-400 to-emerald-500"
                }`}
                style={{ width: `${nameProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <div>
            <Label htmlFor="description">Property Description</Label>
          </div>
        </div>

        <div className="space-y-3">
          <Textarea
            id="description"
            name="description"
            value={descriptionValue}
            onChange={(e) => {
              if (onChange) onChange(e);
              if (onUpdate) {
                const target = e.target as HTMLTextAreaElement;
                onUpdate({ description: target.value });
              }
            }}
            placeholder="Tell guests about your property's unique features, location highlights, amenities, and what makes it special..."
            rows={5}
            className="flex min-h-[120px] w-full rounded-lg border-2 border-slate-200 bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all duration-200 resize-none"
            required
          />
        </div>
      </div>
    </div>
  );
}

export default BasicInfoFields;
