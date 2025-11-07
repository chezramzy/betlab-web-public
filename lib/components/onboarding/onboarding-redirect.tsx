/**
 * Onboarding Redirect Component
 * Redirige automatiquement vers /onboarding si l'utilisateur n'a pas complété le flow
 */

"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';

interface OnboardingRedirectProps {
  children: React.ReactNode;
}

export function OnboardingRedirect({ children }: OnboardingRedirectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isCompleted } = useOnboardingStore();

  useEffect(() => {
    // Ne pas rediriger si on est déjà sur la page d'onboarding ou sur les pages publiques
    const publicPaths = ['/auth/login', '/auth/signup', '/auth/reset-password', '/onboarding'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

    if (isPublicPath) {
      return;
    }

    // Rediriger vers onboarding si l'utilisateur est authentifié mais n'a pas complété
    if (user && !isCompleted) {
      router.push('/onboarding');
    }
  }, [user, isCompleted, pathname, router]);

  return <>{children}</>;
}
