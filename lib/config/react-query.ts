/**
 * React Query Configuration
 *
 * Configuration optimisée pour performances mobile:
 * - Stale time adapté pour réduire les requêtes
 * - Garbage collection optimisé
 * - Retry logic intelligent
 * - Network mode aware
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Configuration par défaut optimisée pour mobile
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Données considérées "fresh" pendant 5 minutes
      staleTime: 5 * 60 * 1000,

      // Garde en cache pendant 10 minutes après inactivité
      gcTime: 10 * 60 * 1000, // anciennement cacheTime

      // Évite les refetch inutiles sur mobile
      refetchOnWindowFocus: false,

      // Refetch si reconnexion (utile sur mobile)
      refetchOnReconnect: true,

      // Retry logic intelligent
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Skip queries si offline
      networkMode: 'online' as const,
    },
    mutations: {
      retry: 1,
      networkMode: 'online' as const,
    },
  },
};

/**
 * Create query client instance
 */
export function createQueryClient() {
  return new QueryClient(queryClientConfig);
}

/**
 * Singleton query client pour l'application
 */
export const queryClient = createQueryClient();

/**
 * Prefetch strategies pour améliorer UX
 */

/**
 * Prefetch home data (fixtures du jour)
 * À appeler au chargement initial ou lors de la navigation vers home
 */
export async function prefetchHomeData() {
  const today = new Date().toISOString().split('T')[0];

  // Prefetch fixtures du jour
  // Note: Adapter selon votre API
  // await queryClient.prefetchQuery({
  //   queryKey: ['fixtures', today, 'football'],
  //   queryFn: fetchFixtures,
  //   staleTime: 5 * 60 * 1000,
  // });
}

/**
 * Prefetch match details
 * À appeler au hover ou avant navigation
 */
export async function prefetchMatchDetails(matchId: string) {
  // Note: Adapter selon votre API
  // await queryClient.prefetchQuery({
  //   queryKey: ['match', matchId],
  //   queryFn: () => fetchMatchDetails(matchId),
  //   staleTime: 5 * 60 * 1000,
  // });
}

/**
 * Invalidate strategies
 */

/**
 * Invalidate all fixtures queries
 * À appeler après un favori ajouté/retiré
 */
export function invalidateFixtures() {
  queryClient.invalidateQueries({ queryKey: ['fixtures'] });
}

/**
 * Invalidate specific match
 * À appeler après une update
 */
export function invalidateMatch(matchId: string) {
  queryClient.invalidateQueries({ queryKey: ['match', matchId] });
}
