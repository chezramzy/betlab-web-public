/**
 * Route Prefetching Utilities
 *
 * Hooks pour prefetcher intelligemment les routes Next.js
 * Améliore la navigation et réduit le temps de chargement perçu
 */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Prefetch multiple routes après un délai
 * Utile pour prefetcher les routes probables depuis la page home
 *
 * @param routes - Array de routes à prefetch
 * @param delay - Délai avant prefetch (ms), défaut: 1000ms
 *
 * @example
 * ```tsx
 * function HomePage() {
 *   usePrefetchRoutes(['/matches', '/favorites', '/settings'])
 *   return <div>...</div>
 * }
 * ```
 */
export function usePrefetchRoutes(routes: string[], delay: number = 1000) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch après délai (évite de bloquer initial load)
    const timer = setTimeout(() => {
      routes.forEach((route) => {
        router.prefetch(route);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [routes, delay, router]);
}

/**
 * Hook pour prefetch au hover (desktop) ou au touch start (mobile)
 * Optimise la navigation en préchargeant la route avant le clic
 *
 * @param route - Route à prefetch
 * @returns Event handlers pour onMouseEnter et onTouchStart
 *
 * @example
 * ```tsx
 * function MatchCard({ matchId }) {
 *   const prefetchHandlers = usePrefetchOnHover(`/match/${matchId}`)
 *   return <div {...prefetchHandlers}>...</div>
 * }
 * ```
 */
export function usePrefetchOnHover(route: string) {
  const router = useRouter();

  const handlePrefetch = () => {
    router.prefetch(route);
  };

  return {
    onMouseEnter: handlePrefetch,
    onTouchStart: handlePrefetch,
  };
}

/**
 * Prefetch conditionnel basé sur la visibilité
 * Prefetch seulement quand l'élément est visible
 *
 * @param route - Route à prefetch
 * @param isVisible - Si l'élément est visible
 *
 * @example
 * ```tsx
 * function MatchCard({ matchId }) {
 *   const [ref, inView] = useInView()
 *   usePrefetchOnVisible(`/match/${matchId}`, inView)
 *   return <div ref={ref}>...</div>
 * }
 * ```
 */
export function usePrefetchOnVisible(route: string, isVisible: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (isVisible) {
      router.prefetch(route);
    }
  }, [route, isVisible, router]);
}

/**
 * Prefetch avec intersection observer
 * Prefetch automatiquement quand l'élément entre dans le viewport
 *
 * @param route - Route à prefetch
 * @returns Ref callback pour l'élément à observer
 *
 * @example
 * ```tsx
 * function MatchCard({ matchId }) {
 *   const ref = usePrefetchOnIntersection(`/match/${matchId}`)
 *   return <div ref={ref}>...</div>
 * }
 * ```
 */
export function usePrefetchOnIntersection(route: string) {
  const router = useRouter();

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        router.prefetch(route);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '50px', // Prefetch 50px avant que l'élément soit visible
    });

    return () => observer.disconnect();
  }, [route, router]);

  return (node: HTMLElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: '50px',
      });
      observer.observe(node);

      return () => observer.disconnect();
    }
  };
}
