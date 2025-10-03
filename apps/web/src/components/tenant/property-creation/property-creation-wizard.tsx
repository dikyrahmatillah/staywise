"use client";

import { PropertyCreationProvider } from "./property-creation-context";
import { StepNavigation } from "./step-navigation";
import {
  WizardHeader,
  WizardProgress,
  WizardStepContent,
  WizardStepHeader,
} from "./wizard-layout";
import { useWizardNavigation } from "./use-wizard-navigation";
import { renderStepContent } from "./wizard-step-renderer";
import { WIZARD_STEPS } from "./wizard-config";
import PagerControls from "@/components/ui/pager-controls";

function PropertyCreationWizardContent() {
  const {
    currentStep,
    isTransitioning,
    direction,
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

  const currentStepData = WIZARD_STEPS.find((s) => s.number === currentStep)!;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-[-4rem] right-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl opacity-60 animate-in fade-in-50 delay-150" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-8">
        <WizardHeader />

        <div className="space-y-8 w-full">
          <div className="bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8 ring-1 ring-black/5 animate-in fade-in-50 slide-in-from-top-2">
            <div className="space-y-6">
              <StepNavigation
                steps={WIZARD_STEPS}
                currentStep={currentStep}
                onStepClick={transitionToStep}
                isStepAccessible={hasStepData}
              />
              <WizardProgress currentStep={currentStep} />
            </div>
          </div>

          <WizardStepContent
            isTransitioning={isTransitioning}
            direction={direction}
          >
            <WizardStepHeader step={currentStepData} />
            <div key={currentStep}>{renderStepContent(currentStep)}</div>
          </WizardStepContent>

          <div className="bg-white/70 supports-[backdrop-filter]:bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 ring-1 ring-black/5 animate-in fade-in-50 slide-in-from-bottom-2">
            <PagerControls
              current={currentStep - 1}
              maxIndex={WIZARD_STEPS.length - 1}
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
