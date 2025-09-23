"use client";

import { Check, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface Step {
  id: number;
  number: number;
  title: string;
  description: string;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
}

export function StepNavigation({ steps, currentStep }: StepNavigationProps) {
  const currentStepData = steps.find((step) => step.number === currentStep);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const toggleMobile = () => setMobileExpanded((v) => !v);

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
              className="ml-4 inline-flex items-center justify-center rounded-md p-2 text-sm text-gray-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              title={mobileExpanded ? "Collapse steps" : "Expand steps"}
            >
              <ChevronDown
                className={cn("w-5 h-5 transition-transform duration-200", {
                  "rotate-180": mobileExpanded,
                })}
              />
            </button>
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-7 gap-4">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  "relative flex flex-col items-center text-center transition-all duration-200",
                  {
                    "opacity-50": isUpcoming,
                    "opacity-100": isCurrent || isCompleted,
                  }
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200",
                    {
                      "bg-primary text-primary-foreground border-primary":
                        isCompleted,
                      "bg-primary/90 text-primary-foreground border-primary/80":
                        isCurrent,
                      "bg-muted text-muted-foreground border-transparent":
                        isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <h4
                    className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      {
                        "text-primary": isCompleted || isCurrent,
                        "text-muted-foreground": isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={cn("text-xs transition-colors duration-200", {
                      "text-primary/70": isCompleted || isCurrent,
                      "text-muted-foreground": isUpcoming,
                    })}
                  >
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute top-5 left-full w-full h-0.5 -translate-y-1/2 z-0">
                    <div
                      className={cn("h-full transition-colors duration-200", {
                        "bg-primary": step.number < currentStep,
                        "bg-muted": step.number >= currentStep,
                      })}
                    />
                  </div>
                )}
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
                    "flex items-center p-3 rounded-lg transition-all duration-200 border",
                    {
                      "bg-primary/5 border-primary/20":
                        isCompleted || isCurrent,
                      "bg-muted/40 border-transparent": isUpcoming,
                    }
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border mr-3",
                      {
                        "bg-primary text-primary-foreground border-primary":
                          isCompleted,
                        "bg-primary/90 text-primary-foreground border-primary/80":
                          isCurrent,
                        "bg-muted text-muted-foreground border-transparent":
                          isUpcoming,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-semibold">
                        {step.number}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4
                      className={cn("text-sm font-medium", {
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
                    <ChevronRight className="w-5 h-5 text-primary" />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
