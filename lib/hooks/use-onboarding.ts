/**
 * Custom Hook for Onboarding
 * Facilite l'utilisation du store d'onboarding
 */

"use client";

import { useOnboardingStore } from '@/lib/stores/onboarding-store';

export function useOnboarding() {
  const store = useOnboardingStore();

  return {
    // State
    currentStep: store.currentStep,
    isCompleted: store.isCompleted,

    // Profile data
    firstName: store.firstName,
    lastName: store.lastName,
    avatarUrl: store.avatarUrl,

    // Leagues data
    selectedLeagues: store.selectedLeagues,

    // Preferences data
    selectedPredictionTypes: store.selectedPredictionTypes,
    riskProfile: store.riskProfile,

    // Actions
    setFirstName: store.setFirstName,
    setLastName: store.setLastName,
    setAvatarUrl: store.setAvatarUrl,
    toggleLeague: store.toggleLeague,
    togglePredictionType: store.togglePredictionType,
    setRiskProfile: store.setRiskProfile,

    // Navigation
    nextStep: store.nextStep,
    prevStep: store.prevStep,
    canGoToNextStep: store.canGoToNextStep,

    // Completion
    complete: store.complete,
    reset: store.reset,

    // Helper computed values
    isProfileStepValid: store.firstName.trim().length >= 2 && store.lastName.trim().length >= 2,
    isLeaguesStepValid: store.selectedLeagues.length >= 1,
    isPreferencesStepValid: store.selectedPredictionTypes.length >= 1 && store.riskProfile !== null,
  };
}
