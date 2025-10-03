"use client";

import { useCallback } from "react";
import type { WizardStep } from "./wizard-config";
import { DesktopStepNavigation } from "./desktop-step-navigation";
import { MobileStepNavigation } from "./mobile-step-navigation";

export interface StepNavigationProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
  isStepAccessible?: (stepNumber: number) => boolean;
}

export function StepNavigation({
  steps,
  currentStep,
  onStepClick,
  isStepAccessible,
}: StepNavigationProps) {
  const handleStepClick = useCallback(
    (stepNumber: number) => {
      if (onStepClick) {
        onStepClick(stepNumber);
      }
    },
    [onStepClick]
  );

  return (
    <div className="w-full space-y-6">
      <MobileStepNavigation
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        isStepAccessible={isStepAccessible}
      />

      <DesktopStepNavigation
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        isStepAccessible={isStepAccessible}
      />
    </div>
  );
}
