import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { env } from "@/core/config/env";
import { TEAMS_CACHE } from "../cache/profile";
import type { TeamStats } from "../domain/types";

interface ApiTeamStatsResponse {
  stats: {
    team_id: number;
    attack: number;
    defense: number;
    possession: number;
    passing: number;
    shots: number;
    discipline: number;
    avg_goals_scored: number;
    avg_goals_conceded: number;
    clean_sheets: number;
    recent_form: string[];
  };
}

function transformTeamStats(apiStats: ApiTeamStatsResponse["stats"]): TeamStats {
  return {
    teamId: apiStats.team_id,
    attack: apiStats.attack,
    defense: apiStats.defense,
    possession: apiStats.possession,
    passing: apiStats.passing,
    shots: apiStats.shots,
    discipline: apiStats.discipline,
    avgGoalsScored: apiStats.avg_goals_scored,
    avgGoalsConceded: apiStats.avg_goals_conceded,
    cleanSheets: apiStats.clean_sheets,
    form: apiStats.recent_form.map((result) =>
      result === "W" || result === "D" || result === "L" ? result : "D"
    ),
  };
}

const apiBaseUrl = env.NEXT_PUBLIC_API_BASE_URL;

export const getTeamStats = cache(async (teamId: number): Promise<TeamStats> => {
  'use cache';
  const url = `${apiBaseUrl}/api/teams/${teamId}/stats`;
  cacheTag(TEAMS_CACHE.tags.stats(teamId));
  cacheLife(TEAMS_CACHE.life.stats);

  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    console.error(`Failed to fetch team stats for ${teamId}:`, response.statusText);
    throw new Error(`Failed to fetch team stats: ${response.statusText}`);
  }

  const data: ApiTeamStatsResponse = await response.json();
  return transformTeamStats(data.stats);
});
