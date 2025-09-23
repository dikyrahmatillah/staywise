"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CreatePropertyInput } from "@repo/schemas";
import { usePropertyCreation as usePropertyCreationHook } from "@/hooks/usePropertyCreation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type PictureFormData =
  | string
  | {
      url?: string;
      imageUrl?: string;
      description?: string;
      note?: string | null;
      file?: File;
    };

type RoomFormData = {
  name: string;
  description?: string;
  basePrice: number;
  capacity?: number;
  bedType?: "KING" | "QUEEN" | "SINGLE" | "TWIN";
  bedCount?: number;
  imageUrl?: string;
  imageFile?: File;
  availabilities?: Array<{
    date: string;
    isAvailable?: boolean;
  }>;
  priceAdjustments?: Array<{
    title?: string;
    startDate: string;
    endDate: string;
    adjustType: "PERCENTAGE" | "NOMINAL";
    adjustValue: number;
    applyAllDates?: boolean;
    dates?: string[];
  }>;
};

type PropertyFormData = Partial<CreatePropertyInput> & {
  selectedCategory?: "existing" | "custom" | "new";
  facilities?: Array<string | { facility: string; note?: string | null }>;
  pictures?: Array<PictureFormData>;
  rooms?: Array<RoomFormData>;
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
        return !!(formData.name && formData.description);
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
        return !!(
          formData.pictures &&
          formData.pictures.length > 0 &&
          formData.pictures.some(
            (picture: PictureFormData) =>
              (typeof picture === "object" && picture.file) ||
              typeof picture === "string" ||
              (typeof picture === "object" && (picture.url || picture.imageUrl))
          )
        );
      case 7:
        return (
          !!(formData.name && formData.description) &&
          !!(formData.country && formData.city && formData.address) &&
          !!(
            formData.propertyCategoryId ||
            formData.customCategoryId ||
            formData.customCategory
          ) &&
          !!(formData.rooms && formData.rooms.length > 0) &&
          !!(
            formData.pictures &&
            formData.pictures.length > 0 &&
            formData.pictures.some(
              (picture: PictureFormData) =>
                (typeof picture === "object" && picture.file) ||
                typeof picture === "string" ||
                (typeof picture === "object" &&
                  (picture.url || picture.imageUrl))
            )
          )
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

    // Create FormData for file uploads
    const formDataToSend = new FormData();

    // Add basic property data
    formDataToSend.append("tenantId", session.user.id);
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("country", formData.country || "");
    formDataToSend.append("city", formData.city || "");
    formDataToSend.append("address", formData.address || "");

    if (formData.latitude)
      formDataToSend.append("latitude", String(formData.latitude));
    if (formData.longitude)
      formDataToSend.append("longitude", String(formData.longitude));

    // Handle category selection
    if (formData.propertyCategoryId) {
      formDataToSend.append("propertyCategoryId", formData.propertyCategoryId);
    } else if (formData.customCategoryId) {
      formDataToSend.append("customCategoryId", formData.customCategoryId);
    } else if (formData.customCategory) {
      formDataToSend.append(
        "customCategory",
        JSON.stringify(formData.customCategory)
      );
    }

    // Handle facilities
    if (formData.facilities && formData.facilities.length > 0) {
      formDataToSend.append(
        "facilities",
        JSON.stringify(
          formData.facilities.map(
            (
              facility: string | { facility: string; note?: string | null }
            ) => ({
              facility:
                typeof facility === "string" ? facility : facility.facility,
              note: typeof facility === "object" ? facility.note : null,
            })
          )
        )
      );
    }

    // Handle property pictures - append files and notes
    const propertyPictures: Array<{
      note?: string | null;
      fileIndex?: number;
    }> = [];
    let propertyFileIndex = 0;

    if (formData.pictures && formData.pictures.length > 0) {
      formData.pictures.forEach((picture: PictureFormData) => {
        if (typeof picture === "object" && picture.file) {
          formDataToSend.append(`propertyImages`, picture.file);
          propertyPictures.push({
            note: picture.description || picture.note || null,
            fileIndex: propertyFileIndex++,
          });
        } else if (typeof picture === "string") {
          // Handle existing URL case (shouldn't happen in new flow but keeping for safety)
          propertyPictures.push({ note: null });
        } else if (
          typeof picture === "object" &&
          (picture.url || picture.imageUrl)
        ) {
          // Handle existing URL case (shouldn't happen in new flow but keeping for safety)
          propertyPictures.push({
            note: picture.description || picture.note || null,
          });
        }
      });
    }

    if (propertyPictures.length > 0) {
      formDataToSend.append(
        "propertyPictures",
        JSON.stringify(propertyPictures)
      );
    }

    // Handle rooms with their images
    const roomsData: Array<{
      name: string;
      description?: string;
      basePrice: number;
      capacity?: number;
      bedType?: string;
      bedCount?: number;
      hasImage?: boolean;
      fileIndex?: number;
      availabilities?: Array<{ date: string; isAvailable?: boolean }>;
      priceAdjustments?: Array<{
        title?: string;
        startDate: string;
        endDate: string;
        adjustType: string;
        adjustValue: number;
        applyAllDates?: boolean;
        dates?: string[];
      }>;
    }> = [];

    let roomFileIndex = 0;

    if (formData.rooms && formData.rooms.length > 0) {
      formData.rooms.forEach((room: RoomFormData) => {
        const roomData: {
          name: string;
          description?: string;
          basePrice: number;
          capacity?: number;
          bedType?: string;
          bedCount?: number;
          hasImage?: boolean;
          fileIndex?: number;
          availabilities?: Array<{ date: string; isAvailable?: boolean }>;
          priceAdjustments?: Array<{
            title?: string;
            startDate: string;
            endDate: string;
            adjustType: string;
            adjustValue: number;
            applyAllDates?: boolean;
            dates?: string[];
          }>;
        } = {
          name: room.name,
          description: room.description,
          basePrice: room.basePrice,
          capacity: room.capacity || 1,
          bedType: room.bedType,
          bedCount: room.bedCount || 1,
          availabilities: room.availabilities || [],
          priceAdjustments: room.priceAdjustments || [],
        };

        if (room.imageFile) {
          formDataToSend.append(`roomImages`, room.imageFile);
          roomData.hasImage = true;
          roomData.fileIndex = roomFileIndex++;
        } else if (room.imageUrl) {
          // Handle existing URL case (shouldn't happen in new flow but keeping for safety)
          roomData.hasImage = false;
        }

        roomsData.push(roomData);
      });
    }

    formDataToSend.append("rooms", JSON.stringify(roomsData));

    console.log("FormData prepared for submission");

    await createProperty(formDataToSend);
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
