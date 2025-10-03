import { useCallback, useEffect, useRef, useState } from "react";
import { usePropertyCreation } from "./property-creation-context";
import { TOTAL_STEPS } from "./wizard-config";

type TransitionDirection = "forward" | "backward";

export function useWizardNavigation() {
  const {
    formData,
    currentStep,
    setCurrentStep,
    isStepValid,
    submitForm,
    isSubmitting,
  } = usePropertyCreation();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<TransitionDirection>("forward");
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTransitionTimeout = useCallback(() => {
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
      transitionTimeout.current = null;
    }
  }, []);

  const transitionToStep = useCallback(
    (nextStep: number) => {
      if (nextStep === currentStep || nextStep < 1 || nextStep > TOTAL_STEPS) {
        return;
      }

      setDirection(nextStep > currentStep ? "forward" : "backward");
      setIsTransitioning(true);
      clearTransitionTimeout();

      transitionTimeout.current = setTimeout(() => {
        setCurrentStep(nextStep);
        setIsTransitioning(false);
        transitionTimeout.current = null;
      }, 180);
    },
    [clearTransitionTimeout, currentStep, setCurrentStep]
  );

  const hasStepData = useCallback(
    (stepNumber: number) => {
      switch (stepNumber) {
        case 1:
          return Boolean(formData.name || formData.description);
        case 2:
          return Boolean(formData.country || formData.city || formData.address);
        case 3:
          return Boolean(
            formData.propertyCategoryId || formData.customCategoryId
          );
        case 4:
          return Boolean(formData.rooms && formData.rooms.length > 0);
        case 5:
          return Boolean(formData.facilities && formData.facilities.length > 0);
        case 6:
          return Boolean(formData.pictures && formData.pictures.length > 0);
        case 7:
          return isStepValid(7);
        default:
          return false;
      }
    },
    [formData, isStepValid]
  );

  useEffect(() => () => clearTransitionTimeout(), [clearTransitionTimeout]);

  const canGoNext = isStepValid(currentStep);
  const canGoPrevious = currentStep > 1;
  const isLastStep = currentStep === TOTAL_STEPS;

  const handleNext = useCallback(() => {
    if (canGoNext && !isLastStep) {
      transitionToStep(currentStep + 1);
    } else if (isLastStep) {
      submitForm();
    }
  }, [canGoNext, currentStep, isLastStep, submitForm, transitionToStep]);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      transitionToStep(currentStep - 1);
    }
  }, [canGoPrevious, currentStep, transitionToStep]);

  const handleJumpToStep = useCallback(
    (stepIndex: number) => {
      transitionToStep(stepIndex + 1);
    },
    [transitionToStep]
  );

  return {
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
  };
}
