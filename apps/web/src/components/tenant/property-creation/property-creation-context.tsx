"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CreatePropertyInput } from "@repo/schemas";
import { usePropertyCreation as usePropertyCreationHook } from "@/hooks/usePropertyCreation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type PropertyFormData = Partial<CreatePropertyInput> & {
  selectedCategory?: "existing" | "custom" | "new";
  facilities?: Array<string | { facility: string; note?: string | null }>;
  pictures?: Array<
    | string
    | {
        url?: string;
        imageUrl?: string;
        description?: string;
        note?: string | null;
      }
  >;
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
  const { data: session } = useSession();
  const { createProperty, isCreating } = usePropertyCreationHook();

  const [formData, setFormData] = useState<PropertyFormData>({
    facilities: [],
    pictures: [],
    rooms: [],
  });
  const [currentStep, setCurrentStep] = useState(1);

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
        return true; // Facilities are optional
      case 6:
        return !!(formData.pictures && formData.pictures.length > 0);
      case 7:
        return (
          !!(formData.name && formData.description && formData.maxGuests) &&
          !!(formData.country && formData.city && formData.address) &&
          !!(
            formData.propertyCategoryId ||
            formData.customCategoryId ||
            formData.customCategory
          ) &&
          !!(formData.rooms && formData.rooms.length > 0) &&
          !!(formData.pictures && formData.pictures.length > 0)
        );
      default:
        return false;
    }
  };

  const submitForm = async (): Promise<void> => {
    if (!session?.user) {
      toast.error("You must be logged in to create a property");
      return;
    }

    console.log("Session user:", session.user);
    console.log("Session user.id:", session.user.id);
    console.log("Raw form data:", formData);

    // Transform the data to match API schema
    const propertyData = {
      tenantId: session.user.id,
      name: formData.name || "",
      description: formData.description || "",
      country: formData.country || "",
      city: formData.city || "",
      address: formData.address || "",
      latitude: formData.latitude,
      longitude: formData.longitude,
      maxGuests: formData.maxGuests || 1,
      // Handle category selection
      ...(formData.propertyCategoryId
        ? { propertyCategoryId: formData.propertyCategoryId }
        : formData.customCategoryId
        ? { customCategoryId: formData.customCategoryId }
        : formData.customCategory
        ? { customCategory: formData.customCategory }
        : {}),
      // Transform facilities to correct format
      facilities: (formData.facilities || []).map(
        (facility: string | { facility: string; note?: string | null }) => ({
          facility: typeof facility === "string" ? facility : facility.facility,
          note: typeof facility === "object" ? facility.note : null,
        })
      ),
      // Transform pictures to correct format
      pictures: (formData.pictures || []).map(
        (
          picture:
            | string
            | {
                url?: string;
                imageUrl?: string;
                description?: string;
                note?: string | null;
              }
        ) => ({
          imageUrl:
            typeof picture === "string"
              ? picture
              : picture.url || picture.imageUrl,
          note:
            typeof picture === "object"
              ? picture.description || picture.note
              : null,
        })
      ),
      // Transform rooms (they should already be in correct format)
      rooms: formData.rooms || [],
    };

    console.log(
      "Transformed property data:",
      JSON.stringify(propertyData, null, 2)
    );

    await createProperty(propertyData);
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
