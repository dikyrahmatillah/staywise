import { ReactNode } from "react";
import type { WizardStep } from "./wizard-config";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TOTAL_STEPS } from "./wizard-config";

export function WizardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-in fade-in-50 slide-in-from-top-2">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Create New Property
        </h1>
        <p className="text-base text-muted-foreground max-w-xl">
          Follow the steps to publish your listing and start earning.
        </p>
      </div>
    </div>
  );
}

interface WizardProgressProps {
  currentStep: number;
}
export function WizardProgress({ currentStep }: WizardProgressProps) {
  const completedSteps = Math.max(currentStep - 1, 0);
  const progressValue = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="space-y-3 animate-in fade-in-30 slide-in-from-top-1">
      <Progress
        value={progressValue}
        className="h-2 bg-primary/10"
        indicatorClassName="bg-gradient-to-r from-primary via-primary/80 to-primary/60 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
        <span className="animate-in fade-in-50">
          {completedSteps} of {TOTAL_STEPS} steps completed
        </span>
        <span className="animate-in fade-in-50 delay-75">
          Need help? You can revisit any step at any time.
        </span>
      </div>
    </div>
  );
}

interface WizardStepHeaderProps {
  step: WizardStep;
}
export function WizardStepHeader({ step }: WizardStepHeaderProps) {
  const Icon = step.icon;

  return (
    <div className="mb-3 sm:mb-4 flex flex-col gap-4">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-lg border border-primary/10">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
              {step.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

interface WizardStepContentProps {
  children: ReactNode;
  isTransitioning: boolean;
  direction: "forward" | "backward";
}
export function WizardStepContent({
  children,
  isTransitioning,
}: WizardStepContentProps) {
  return (
    <div
      className={cn(
        "bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 min-h-[500px] sm:min-h-[600px] p-4 sm:p-6 lg:p-8 ring-1 ring-black/5 transition-opacity duration-200",
        {
          "opacity-0": isTransitioning,
          "opacity-100": !isTransitioning,
        }
      )}
    >
      {children}
    </div>
  );
}
