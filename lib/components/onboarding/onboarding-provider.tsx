/**
 * Onboarding Provider
 * Provider optionnel pour features additionnelles (tracking, analytics, etc.)
 */

"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';

interface OnboardingContextValue {
  trackStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

interface OnboardingProviderProps {
  children: React.ReactNode;
  onStepChange?: (step: number) => void;
}

export function OnboardingProvider({ children, onStepChange }: OnboardingProviderProps) {
  const { currentStep } = useOnboardingStore();

  useEffect(() => {
    // Track step changes (analytics, etc.)
    if (onStepChange) {
      onStepChange(currentStep);
    }

    // Example: Log to console or analytics service
    console.log(`[Onboarding] Step ${currentStep + 1}/4`);
  }, [currentStep, onStepChange]);

  const trackStep = (step: number) => {
    // Custom tracking logic
    console.log(`[Onboarding] Custom tracking for step ${step}`);
  };

  return (
    <OnboardingContext.Provider value={{ trackStep }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
}
