"use client";

import {
  PropertyCreationProvider,
  usePropertyCreation,
} from "./property-creation-context";
import { StepNavigation } from "./step-navigation";
import { BasicInfoStep } from "./steps/basic-info-step";
import { LocationStep } from "./steps/location-step";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const STEPS = [
  {
    id: 1,
    number: 1,
    title: "Basic Info",
    description: "Property name and description",
  },
  {
    id: 2,
    number: 2,
    title: "Location",
    description: "Where is your property located?",
  },
  {
    id: 3,
    number: 3,
    title: "Category",
    description: "What type of property is this?",
  },
  { id: 4, number: 4, title: "Rooms", description: "Add rooms and pricing" },
  { id: 5, number: 5, title: "Facilities", description: "Available amenities" },
  { id: 6, number: 6, title: "Photos", description: "Upload property images" },
  { id: 7, number: 7, title: "Review", description: "Review and submit" },
];

function PropertyCreationWizardContent() {
  const { currentStep, setCurrentStep, isStepValid, submitForm, isSubmitting } =
    usePropertyCreation();

  const canGoNext = isStepValid(currentStep);
  const canGoPrevious = currentStep > 1;
  const isLastStep = currentStep === STEPS.length;

  const handleNext = () => {
    if (canGoNext && !isLastStep) {
      setCurrentStep(currentStep + 1);
    } else if (isLastStep) {
      submitForm();
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <LocationStep />;
      case 3:
        return <div className="text-center">Coming soon...</div>;
      case 4:
        return <div className="text-center">Coming soon...</div>;
      case 5:
        return <div className="text-center">Coming soon...</div>;
      case 6:
        return <div className="text-center">Coming soon...</div>;
      case 7:
        return <div className="text-center">Coming soon...</div>;
      default:
        return <BasicInfoStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create New Property
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Follow the steps below to list your property
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <StepNavigation steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border min-h-[500px] p-4 sm:p-6">
          {renderCurrentStep()}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!canGoPrevious || isSubmitting}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-4 text-center">
              <span className="text-sm text-gray-500">
                Step {currentStep} of {STEPS.length}
              </span>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canGoNext || isSubmitting}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              {isLastStep ? (
                isSubmitting ? (
                  "Creating..."
                ) : (
                  "Create Property"
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
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
