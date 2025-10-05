"use client";

import { PropertyCreationProvider } from "./property-creation-context";
import { StepNavigation } from "./step-navigation";
import { WizardHeader, WizardProgress } from "./wizard-layout";
import { useWizardNavigation } from "./use-wizard-navigation";
import { renderStepContent } from "./wizard-step-renderer";
import PagerControls from "@/components/ui/pager-controls";

function PropertyCreationWizardContent() {
  const {
    currentStep,
    canGoNext,
    canGoPrevious,
    isLastStep,
    isSubmitting,
    hasStepData,
    handleNext,
    handlePrevious,
    handleJumpToStep,
    transitionToStep,
  } = useWizardNavigation();

  return (
    <div className="relative min-h-screen">
      <div className="relative max-w-6xl mx-auto space-y-8">
        <WizardHeader />

        <div className="space-y-8 w-full">
          <div className="bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8 ring-1 ring-black/5 animate-in fade-in-50 slide-in-from-top-2">
            <div className="space-y-6">
              <StepNavigation
                currentStep={currentStep}
                onStepClick={transitionToStep}
                isStepAccessible={hasStepData}
              />
              <WizardProgress currentStep={currentStep} />
            </div>
          </div>

          <div key={currentStep}>{renderStepContent(currentStep)}</div>

          <PagerControls
            current={currentStep - 1}
            onPrev={handlePrevious}
            onNext={handleNext}
            onJump={handleJumpToStep}
            canGoNext={canGoNext}
            canGoPrev={canGoPrevious}
            isLoading={isSubmitting}
            nextLabel={isLastStep ? "Create Property" : undefined}
          />
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
