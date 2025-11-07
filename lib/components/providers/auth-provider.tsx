'use client';

/**
 * Auth Provider
 * Initialise l'auth store au chargement de l'application
 */

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
