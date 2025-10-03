"use client";

import { useState } from "react";
import { Check, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WizardStep } from "./wizard-config";
import {
  getStepState,
  getMobileStepIndicatorClasses,
  getMobileStepItemClasses,
  getMobileStepTitleClasses,
  getMobileStepDescriptionClasses,
} from "./step-navigation-utils";

interface MobileStepNavigationProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
  isStepAccessible?: (stepNumber: number) => boolean;
}

export function MobileStepNavigation({
  steps,
  currentStep,
  onStepClick,
  isStepAccessible,
}: MobileStepNavigationProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const currentStepData = steps.find((step) => step.number === currentStep);

  const toggleMobile = () => setMobileExpanded((v) => !v);

  const handleStepClick = (stepNumber: number) => {
    const state = getStepState(stepNumber, currentStep, isStepAccessible);
    if (state.isClickable) {
      onStepClick(stepNumber);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    stepNumber: number,
    isClickable: boolean
  ) => {
    if (!isClickable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleStepClick(stepNumber);
    }
  };

  return (
    <div className="block lg:hidden">
      {/* Current Step Header */}
      {currentStepData && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {currentStepData.description}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleMobile}
            aria-expanded={mobileExpanded}
            aria-controls="mobile-step-list"
            className="ml-4 inline-flex items-center justify-center rounded-md p-2 text-sm text-gray-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 hover:scale-105"
            title={mobileExpanded ? "Collapse steps" : "Expand steps"}
          >
            <ChevronDown
              className={cn(
                "w-5 h-5 transition-transform duration-300 ease-out",
                {
                  "rotate-180": mobileExpanded,
                }
              )}
            />
          </button>
        </div>
      )}

      {/* Expandable Step List */}
      <div
        id="mobile-step-list"
        className={cn(
          "space-y-2 overflow-hidden transition-[max-height] duration-300 mt-6",
          {
            "max-h-0": !mobileExpanded,
            "max-h-[1000px]": mobileExpanded,
          }
        )}
      >
        {mobileExpanded &&
          steps.map((step) => {
            const state = getStepState(
              step.number,
              currentStep,
              isStepAccessible
            );

            return (
              <div
                key={step.id}
                className={getMobileStepItemClasses(state)}
                onClick={() => handleStepClick(step.number)}
                role="button"
                tabIndex={state.isClickable ? 0 : -1}
                onKeyDown={(event) =>
                  handleKeyDown(event, step.number, state.isClickable)
                }
              >
                <div className={getMobileStepIndicatorClasses(state)}>
                  {state.isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    <step.icon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className={getMobileStepTitleClasses(state)}>
                    {step.title}
                  </h4>
                  <p className={getMobileStepDescriptionClasses(state)}>
                    {step.description}
                  </p>
                </div>

                {state.isCurrent && (
                  <ChevronRight className="w-5 h-5 text-primary animate-pulse" />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
