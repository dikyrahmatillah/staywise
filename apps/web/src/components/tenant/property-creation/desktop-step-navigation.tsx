"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WizardStep } from "./wizard-config";
import {
  getStepState,
  getStepIndicatorClasses,
  getStepTitleClasses,
  getStepDescriptionClasses,
} from "./step-navigation-utils";

interface DesktopStepNavigationProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
  isStepAccessible?: (stepNumber: number) => boolean;
}

export function DesktopStepNavigation({
  steps,
  currentStep,
  onStepClick,
  isStepAccessible,
}: DesktopStepNavigationProps) {
  const handleStepClick = (stepNumber: number) => {
    const state = getStepState(stepNumber, currentStep, isStepAccessible);
    if (state.isClickable) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="hidden lg:block">
      <div className="grid grid-cols-7 gap-4">
        {steps.map((step) => {
          const state = getStepState(
            step.number,
            currentStep,
            isStepAccessible
          );

          return (
            <div
              key={step.id}
              className={cn(
                "relative flex flex-col items-center text-center transition-all duration-300 group",
                {
                  "opacity-50 hover:opacity-75":
                    state.isUpcoming && !state.hasData,
                  "opacity-100":
                    state.isCurrent || state.isCompleted || state.hasData,
                  "cursor-pointer": state.isClickable,
                  "cursor-not-allowed": !state.isClickable,
                }
              )}
              onClick={() => handleStepClick(step.number)}
            >
              <div className={getStepIndicatorClasses(state)}>
                {state.isCompleted ? (
                  <Check className="w-6 h-6 animate-in zoom-in-50 duration-300" />
                ) : step.icon ? (
                  <step.icon className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-bold">{step.number}</span>
                )}

                {state.isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h4 className={getStepTitleClasses(state)}>{step.title}</h4>
                <p className={getStepDescriptionClasses(state)}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
