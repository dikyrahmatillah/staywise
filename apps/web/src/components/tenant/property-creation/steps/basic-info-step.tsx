import { usePropertyCreation } from "../property-creation-context";
import BasicInfoFields from "@/components/tenant/basic-info-fields";
import React from "react";

export function BasicInfoStep() {
  const { formData, updateFormData } = usePropertyCreation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement & HTMLTextAreaElement;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-8">
      <BasicInfoFields
        nameValue={formData.name}
        descriptionValue={formData.description}
        onChange={handleChange}
      />
    </div>
  );
}
