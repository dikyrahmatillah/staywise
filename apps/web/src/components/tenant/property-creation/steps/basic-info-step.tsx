"use client";

import React from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import BasicInfoCard from "@/components/tenant/basic-info-fields";

export function BasicInfoStep() {
  const { formData, updateFormData } = usePropertyCreation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement & HTMLTextAreaElement;
    updateFormData({ [name]: value });
  };

  const handlePartialUpdate = (next: {
    name?: string;
    description?: string;
  }) => {
    updateFormData(next);
  };

  return (
    <Card>
      <CardHeader className="mb-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Basic Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Provide a name and short description for your property
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <BasicInfoCard
          nameValue={formData.name ?? ""}
          descriptionValue={formData.description ?? ""}
          onChange={handleChange}
          onUpdate={handlePartialUpdate}
        />
      </CardContent>
    </Card>
  );
}
