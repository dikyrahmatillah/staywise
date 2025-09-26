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
import { useCallback, useState } from "react";
import PagerControls from "@/components/ui/pager-controls";

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
  const { currentStep, setCurrentStep, isStepValid, submitForm } =
    usePropertyCreation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const canGoNext = isStepValid(currentStep);
  const canGoPrevious = currentStep > 1;
  const isLastStep = currentStep === STEPS.length;

  const handleNext = useCallback(() => {
    if (canGoNext && !isLastStep) {
      setDirection("forward");
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 150);
    } else if (isLastStep) {
      submitForm();
    }
  }, [canGoNext, isLastStep, currentStep, setCurrentStep, submitForm]);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      setDirection("backward");
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 150);
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px] opacity-30"></div>
      <div className="relative max-w-6xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="sm:flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary p-3 shadow-lg border border-primary/10 hidden">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create New Property
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Follow the steps to publish your listing and start earning.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 w-full">
          <div className="bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8 ring-1 ring-black/5">
            <StepNavigation
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          </div>

          {/* Step content card with enhanced design */}
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
                <div className="mb-6 sm:mb-8 flex items-start gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-lg border border-primary/10">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                      {step.title}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })()}
            <div className="animate-in fade-in-20 slide-in-from-bottom-1 duration-300 delay-100">
              {renderCurrentStep()}
            </div>
          </div>

          <div className="bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 ring-1 ring-black/5">
            <PagerControls
              current={currentStep - 1}
              maxIndex={STEPS.length - 1}
              onPrev={handlePrevious}
              onNext={handleNext}
              onJump={(index) => setCurrentStep(index + 1)}
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
