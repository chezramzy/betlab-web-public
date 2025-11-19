'use client';

/**
 * Global application providers.
 * Only essential providers here. Route-specific providers go in route group layouts.
 */

import type { ReactNode } from 'react';
<<<<<<< HEAD
import { Suspense } from 'react';
=======
>>>>>>> 20b74ff64a22532f0e45488a34c0e5c32e6dc7bf
import { ThemeProvider } from '@/presentation/components/providers/theme-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Suspense>
  );
}
