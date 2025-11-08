/**
 * Match Detail Client Component
 *
 * ⚠️ SIMPLIFIED VERSION - Legacy components removed
 * Match detail components need to be migrated to features/match-detail/components/
 *
 * TODO: Migrate match-detail components to features-first architecture
 */

"use client";

import type { MatchDetail } from "@/modules/match-detail";

interface MatchDetailClientProps {
  match: MatchDetail;
}

export function MatchDetailClient({ match }: MatchDetailClientProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </h1>

        <div className="bg-card p-6 rounded-lg">
          <p className="text-muted-foreground mb-4">
            Match detail page - Components need migration to features/match-detail/
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>League:</strong> {match.league.name}</p>
            <p><strong>Date:</strong> {new Date(match.kickoffTime).toLocaleString()}</p>
            <p><strong>Fixture ID:</strong> {match.fixtureId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
