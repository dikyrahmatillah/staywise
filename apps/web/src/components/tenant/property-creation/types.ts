import type { CreatePropertyInput } from "@/schemas";

export type PictureFormData =
  | string
  | {
      url?: string;
      imageUrl?: string;
      description?: string;
      note?: string;
      file?: File;
      preview?: string;
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

export type PropertyFormData = Omit<
  Partial<CreatePropertyInput>,
  "pictures" | "facilities" | "rooms"
> & {
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
