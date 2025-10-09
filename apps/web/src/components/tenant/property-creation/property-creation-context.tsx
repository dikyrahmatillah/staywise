"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { usePropertyCreation as usePropertyCreationHook } from "@/hooks/usePropertyCreation";
import { buildPropertyFormData } from "./form-data-builder";
import type {
  PropertyFormData,
  PropertyCreationContextValue,
  PictureFormData,
} from "./types";

const PropertyCreationContext = createContext<
  PropertyCreationContextValue | undefined
>(undefined);

interface PropertyCreationProviderProps {
  children: ReactNode;
}

export const PropertyCreationProvider = ({
  children,
}: PropertyCreationProviderProps) => {
  const { data: session } = useSession();
  const { createProperty, isCreating } = usePropertyCreationHook();
  const router = useRouter();

  const [formData, setFormData] = useState<PropertyFormData>({
    facilities: [],
    pictures: [],
    rooms: [],
  });
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (data: Partial<PropertyFormData>): void => {
    setFormData((prev: PropertyFormData) => ({ ...prev, ...data }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.description);
      case 2:
        return !!(formData.country && formData.city && formData.address);
      case 3:
        return !!formData.propertyCategoryId;
      case 4:
        return true;
      case 5:
        if (!formData.pictures || formData.pictures.length === 0) return false;
        return formData.pictures.some((picture: PictureFormData) => {
          if (typeof picture === "string") return true;
          if (typeof picture === "object") {
            return !!(picture.file || picture.url || picture.imageUrl);
          }
          return false;
        });
      case 6:
        return !!(formData.rooms && formData.rooms.length > 0);
      case 7:
        if (!formData.name || !formData.description) return false;
        if (!formData.country || !formData.city || !formData.address)
          return false;
        if (!formData.propertyCategoryId) return false;
        if (!(formData.rooms && formData.rooms.length > 0)) return false;
        if (!formData.pictures || formData.pictures.length === 0) return false;
        return formData.pictures.some((picture: PictureFormData) => {
          if (typeof picture === "string") return true;
          if (typeof picture === "object") {
            return !!(picture.file || picture.url || picture.imageUrl);
          }
          return false;
        });
      default:
        return false;
    }
  };

  const submitForm = async (): Promise<void> => {
    if (!session?.user) {
      toast.error("You must be logged in to create a property");
      return;
    }

    if (!formData.propertyCategoryId) {
      toast.error("Please select a default category before continuing");
      return;
    }

    const formDataToSend = buildPropertyFormData(formData, session.user.id);

    const result = await createProperty(formDataToSend);
    if (result) {
      router.push("/dashboard/tenant/properties");
      router.refresh();
    }
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
        isSubmitting: isCreating,
      }}
    >
      {children}
    </PropertyCreationContext.Provider>
  );
};

export const usePropertyCreation = (): PropertyCreationContextValue => {
  const context = useContext(PropertyCreationContext);

  if (context === undefined) {
    throw new Error(
      "usePropertyCreation must be used within a PropertyCreationProvider"
    );
  }

  return context;
};
