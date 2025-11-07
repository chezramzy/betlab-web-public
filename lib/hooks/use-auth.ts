/**
 * useAuth Hook
 * Wrapper autour de authStore pour faciliter l'utilisation dans les composants
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useAuth() {
  const store = useAuthStore();

  // Auto-initialize authStore when component mounts
  useEffect(() => {
    store.initialize();
  }, []);

  return {
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: !!store.user,
    error: store.error,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    resetPassword: store.resetPassword,
    updatePassword: store.updatePassword,
    clearError: store.clearError,
  };
}
