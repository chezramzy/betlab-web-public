/**
 * Fixture Filters Hook
 *
 * Client-side hook for filtering and managing fixture display state.
 * This hook contains ONLY client-side logic (UI state, local filtering).
 * Data fetching is handled by Server Components.
 *
 * Migrated from lib/hooks/use-home-filters.ts
 */

"use client";

import { useState, useMemo } from "react";
import { useSportStore } from "@/presentation/hooks/stores/sport-store";
import type {
  Match,
  LeagueInfo,
  MatchCountByDate,
} from "@/core/entities/fixtures/fixture.entity";

// Type definitions for filters
export type PredictionType =
  | "all"
  | "internal"
  | "external"
  | "over15"
  | "btts"
  | "exact"
  | "htft"
  | "half"
  | "cleansheet"
  | "corners";
export type ConfidenceLevel = "low" | "medium" | "high";

// Popular league IDs - Ligues majeures du football mondial
// Ces ligues sont affichées par défaut sur la page d'accueil
export const POPULAR_LEAGUE_IDS = new Set([
  // Angleterre
  39, // Premier League
  40, // Championship (2ème division)
  // Espagne
  140, // La Liga
  // France
  61, // Ligue 1
  // Allemagne
  78, // Bundesliga
  79, // 2. Bundesliga
  // Italie
  135, // Serie A
  // Compétitions UEFA
  2, // UEFA Champions League
  3, // UEFA Europa League
  848, // UEFA Conference League
  // Autres ligues européennes majeures
  94, // Primeira Liga (Portugal)
  88, // Eredivisie (Netherlands)
  203, // Süper Lig (Turkey)
  // Coupes nationales majeures
  81, // DFB Pokal (Germany)
  137, // Coppa Italia (Italy)
  143, // Copa del Rey (Spain)
  // Amérique
  71, // Serie A (Brazil)
  128, // Liga MX (Mexico)
  253, // MLS (USA)
]);

/**
 * Vérifie si un match appartient à une ligue populaire
 */
export function isPopularLeague(leagueId: number): boolean {
  return POPULAR_LEAGUE_IDS.has(leagueId);
}

/**
 * Clean league name by removing group/girone suffixes
 * This helps group multiple instances of the same league (e.g., Champions League groups)
 */
function cleanLeagueName(name: string): string {
  return name
    .replace(/\s*-\s*(Group|Groupe|Grupo|Girone|Groep)\s+[A-Z0-9]+\s*$/i, "")
    .replace(/\s*-\s*(Phase|Stage|Round)\s+\d+\s*$/i, "")
    .replace(/\s*-\s*League\s+Stage\s*-\s*\d+\s*$/i, "")
    .trim();
}

/**
 * Hook for managing fixture filters and display state
 *
 * @param matches - Array of matches (typically from server-side fetch)
 * @returns Filter state, setters, and computed values (filtered matches, leagues, etc.)
 */
export function useFixtureFilters(matches: Match[]) {
  const { activeSport, setActiveSport } = useSportStore();

  // Filter state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | string | "all" | "favorites">(
    "all"
  );
  const [selectedPredictionType, setSelectedPredictionType] = useState<PredictionType>("internal");
  const [selectedConfidences, setSelectedConfidences] = useState<ConfidenceLevel[]>([]);
  const [xGRange, setXGRange] = useState<[number, number]>([0, 5]);
  const [minProbability, setMinProbability] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Par défaut, afficher uniquement les matchs des ligues populaires
  const [showAllMatches, setShowAllMatches] = useState(false);

  // Extract unique leagues from matches (grouped by cleaned name)
  const leagues = useMemo((): LeagueInfo[] => {
    const leagueMap = new Map<
      string,
      { id: string; name: string; logo: string; matchCount: number; isPopular: boolean }
    >();

    matches.forEach((match) => {
      const cleanedName = cleanLeagueName(match.league.name);
      const existing = leagueMap.get(cleanedName);

      if (existing) {
        existing.matchCount++;
      } else {
        leagueMap.set(cleanedName, {
          id: `${match.league.id}`,
          name: cleanedName,
          logo: match.league.logo,
          matchCount: 1,
          isPopular: POPULAR_LEAGUE_IDS.has(match.league.id),
        });
      }
    });

    // Convert to array and sort by match count (most matches first)
    return Array.from(leagueMap.values())
      .map((league) => ({
        id: parseInt(league.id, 10),
        name: league.name,
        logo: league.logo,
        country: "", // Not available in this aggregation
        matchCount: league.matchCount,
      }))
      .sort((a, b) => b.matchCount - a.matchCount);
  }, [matches]);

  // Séparer les matchs populaires des non-populaires
  const { popularMatches, otherMatches } = useMemo(() => {
    const popular: Match[] = [];
    const other: Match[] = [];

    matches.forEach((match) => {
      if (POPULAR_LEAGUE_IDS.has(match.league.id)) {
        popular.push(match);
      } else {
        other.push(match);
      }
    });

    return { popularMatches: popular, otherMatches: other };
  }, [matches]);

  // Filter matches based on current filter state
  const filteredMatches = useMemo(() => {
    // Choisir la base de matchs selon showAllMatches
    let filtered = showAllMatches ? [...matches] : [...popularMatches];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (m) =>
          m.homeTeam.name.toLowerCase().includes(query) ||
          m.awayTeam.name.toLowerCase().includes(query) ||
          m.league.name.toLowerCase().includes(query) ||
          cleanLeagueName(m.league.name).toLowerCase().includes(query)
      );
    }

    // Filter by league (uniquement si showAllMatches ou si une ligue spécifique est sélectionnée)
    if (selectedLeagueId === "favorites") {
      // Show only popular leagues
      filtered = filtered.filter((m) => POPULAR_LEAGUE_IDS.has(m.league.id));
    } else if (selectedLeagueId !== "all") {
      // Show specific league (by cleaned name to group variants)
      const leagueIdToFind = typeof selectedLeagueId === 'number' ? selectedLeagueId : parseInt(selectedLeagueId, 10);
      const selectedLeague = leagues.find((l) => {
        const leagueIdNum = typeof l.id === 'number' ? l.id : parseInt(l.id, 10);
        return leagueIdNum === leagueIdToFind;
      });
      if (selectedLeague) {
        const cleanedSelectedName = selectedLeague.name;
        filtered = filtered.filter((m) => cleanLeagueName(m.league.name) === cleanedSelectedName);
      }
    }

    // TODO: Add more filters (confidence, xG, probability) when predictions are integrated

    return filtered;
  }, [matches, popularMatches, selectedLeagueId, leagues, searchQuery, showAllMatches]);

  // Count matches by date (for CalendarWidget)
  // Note: Currently only has data for the fetched date
  // Will be expanded when we fetch multiple dates
  const matchCountsByDate = useMemo((): MatchCountByDate => {
    const counts: MatchCountByDate = {};
    matches.forEach((match) => {
      const date = match.kickoffTime.toISOString().split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  }, [matches]);

  return {
    // State
    selectedDate,
    activeSport,
    selectedLeagueId,
    selectedPredictionType,
    selectedConfidences,
    xGRange,
    minProbability,
    searchQuery,
    showAllMatches,

    // Setters
    setSelectedDate,
    setActiveSport,
    setSelectedLeagueId,
    setSelectedPredictionType,
    setSelectedConfidences,
    setXGRange,
    setMinProbability,
    setSearchQuery,
    setShowAllMatches,

    // Computed values
    leagues,
    filteredMatches,
    matchCountsByDate,
    otherMatchesCount: otherMatches.length,
    popularMatchesCount: popularMatches.length,
  };
}
