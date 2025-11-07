'use client';

/**
 * React Query Provider
 * Configure TanStack Query pour toute l'application
 * Optimisé pour performances mobile
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { queryClient } from '@/lib/config/react-query';

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
