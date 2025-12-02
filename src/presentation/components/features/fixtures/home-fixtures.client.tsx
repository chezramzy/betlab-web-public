/**
 * Homepage Client Component
 *
 * Handles client-side UI interactions (filtering, search, navigation).
 * Receives server-fetched data as props.
 *
 * This separation allows:
 * - Server Component for data fetching (SEO, performance)
 * - Client Component for interactivity (filters, favorites)
 */

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  CalendarWidget,
  SearchBar,
  SportSelector,
  LeaguesSelector,
  PredictionsSelector,
  FiltersPanel,
  MatchList,
} from "@/presentation/components/features/fixtures";
import { useFixtureFilters } from "@/presentation/hooks/fixtures/use-fixture-filters";
import { Button } from "@/presentation/components/ui/button";
import type { MatchWithPrediction } from "@/core/entities/fixtures/fixture.entity";

interface HomeFixturesClientProps {
  initialMatches: MatchWithPrediction[];
}

export function HomeFixturesClient({ initialMatches }: HomeFixturesClientProps) {
  const router = useRouter();
  const normalizedMatches = useMemo<MatchWithPrediction[]>(() => {
    return initialMatches.map((match) => {
      const kickoffSource = match.kickoffTime;
      if (typeof kickoffSource === "string" || typeof kickoffSource === "number") {
        const parsedDate = new Date(kickoffSource);
        return {
          ...match,
          kickoffTime: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
        };
      }
      return match;
    });
  }, [initialMatches]);

  // Client-side filtering (no fetch, just local state)
  const {
    selectedDate,
    selectedLeagueId,
    selectedPredictionType,
    selectedConfidences,
    xGRange,
    minProbability,
    searchQuery,
    showAllMatches,
    setSelectedDate,
    setSelectedLeagueId,
    setSelectedPredictionType,
    setSelectedConfidences,
    setXGRange,
    setMinProbability,
    setSearchQuery,
    setShowAllMatches,
    leagues,
    filteredMatches,
    matchCountsByDate,
    otherMatchesCount,
  } = useFixtureFilters(normalizedMatches);

  // TODO: Fetch favorites server-side and pass as props
  const matchesWithState = filteredMatches;

  // Handlers
  const handleMatchClick = (matchId: string) => {
    router.push(`/match/${matchId}`);
  };

  return (
    <>
      {/* Filters & Search */}
      <div className="space-y-4">
        <CalendarWidget
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          matchCountsByDate={matchCountsByDate}
        />

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher une équipe ou une ligue..."
        />

        <SportSelector />

        <LeaguesSelector
          leagues={leagues}
          selectedLeagueId={selectedLeagueId}
          onLeagueChange={(id) => setSelectedLeagueId(id)}
        />

        <PredictionsSelector
          selectedType={selectedPredictionType}
          onTypeChange={(type) => setSelectedPredictionType(type)}
        />

        <FiltersPanel
          selectedConfidences={selectedConfidences}
          onConfidencesChange={setSelectedConfidences}
          xGRange={xGRange}
          onXGRangeChange={setXGRange}
          minProbability={minProbability}
          onMinProbabilityChange={setMinProbability}
        />
      </div>

      {/* Matches List */}
      <MatchList
        matches={matchesWithState}
        onMatchClick={handleMatchClick}
      />

      {/* Bouton pour afficher tous les matchs */}
      {otherMatchesCount > 0 && (
        <div className="px-4 py-6">
          <Button
            variant="outline"
            className="w-full py-6 text-base font-medium"
            onClick={() => setShowAllMatches(!showAllMatches)}
          >
            {showAllMatches ? (
              <>
                <ChevronUp className="mr-2 h-5 w-5" />
                Afficher moins de matchs
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-5 w-5" />
                Voir tous les matchs ({otherMatchesCount} autres)
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
