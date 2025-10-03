import React from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FacilitiesCard } from "@/components/tenant/edit-property-form/facilities-card";

export function FacilitiesStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const facilities = formData.facilities || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facilities & Amenities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FacilitiesCard
          selected={facilities}
          onChange={(next) => updateFormData({ facilities: next })}
        />
      </CardContent>
    </Card>
  );
}
