/**
 * Fixtures Feature Module
 *
 * Centralizes exports for the fixtures feature.
 * Import from this file for better tree-shaking and maintainability.
 */

// Domain
export type {
  Match,
  LeagueInfo,
  MatchCountByDate,
  MatchWithPrediction,
  FixtureFilters,
} from "./domain/types";

// Hooks
export { useFixtureFilters } from "./ui/hooks/use-fixture-filters";
export type { PredictionType, ConfidenceLevel } from "./ui/hooks/use-fixture-filters";

// Components
// HomeFixturesSection - Server Component, import directly from ./ui/components/home-fixtures-section
export { HomeFixturesClient } from "./ui/components/home-fixtures.client";

// Server helpers - DO NOT export from barrel file
// Import directly from './server/queries' in Server Components only
// export { getFixtures, getTodayFixtures, getTodayFixturesWithPredictions } from "./server/queries";
