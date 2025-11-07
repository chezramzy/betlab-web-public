/**
 * Auth Store (Zustand)
 * Basé sur lib/presentation/providers/auth_provider.dart
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/core/services/auth-service';
import { User } from '@/lib/types/user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      initialize: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, error } = await authService.signIn(email, password);

          if (error) {
            set({ error: error.message, isLoading: false });
            throw new Error(error.message);
          }

          set({ user, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, error } = await authService.signUp(email, password);

          if (error) {
            set({ error: error.message, isLoading: false });
            throw new Error(error.message);
          }

          set({ user, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          const { error } = await authService.signOut();

          if (error) {
            set({ error: error.message, isLoading: false });
            throw new Error(error.message);
          }

          set({ user: null, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await authService.resetPassword(email);

          if (error) {
            set({ error: error.message, isLoading: false });
            throw new Error(error.message);
          }

          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      updatePassword: async (newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await authService.updatePassword(newPassword);

          if (error) {
            set({ error: error.message, isLoading: false });
            throw new Error(error.message);
          }

          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
