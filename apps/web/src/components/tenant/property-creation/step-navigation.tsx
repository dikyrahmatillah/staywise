"use client";

import {
  Check,
  ChevronRight,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface Step {
  id: number;
  number: number;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

export function StepNavigation({
  steps,
  currentStep,
  onStepClick,
}: StepNavigationProps) {
  const currentStepData = steps.find((step) => step.number === currentStep);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const toggleMobile = () => setMobileExpanded((v) => !v);

  const handleStepClick = (stepNumber: number) => {
    if (onStepClick && stepNumber <= currentStep) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="block lg:hidden">
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
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-7 gap-4">
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isUpcoming = step.number > currentStep;
            const isClickable = step.number <= currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  "relative flex flex-col items-center text-center transition-all duration-300 group",
                  {
                    "opacity-50 hover:opacity-75": isUpcoming,
                    "opacity-100": isCurrent || isCompleted,
                    "cursor-pointer": isClickable,
                    "cursor-not-allowed": !isClickable,
                  }
                )}
                onClick={() => handleStepClick(step.number)}
              >
                <div
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110",
                    {
                      "bg-primary text-primary-foreground border-primary shadow-primary/25":
                        isCompleted,
                      "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/80 shadow-primary/30 ring-4 ring-primary/10":
                        isCurrent,
                      "bg-white text-muted-foreground border-muted-foreground/20 hover:border-primary/50 hover:text-primary hover:shadow-primary/10":
                        isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 animate-in zoom-in-50 duration-300" />
                  ) : step.icon ? (
                    <step.icon className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-bold">{step.number}</span>
                  )}

                  {/* Pulse effect for current step */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  )}
                </div>

                <div className="mt-4 space-y-1">
                  <h4
                    className={cn(
                      "text-sm font-semibold transition-all duration-300 group-hover:scale-105",
                      {
                        "text-primary": isCompleted || isCurrent,
                        "text-muted-foreground group-hover:text-primary/70":
                          isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={cn("text-xs transition-all duration-300", {
                      "text-primary/70": isCompleted || isCurrent,
                      "text-muted-foreground group-hover:text-primary/50":
                        isUpcoming,
                    })}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="block lg:hidden mt-6">
        <div
          id="mobile-step-list"
          className={cn(
            "space-y-2 overflow-hidden transition-[max-height] duration-300",
            {
              "max-h-0": !mobileExpanded,
              "max-h-[1000px]": mobileExpanded,
            }
          )}
        >
          {mobileExpanded &&
            steps.map((step) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              const isUpcoming = step.number > currentStep;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center p-4 rounded-xl transition-all duration-300 border hover:shadow-md",
                    {
                      "bg-primary/5 border-primary/20 shadow-primary/5":
                        isCompleted || isCurrent,
                      "bg-muted/40 border-transparent hover:bg-muted/60":
                        isUpcoming,
                    }
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 mr-4 transition-all duration-300",
                      {
                        "bg-primary text-primary-foreground border-primary shadow-primary/25":
                          isCompleted,
                        "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/80 shadow-primary/30 ring-2 ring-primary/10":
                          isCurrent,
                        "bg-white text-muted-foreground border-muted-foreground/20":
                          isUpcoming,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : step.icon ? (
                      <step.icon className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">
                        {step.number}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4
                      className={cn("text-sm font-semibold", {
                        "text-primary": isCompleted || isCurrent,
                        "text-muted-foreground": isUpcoming,
                      })}
                    >
                      {step.title}
                    </h4>
                    <p
                      className={cn("text-xs mt-1", {
                        "text-primary/70": isCompleted || isCurrent,
                        "text-muted-foreground": isUpcoming,
                      })}
                    >
                      {step.description}
                    </p>
                  </div>

                  {isCurrent && (
                    <ChevronRight className="w-5 h-5 text-primary animate-pulse" />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
