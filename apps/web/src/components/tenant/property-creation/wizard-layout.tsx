import { Progress } from "@/components/ui/progress";
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
