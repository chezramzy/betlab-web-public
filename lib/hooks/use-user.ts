/**
 * useUser Hook
 * Récupère l'utilisateur actuellement authentifié depuis le store
 */

'use client';

import { useAuthStore } from '@/lib/stores/auth-store';

export function useUser() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    user,
    isLoading,
  };
}
