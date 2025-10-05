"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicInfoFields from "../basic-info-fields";
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
  onUpdate?: (next: { name?: string; description?: string }) => void;
};

export function BasicInfoCard({ values, onChange, onUpdate }: Props) {
  return (
    <Card>
      <CardHeader className="mb-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          Basic Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Essential details about your property
        </p>
      </CardHeader>
      <CardContent>
        <BasicInfoFields
          nameValue={values.name}
          descriptionValue={values.description}
          onChange={onChange}
          onUpdate={onUpdate}
        />
      </CardContent>
    </Card>
  );
}
