"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CreatePropertyInput } from "@repo/schemas";

type PropertyFormData = Partial<CreatePropertyInput> & {
  selectedCategory?: "existing" | "custom" | "new";
};

interface PropertyCreationContextType {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
}

const PropertyCreationContext = createContext<
  PropertyCreationContextType | undefined
>(undefined);

export function PropertyCreationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [formData, setFormData] = useState<PropertyFormData>({
    facilities: [],
    pictures: [],
    rooms: [],
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (data: Partial<PropertyFormData>) => {
    setFormData((prev: PropertyFormData) => ({ ...prev, ...data }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.description && formData.maxGuests);
      case 2:
        return !!(formData.country && formData.city && formData.address);
      case 3:
        return !!(
          formData.propertyCategoryId ||
          formData.customCategoryId ||
          formData.customCategory
        );
      case 4:
        return !!(formData.rooms && formData.rooms.length > 0);
      case 5:
        return true;
      case 6:
        return !!(formData.pictures && formData.pictures.length > 0);
      case 7:
        return true;
      default:
        return false;
    }
  };

  const submitForm = async (): Promise<void> => {
    setIsSubmitting(true);
  };

  return (
    <PropertyCreationContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        isStepValid,
        submitForm,
        isSubmitting,
      }}
    >
      {children}
    </PropertyCreationContext.Provider>
  );
}

export function usePropertyCreation() {
  const context = useContext(PropertyCreationContext);
  if (context === undefined) {
    throw new Error(
      "usePropertyCreation must be used within a PropertyCreationProvider"
    );
  }
  return context;
}
