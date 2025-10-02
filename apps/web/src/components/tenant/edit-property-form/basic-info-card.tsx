"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";
import React from "react";

type Props = {
  values: {
    name: string;
    description: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export function BasicInfoCard({ values, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          Basic Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Essential details about your property
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Property Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={onChange}
            placeholder="Enter a unique and descriptive property name"
            maxLength={100}
            required
            className="focus-visible:border-primary/80 focus-visible:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            {values.name.length}/100 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description *
          </Label>
          <Textarea
            id="description"
            name="description"
            value={values.description}
            onChange={onChange}
            placeholder="Describe your property's unique features, amenities, and what makes it special..."
            className="min-h-[120px] resize-none focus-visible:border-primary/80 focus-visible:ring-primary/20"
            required
          />
          <p className="text-xs text-muted-foreground">
            Highlight what makes your property unique and appealing to guests
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
