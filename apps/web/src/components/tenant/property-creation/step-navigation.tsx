"use client";

import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  const currentStepData = steps.find((step) => step.number === currentStep);

  return (
    <div className="w-full space-y-6">
      <div className="block lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-900">
            Step {currentStep} of {steps.length}
          </div>
          <Badge variant="outline" className="text-xs">
            {Math.round(progress)}% Complete
          </Badge>
        </div>

        <Progress value={progress} className="h-3 mb-4" />

        {currentStepData && (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {currentStepData.description}
            </p>
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <Progress value={progress} className="h-2 mb-8" />

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
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                    {
                      "bg-green-500 border-green-500 text-white": isCompleted,
                      "bg-blue-600 border-blue-600 text-white": isCurrent,
                      "bg-gray-100 border-gray-300 text-gray-500": isUpcoming,
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
                        "text-green-600": isCompleted,
                        "text-blue-600": isCurrent,
                        "text-gray-500": isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={cn("text-xs transition-colors duration-200", {
                      "text-green-500": isCompleted,
                      "text-blue-500": isCurrent,
                      "text-gray-400": isUpcoming,
                    })}
                  >
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute top-5 left-full w-full h-0.5 -translate-y-1/2 z-0">
                    <div
                      className={cn("h-full transition-colors duration-200", {
                        "bg-green-500": step.number < currentStep,
                        "bg-gray-300": step.number >= currentStep,
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
        <div className="space-y-2">
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center p-3 rounded-lg transition-all duration-200",
                  {
                    "bg-green-50 border border-green-200": isCompleted,
                    "bg-blue-50 border border-blue-200": isCurrent,
                    "bg-gray-50 border border-gray-200": isUpcoming,
                  }
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 mr-3",
                    {
                      "bg-green-500 border-green-500 text-white": isCompleted,
                      "bg-blue-600 border-blue-600 text-white": isCurrent,
                      "bg-gray-100 border-gray-300 text-gray-500": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-semibold">{step.number}</span>
                  )}
                </div>

                <div className="flex-1">
                  <h4
                    className={cn("text-sm font-medium", {
                      "text-green-600": isCompleted,
                      "text-blue-600": isCurrent,
                      "text-gray-500": isUpcoming,
                    })}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={cn("text-xs mt-1", {
                      "text-green-500": isCompleted,
                      "text-blue-500": isCurrent,
                      "text-gray-400": isUpcoming,
                    })}
                  >
                    {step.description}
                  </p>
                </div>

                {isCurrent && (
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
