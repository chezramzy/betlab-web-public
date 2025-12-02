/**
 * API Configuration
 * Basé sur lib/core/config/api_config.dart
 */

export const ApiConfig = {
  // Use local proxy in development to avoid CORS issues
  // In production, this should point to your actual API
  baseUrl: typeof window !== 'undefined'
    ? '/api/proxy'  // Client-side: use Next.js proxy
    : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fastapi-production-2b94.up.railway.app'), // Server-side: direct
  apiVersion: '', // Empty because proxy already includes /api
  defaultTimeout: 90000, // 90 seconds

  // Endpoints
  endpoints: {
    fixtures: '/api/fixtures',
    fixturesLive: '/api/fixtures/live',
    predictions: '/predictions',
    odds: '/odds',
    portfolio: '/portfolio',
    portfolioRecommendations: '/portfolio/recommendations',
    portfolioMatchOpportunities: '/portfolio/match-opportunities',
    teams: '/teams',
    standings: '/standings',
    venues: '/venues',
    metadata: '/metadata',
  },

  // Popular League IDs - Synchronisé avec use-fixture-filters.ts
  // Pour modifier cette liste, éditer POPULAR_LEAGUE_IDS dans use-fixture-filters.ts
  popularLeagueIds: new Set([
    // Angleterre
    39,   // Premier League
    40,   // Championship (2ème division)
    // Espagne
    140,  // La Liga
    // France
    61,   // Ligue 1
    // Allemagne
    78,   // Bundesliga
    79,   // 2. Bundesliga
    // Italie
    135,  // Serie A
    // Compétitions UEFA
    2,    // UEFA Champions League
    3,    // UEFA Europa League
    848,  // UEFA Conference League
    // Autres ligues européennes majeures
    94,   // Primeira Liga (Portugal)
    88,   // Eredivisie (Netherlands)
    203,  // Süper Lig (Turkey)
    // Coupes nationales majeures
    81,   // DFB Pokal (Germany)
    137,  // Coppa Italia (Italy)
    143,  // Copa del Rey (Spain)
    // Amérique
    71,   // Serie A (Brazil)
    128,  // Liga MX (Mexico)
    253,  // MLS (USA)
  ]),

  // Retry configuration
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    retryOn: [408, 429, 500, 502, 503, 504],
  },
} as const;

export type ApiEndpoint = keyof typeof ApiConfig.endpoints;
