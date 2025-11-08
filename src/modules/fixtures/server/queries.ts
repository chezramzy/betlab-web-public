import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { betlabFetch } from "@/infra/services/betlab-api/client";
import {
  getPredictions,
  type PredictionType,
  type PredictionData,
} from "@/modules/predictions/server/queries";
import { FIXTURES_CACHE } from "../cache/profile";
import type { Match, MatchWithPrediction } from "../domain/types";

interface ApiFixtureResponse {
  fixture?: {
    id: number;
    date: string;
    status?: {
      short: string;
    };
  };
  teams?: {
    home?: {
      id: number;
      name: string;
      logo: string;
    };
    away?: {
      id: number;
      name: string;
      logo: string;
    };
  };
  league?: {
    id: number;
    name: string;
    logo: string;
    country: string;
  };
  goals?: {
    home: number | null;
    away: number | null;
  };
}

function transformFixture(item: ApiFixtureResponse): Match {
  const fixtureId = item.fixture?.id ?? 0;
  const status = item.fixture?.status?.short ?? "NS";

  let mappedStatus: Match["status"] = "scheduled";
  if (["FT", "AET", "PEN"].includes(status)) {
    mappedStatus = "finished";
  } else if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status)) {
    mappedStatus = "live";
  }

  return {
    id: `${fixtureId}`,
    fixtureId,
    homeTeam: {
      id: item.teams?.home?.id ?? 0,
      name: item.teams?.home?.name ?? "Unknown",
      logo: item.teams?.home?.logo ?? "",
    },
    awayTeam: {
      id: item.teams?.away?.id ?? 0,
      name: item.teams?.away?.name ?? "Unknown",
      logo: item.teams?.away?.logo ?? "",
    },
    league: {
      id: item.league?.id ?? 0,
      name: item.league?.name ?? "Unknown",
      logo: item.league?.logo ?? "",
      country: item.league?.country ?? "",
    },
    kickoffTime: new Date(item.fixture?.date ?? Date.now()),
    status: mappedStatus,
    score: item.goals
      ? {
          home: item.goals.home ?? 0,
          away: item.goals.away ?? 0,
        }
      : undefined,
  };
}

export const getFixtures = cache(async (date: string): Promise<Match[]> => {
  'use cache';
  cacheTag(FIXTURES_CACHE.tags.byDate(date));
  cacheLife(FIXTURES_CACHE.life.byDate);

  const data = await betlabFetch<ApiFixtureResponse[]>("/api/fixtures", {
    searchParams: { date },
  });
  return data.map(transformFixture);
});

export const getLiveFixtures = cache(async (): Promise<Match[]> => {
  'use cache';
  cacheTag(FIXTURES_CACHE.tags.live());
  cacheLife(FIXTURES_CACHE.life.live);

  const data = await betlabFetch<ApiFixtureResponse[]>("/api/fixtures/live");
  return data.map(transformFixture);
});

export async function getTodayFixtures(date: Date = new Date()): Promise<Match[]> {
  const today = date.toISOString().split("T")[0];
  return getFixtures(today);
}

function mapPredictionsByFixture(predictions: PredictionData[]) {
  return predictions.reduce<Map<number, PredictionData>>((acc, prediction) => {
    if (prediction.fixtureId) {
      acc.set(prediction.fixtureId, prediction);
    }
    return acc;
  }, new Map());
}

export async function getTodayFixturesWithPredictions(options?: {
  date?: Date;
  type?: PredictionType;
}): Promise<MatchWithPrediction[]> {
  const date = options?.date ?? new Date();
  const predictionType = options?.type ?? "match_result";

  const matches = await getTodayFixtures(date);
  const fixtureIds = matches.map((match) => match.fixtureId);

  if (fixtureIds.length === 0) {
    return matches;
  }

  const predictions = await getPredictions(fixtureIds, predictionType);
  const predictionMap = mapPredictionsByFixture(predictions);

  return matches.map((match) => ({
    ...match,
    prediction: predictionMap.get(match.fixtureId),
  }));
}
