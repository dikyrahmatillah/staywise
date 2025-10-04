import type { CreatePropertyInput } from "@repo/schemas";

export type PictureFormData =
  | string
  | {
      url?: string;
      imageUrl?: string;
      description?: string;
      note?: string | null;
      file?: File;
    };

export type RoomFormData = {
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

export type PropertyFormData = Partial<CreatePropertyInput> & {
  selectedCategory?: "existing" | "custom";
  facilities?: Array<string | { facility: string }>;
  pictures?: Array<PictureFormData>;
  rooms?: Array<RoomFormData>;
};

export interface PropertyCreationContextValue {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
}
