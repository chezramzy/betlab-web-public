import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { betlabFetch } from "@/infra/services/betlab-api/client";
import { MATCH_DETAIL_CACHE } from "../cache/profile";
import type { MatchDetail } from "../domain/types";

interface ApiFixtureResponse {
  id: number;
  date: string;
  status: string;
  venue?: string;
  home_team: {
    id: number;
    name: string;
    logo: string;
  };
  away_team: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    season?: number;
    round?: string;
    logo?: string;
    country?: string;
  };
  goals?: {
    home: number | null;
    away: number | null;
  };
  score?: {
    halftime?: {
      home: number | null;
      away: number | null;
    };
    fulltime?: {
      home: number | null;
      away: number | null;
    };
  };
}

function transformMatchDetail(response: ApiFixtureResponse): MatchDetail {
  let mappedStatus: MatchDetail["status"] = "scheduled";
  if (["FT", "AET", "PEN"].includes(response.status)) {
    mappedStatus = "finished";
  } else if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(response.status)) {
    mappedStatus = "live";
  } else if (response.status === "NS") {
    mappedStatus = "scheduled";
  }

  return {
    id: response.id.toString(),
    fixtureId: response.id,
    homeTeam: {
      id: response.home_team.id,
      name: response.home_team.name,
      logo: response.home_team.logo,
    },
    awayTeam: {
      id: response.away_team.id,
      name: response.away_team.name,
      logo: response.away_team.logo,
    },
    league: {
      id: response.league.id,
      name: response.league.name,
      logo: response.league.logo ?? "",
      country: response.league.country ?? "",
    },
    kickoffTime: new Date(response.date),
    status: mappedStatus,
    score: response.goals
      ? {
          home: response.goals.home ?? 0,
          away: response.goals.away ?? 0,
        }
      : undefined,
    venue: response.venue,
  };
}

export const getMatchDetail = cache(async (fixtureId: number | string): Promise<MatchDetail> => {
  'use cache';
  const id = typeof fixtureId === "string" ? parseInt(fixtureId, 10) : fixtureId;
  cacheTag(MATCH_DETAIL_CACHE.tags.byFixture(id));
  cacheLife(MATCH_DETAIL_CACHE.life.detail);

  const data = await betlabFetch<ApiFixtureResponse>(`/api/fixtures/${id}`);
  return transformMatchDetail(data);
});

export const getLiveMatchDetail = cache(async (fixtureId: number | string): Promise<MatchDetail> => {
  'use cache';
  const id = typeof fixtureId === "string" ? parseInt(fixtureId, 10) : fixtureId;
  cacheTag(MATCH_DETAIL_CACHE.tags.byFixture(id));
  cacheLife(MATCH_DETAIL_CACHE.life.detail);

  const data = await betlabFetch<ApiFixtureResponse>(`/api/fixtures/${id}`);
  return transformMatchDetail(data);
});
