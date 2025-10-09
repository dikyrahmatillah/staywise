import { BasicInfoStep } from "./steps/basic-info-step";
import { LocationStep } from "./steps/location-step";
import { CategoryStep } from "./steps/category-step";
import { RoomsStep } from "./steps/rooms-step";
import { FacilitiesStep } from "./steps/facilities-step";
import { PhotosStep } from "./steps/photos-step";
import { ReviewStep } from "./steps/review-step";

export function renderStepContent(currentStep: number) {
  switch (currentStep) {
    case 1:
      return <BasicInfoStep />;
    case 2:
      return <PhotosStep />;
    case 3:
      return <LocationStep />;
    case 4:
      return <CategoryStep />;
    case 5:
      return <RoomsStep />;
    case 6:
      return <FacilitiesStep />;
    case 7:
      return <ReviewStep />;
    default:
      return <BasicInfoStep />;
  }
}
