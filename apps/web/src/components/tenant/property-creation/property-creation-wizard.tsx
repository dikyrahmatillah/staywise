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
import {
  FileText,
  MapPin,
  Tags,
  BedDouble,
  Sparkles,
  Images,
  ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import PagerControls from "@/components/ui/pager-controls";
import { Progress } from "@/components/ui/progress";

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
  const {
    formData,
    currentStep,
    setCurrentStep,
    isStepValid,
    submitForm,
    isSubmitting,
  } = usePropertyCreation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = STEPS.length;
  const completedSteps = Math.max(currentStep - 1, 0);
  const progressValue = (currentStep / totalSteps) * 100;

  const canGoNext = isStepValid(currentStep);
  const canGoPrevious = currentStep > 1;
  const isLastStep = currentStep === STEPS.length;

  const clearTransitionTimeout = useCallback(() => {
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
      transitionTimeout.current = null;
    }
  }, []);

  const transitionToStep = useCallback(
    (nextStep: number) => {
      if (nextStep === currentStep || nextStep < 1 || nextStep > totalSteps) {
        return;
      }

      setDirection(nextStep > currentStep ? "forward" : "backward");
      setIsTransitioning(true);
      clearTransitionTimeout();

      transitionTimeout.current = setTimeout(() => {
        setCurrentStep(nextStep);
        setIsTransitioning(false);
        transitionTimeout.current = null;
      }, 180);
    },
    [clearTransitionTimeout, currentStep, setCurrentStep, totalSteps]
  );

  const handleNext = useCallback(() => {
    if (canGoNext && !isLastStep) {
      transitionToStep(currentStep + 1);
    } else if (isLastStep) {
      submitForm();
    }
  }, [canGoNext, currentStep, isLastStep, submitForm, transitionToStep]);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      transitionToStep(currentStep - 1);
    }
  }, [canGoPrevious, currentStep, transitionToStep]);

  const handleJump = useCallback(
    (stepIndex: number) => {
      transitionToStep(stepIndex + 1);
    },
    [transitionToStep]
  );

  const hasStepData = useCallback(
    (stepNumber: number) => {
      switch (stepNumber) {
        case 1:
          return Boolean(formData.name || formData.description);
        case 2:
          return Boolean(formData.country || formData.city || formData.address);
        case 3:
          return Boolean(
            formData.propertyCategoryId || formData.customCategoryId
          );
        case 4:
          return Boolean(formData.rooms && formData.rooms.length > 0);
        case 5:
          return Boolean(formData.facilities && formData.facilities.length > 0);
        case 6:
          return Boolean(formData.pictures && formData.pictures.length > 0);
        case 7:
          return isStepValid(7);
        default:
          return false;
      }
    },
    [formData, isStepValid]
  );

  useEffect(() => () => clearTransitionTimeout(), [clearTransitionTimeout]);

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
    <div className="relative min-h-screen ">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-[-4rem] right-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl opacity-60 animate-in fade-in-50 delay-150" />
      </div>
      <div className="relative max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-in fade-in-50 slide-in-from-top-2">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Create New Property
            </h1>
            <p className="text-base text-muted-foreground max-w-xl">
              Follow the steps to publish your listing and start earning.
            </p>
          </div>
        </div>

        <div className="space-y-8 w-full">
          <div className="bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8 ring-1 ring-black/5 animate-in fade-in-50 slide-in-from-top-2">
            <div className="space-y-6">
              <StepNavigation
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={transitionToStep}
                isStepAccessible={hasStepData}
              />
              <div className="space-y-3 animate-in fade-in-30 slide-in-from-top-1">
                <Progress
                  value={progressValue}
                  className="h-2 bg-primary/10"
                  indicatorClassName="bg-gradient-to-r from-primary via-primary/80 to-primary/60 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
                  <span className="animate-in fade-in-50">
                    {completedSteps} of {totalSteps} steps completed
                  </span>
                  <span className="animate-in fade-in-50 delay-75">
                    Need help? You can revisit any step at any time.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            key={currentStep}
            className={`bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 min-h-[500px] sm:min-h-[600px] p-4 sm:p-6 lg:p-8 ring-1 ring-black/5 transition-all duration-300 ${
              isTransitioning
                ? direction === "forward"
                  ? "animate-in slide-in-from-right-5 fade-in-20"
                  : "animate-in slide-in-from-left-5 fade-in-20"
                : "animate-in fade-in-20 slide-in-from-bottom-2"
            }`}
          >
            {(() => {
              const step = STEPS.find((s) => s.number === currentStep)!;
              const Icon = step.icon;
              return (
                <div className="mb-3 sm:mb-4 flex flex-col gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-lg border border-primary/10">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                          {step.title}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="animate-in fade-in-20 slide-in-from-bottom-1 duration-300 delay-100">
              {renderCurrentStep()}
            </div>
          </div>

          <div className="bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 ring-1 ring-black/5 animate-in fade-in-50 slide-in-from-bottom-2">
            <PagerControls
              current={currentStep - 1}
              maxIndex={STEPS.length - 1}
              onPrev={handlePrevious}
              onNext={handleNext}
              onJump={handleJump}
              canGoNext={canGoNext}
              canGoPrev={canGoPrevious}
              isLoading={isSubmitting}
              nextLabel={isLastStep ? "Create Property" : undefined}
              className=""
            />
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
