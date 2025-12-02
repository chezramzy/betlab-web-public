/**
 * Theme Store (Zustand)
 * Light mode uniquement
 */

import { create } from 'zustand';

export type ThemeMode = 'light';

interface ThemeState {
  themeMode: ThemeMode;
}

export const useThemeStore = create<ThemeState>()(() => ({
  themeMode: 'light',
}));
