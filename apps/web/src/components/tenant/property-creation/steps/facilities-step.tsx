import React from "react";
import { usePropertyCreation } from "../property-creation-context";
import { FacilitiesCard } from "@/components/tenant/edit-property-form/facilities-card";

export function FacilitiesStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const facilities = formData.facilities || [];

  return (
    <FacilitiesCard
      selected={facilities}
      onChange={(next) => updateFormData({ facilities: next })}
    />
  );
}
