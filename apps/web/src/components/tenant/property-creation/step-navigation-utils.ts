export interface StepState {
  isCompleted: boolean;
  isCurrent: boolean;
  isUpcoming: boolean;
  hasData: boolean;
  isClickable: boolean;
}

export function getStepState(
  stepNumber: number,
  currentStep: number,
  isStepAccessible?: (stepNumber: number) => boolean
): StepState {
  const isCompleted = stepNumber < currentStep;
  const isCurrent = stepNumber === currentStep;
  const isUpcoming = stepNumber > currentStep;
  const hasData = isStepAccessible?.(stepNumber) === true;
  const isClickable = stepNumber <= currentStep || hasData;

  return {
    isCompleted,
    isCurrent,
    isUpcoming,
    hasData,
    isClickable,
  };
}

/**
 * Get CSS classes for step indicator based on state
 */
export function getStepIndicatorClasses(state: StepState): string {
  const { isCompleted, isCurrent, isUpcoming, hasData } = state;

  const baseClasses =
    "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110";

  if (isCompleted) {
    return `${baseClasses} bg-primary text-primary-foreground border-primary shadow-primary/25`;
  }

  if (isCurrent) {
    return `${baseClasses} bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/80 shadow-primary/30 ring-4 ring-primary/10`;
  }

  if (isUpcoming && hasData) {
    return `${baseClasses} bg-gradient-to-br from-primary/10 to-primary/5 text-primary border-primary/40 hover:border-primary/60 hover:text-primary shadow-primary/10`;
  }

  return `${baseClasses} bg-white text-muted-foreground border-muted-foreground/20 hover:border-primary/50 hover:text-primary hover:shadow-primary/10`;
}

/**
 * Get CSS classes for mobile step indicator based on state
 */
export function getMobileStepIndicatorClasses(state: StepState): string {
  const { isCompleted, isCurrent, isUpcoming, hasData } = state;

  const baseClasses =
    "flex items-center justify-center w-10 h-10 rounded-full border-2 mr-4 transition-all duration-300";

  if (isCompleted) {
    return `${baseClasses} bg-primary text-primary-foreground border-primary shadow-primary/25`;
  }

  if (isCurrent) {
    return `${baseClasses} bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/80 shadow-primary/30 ring-2 ring-primary/10`;
  }

  if (isUpcoming && hasData) {
    return `${baseClasses} bg-gradient-to-br from-primary/10 to-primary/5 text-primary border-primary/40`;
  }

  return `${baseClasses} bg-white text-muted-foreground border-muted-foreground/20`;
}

export function getStepTitleClasses(state: StepState): string {
  const { isCompleted, isCurrent, hasData, isUpcoming } = state;

  const baseClasses =
    "text-sm font-semibold transition-all duration-300 group-hover:scale-105";

  if (isCompleted || isCurrent || hasData) {
    return `${baseClasses} text-primary`;
  }

  if (isUpcoming && !hasData) {
    return `${baseClasses} text-muted-foreground group-hover:text-primary/70`;
  }

  return baseClasses;
}

export function getStepDescriptionClasses(state: StepState): string {
  const { isCompleted, isCurrent, hasData, isUpcoming } = state;

  const baseClasses = "text-xs transition-all duration-300";

  if (isCompleted || isCurrent || hasData) {
    return `${baseClasses} text-primary/70`;
  }

  if (isUpcoming && !hasData) {
    return `${baseClasses} text-muted-foreground group-hover:text-primary/50`;
  }

  return baseClasses;
}

export function getMobileStepItemClasses(state: StepState): string {
  const { isCompleted, isCurrent, isUpcoming, hasData, isClickable } = state;

  const baseClasses =
    "flex items-center p-4 rounded-xl transition-all duration-300 border hover:shadow-md";

  let stateClasses = "";

  if (isCompleted || isCurrent) {
    stateClasses = "bg-primary/5 border-primary/20 shadow-primary/5";
  } else if (isUpcoming && hasData) {
    stateClasses = "bg-primary/5 border-primary/20 hover:bg-primary/10";
  } else if (isUpcoming && !hasData) {
    stateClasses = "bg-muted/40 border-transparent hover:bg-muted/60";
  }

  const cursorClasses = isClickable
    ? "cursor-pointer"
    : "cursor-not-allowed opacity-60";

  return `${baseClasses} ${stateClasses} ${cursorClasses}`;
}

export function getMobileStepTitleClasses(state: StepState): string {
  const { isCompleted, isCurrent, hasData, isUpcoming } = state;

  const baseClasses = "text-sm font-semibold";

  if (isCompleted || isCurrent || hasData) {
    return `${baseClasses} text-primary`;
  }

  if (isUpcoming && !hasData) {
    return `${baseClasses} text-muted-foreground`;
  }

  return baseClasses;
}

export function getMobileStepDescriptionClasses(state: StepState): string {
  const { isCompleted, isCurrent, hasData, isUpcoming } = state;

  const baseClasses = "text-xs mt-1";

  if (isCompleted || isCurrent || hasData) {
    return `${baseClasses} text-primary/70`;
  }

  if (isUpcoming && !hasData) {
    return `${baseClasses} text-muted-foreground`;
  }

  return baseClasses;
}
