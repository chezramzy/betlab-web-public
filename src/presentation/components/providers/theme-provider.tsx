'use client';

/**
 * Theme Provider
 * Applique uniquement le mode light
 */

import React from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
