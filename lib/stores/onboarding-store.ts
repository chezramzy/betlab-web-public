/**
 * Onboarding Store (Zustand)
 * Gère le state machine d'onboarding en 4 étapes
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSupabaseClient } from '@/lib/core/services/supabase-service';

interface OnboardingState {
  // State
  currentStep: number; // 0-3
  isCompleted: boolean;

  // Profile step data (Step 0)
  firstName: string;
  lastName: string;
  avatarUrl: string | null;

  // Leagues step data (Step 1)
  selectedLeagues: string[]; // IDs des ligues

  // Preferences step data (Step 2)
  selectedPredictionTypes: string[]; // Over1.5, BTTS, etc.
  riskProfile: 'conservative' | 'balanced' | 'aggressive' | null;

  // Actions
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setAvatarUrl: (url: string | null) => void;
  toggleLeague: (leagueId: string) => void;
  togglePredictionType: (type: string) => void;
  setRiskProfile: (profile: 'conservative' | 'balanced' | 'aggressive') => void;
  nextStep: () => void;
  prevStep: () => void;
  complete: () => Promise<void>;
  reset: () => void;

  // Validation helpers
  canGoToNextStep: () => boolean;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 0,
      isCompleted: false,
      firstName: '',
      lastName: '',
      avatarUrl: null,
      selectedLeagues: [],
      selectedPredictionTypes: [],
      riskProfile: null,

      // Profile actions
      setFirstName: (name: string) => set({ firstName: name }),
      setLastName: (name: string) => set({ lastName: name }),
      setAvatarUrl: (url: string | null) => set({ avatarUrl: url }),

      // Leagues actions
      toggleLeague: (leagueId: string) => {
        const { selectedLeagues } = get();
        if (selectedLeagues.includes(leagueId)) {
          set({ selectedLeagues: selectedLeagues.filter((id) => id !== leagueId) });
        } else {
          set({ selectedLeagues: [...selectedLeagues, leagueId] });
        }
      },

      // Preferences actions
      togglePredictionType: (type: string) => {
        const { selectedPredictionTypes } = get();
        if (selectedPredictionTypes.includes(type)) {
          set({ selectedPredictionTypes: selectedPredictionTypes.filter((t) => t !== type) });
        } else {
          set({ selectedPredictionTypes: [...selectedPredictionTypes, type] });
        }
      },

      setRiskProfile: (profile: 'conservative' | 'balanced' | 'aggressive') => {
        set({ riskProfile: profile });
      },

      // Navigation
      nextStep: () => {
        const { currentStep, canGoToNextStep } = get();
        if (canGoToNextStep() && currentStep < 3) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // Save to Supabase
      complete: async () => {
        const {
          firstName,
          lastName,
          avatarUrl,
          selectedLeagues,
          selectedPredictionTypes,
          riskProfile,
        } = get();

        try {
          const supabase = getSupabaseClient();

          // Get current user
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            throw new Error('User not authenticated');
          }

          // Update profile
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              user_id: user.id,
              first_name: firstName,
              last_name: lastName,
              avatar_url: avatarUrl,
              favorite_leagues: selectedLeagues,
              prediction_types: selectedPredictionTypes,
              risk_profile: riskProfile,
              onboarding_completed: true,
              updated_at: new Date().toISOString(),
            });

          if (error) {
            console.error('Error saving onboarding data:', error);
            throw error;
          }

          set({ isCompleted: true });
        } catch (error) {
          console.error('Error completing onboarding:', error);
          throw error;
        }
      },

      // Reset
      reset: () => {
        set({
          currentStep: 0,
          isCompleted: false,
          firstName: '',
          lastName: '',
          avatarUrl: null,
          selectedLeagues: [],
          selectedPredictionTypes: [],
          riskProfile: null,
        });
      },

      // Validation
      canGoToNextStep: () => {
        const {
          currentStep,
          firstName,
          lastName,
          selectedLeagues,
          selectedPredictionTypes,
          riskProfile,
        } = get();

        switch (currentStep) {
          case 0: // Profile step
            return firstName.trim().length >= 2 && lastName.trim().length >= 2;
          case 1: // Leagues step
            return selectedLeagues.length >= 1;
          case 2: // Preferences step
            return selectedPredictionTypes.length >= 1 && riskProfile !== null;
          case 3: // Success step
            return true;
          default:
            return false;
        }
      },
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        isCompleted: state.isCompleted,
        firstName: state.firstName,
        lastName: state.lastName,
        avatarUrl: state.avatarUrl,
        selectedLeagues: state.selectedLeagues,
        selectedPredictionTypes: state.selectedPredictionTypes,
        riskProfile: state.riskProfile,
      }),
    }
  )
);
