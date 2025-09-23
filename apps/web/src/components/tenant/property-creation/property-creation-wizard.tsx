"use client";

import {
  PropertyCreationProvider,
  usePropertyCreation,
} from "./property-creation-context";
import { StepNavigation } from "./step-navigation";
import { BasicInfoStep } from "./steps/basic-info-step";
import { LocationStep } from "./steps/location-step";
import { CategoryStep } from "./steps/category-step";
import { RoomsStep } from "./steps/rooms-step";
import { FacilitiesStep } from "./steps/facilities-step";
import { PhotosStep } from "./steps/photos-step";
import { ReviewStep } from "./steps/review-step";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Building2,
  FileText,
  MapPin,
  Tags,
  BedDouble,
  Sparkles,
  Images,
  ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useCallback } from "react";

type StepItem = {
  id: number;
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const STEPS: StepItem[] = [
  {
    id: 1,
    number: 1,
    title: "Basic Info",
    description: "Property name and description",
    icon: FileText,
  },
  {
    id: 2,
    number: 2,
    title: "Location",
    description: "Where is your property located?",
    icon: MapPin,
  },
  {
    id: 3,
    number: 3,
    title: "Category",
    description: "What type of property is this?",
    icon: Tags,
  },
  {
    id: 4,
    number: 4,
    title: "Rooms",
    description: "Add rooms and pricing",
    icon: BedDouble,
  },
  {
    id: 5,
    number: 5,
    title: "Facilities",
    description: "Available amenities",
    icon: Sparkles,
  },
  {
    id: 6,
    number: 6,
    title: "Photos",
    description: "Upload property images",
    icon: Images,
  },
  {
    id: 7,
    number: 7,
    title: "Review",
    description: "Review and submit",
    icon: ClipboardCheck,
  },
];

function PropertyCreationWizardContent() {
  const { currentStep, setCurrentStep, isStepValid, submitForm, isSubmitting } =
    usePropertyCreation();

  const canGoNext = isStepValid(currentStep);
  const canGoPrevious = currentStep > 1;
  const isLastStep = currentStep === STEPS.length;
  const progress = useMemo(() => {
    if (STEPS.length <= 1) return 100;
    return Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (canGoNext && !isLastStep) {
      setCurrentStep(currentStep + 1);
    } else if (isLastStep) {
      submitForm();
    }
  }, [canGoNext, isLastStep, currentStep, setCurrentStep, submitForm]);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      setCurrentStep(currentStep - 1);
    }
  }, [canGoPrevious, currentStep, setCurrentStep]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <LocationStep />;
      case 3:
        return <CategoryStep />;
      case 4:
        return <RoomsStep />;
      case 5:
        return <FacilitiesStep />;
      case 6:
        return <PhotosStep />;
      case 7:
        return <ReviewStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  return (
    <div className="relative">
      <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="hidden sm:flex items-center justify-center rounded-xl bg-primary/10 text-primary p-2">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold sm:font-bold tracking-tight">
                Create New Property
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Follow the steps to publish your listing.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 w-full">
          <div className="bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur-md rounded-lg shadow-md border p-4 sm:p-6 sticky top-0 z-30">
            <StepNavigation steps={STEPS} currentStep={currentStep} />
            <div className="mt-4">
              <div
                className="h-2 w-full rounded-full bg-muted/60 ring-1 ring-inset ring-primary/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Step content card with per-step header */}
          <div
            key={currentStep}
            className="bg-white rounded-lg shadow-sm border min-h-[540px] p-4 sm:p-6 animate-in fade-in-20 slide-in-from-bottom-1"
          >
            {(() => {
              const step = STEPS.find((s) => s.number === currentStep)!;
              const Icon = step.icon;
              return (
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-xl font-semibold tracking-tight">
                      {step.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })()}
            {renderCurrentStep()}
          </div>

          <div className="bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur-md rounded-lg shadow-sm border p-3 sm:p-6 sticky bottom-2 sm:bottom-4 z-30">
            <div className="flex flex-row justify-between items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={!canGoPrevious || isSubmitting}
                className="flex items-center gap-2 w-auto p-2"
                aria-label="Go to previous step"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div
                className="flex-1 flex flex-col items-center gap-1 text-center"
                aria-live="polite"
              >
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {STEPS.length}
                </span>
              </div>

              <Button
                onClick={handleNext}
                disabled={!canGoNext || isSubmitting}
                className="flex items-center gap-2 w-auto p-2"
                aria-label={isLastStep ? "Create property" : "Go to next step"}
              >
                {isLastStep ? (
                  isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Creating...</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Create Property</span>
                    </>
                  )
                ) : (
                  <>
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyCreationWizard() {
  return (
    <PropertyCreationProvider>
      <PropertyCreationWizardContent />
    </PropertyCreationProvider>
  );
}
