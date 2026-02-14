import "server-only";

import { cache } from "react";
import type { IVirtualRepository, GetDailyVirtualPicksOptions } from "@/core/repositories/virtual.repository";
import type { VirtualPick } from "@/core/entities/virtual/virtual-pick.entity";
import { betlabFetch } from "@/infrastructure/services/betlab-api/client";

async function fetchDailyPicks(options?: GetDailyVirtualPicksOptions): Promise<VirtualPick[]> {
    const searchParams: Record<string, string | number | boolean | undefined> = {};

    if (options?.date) searchParams.date = options.date;
    if (options?.minConfidence) searchParams.min_confidence = options.minConfidence;
    if (options?.maxResults) searchParams.max_results = options.maxResults;
    if (options?.crossLeagueOnly) searchParams.cross_league_only = options.crossLeagueOnly;
    if (options?.leagueFilter) searchParams.league_filter = options.leagueFilter;

    try {
        const picks = await betlabFetch<VirtualPick[]>("/api/virtual/daily-picks", {
            searchParams,
            cache: "no-store" // Ensure fresh data for daily picks
        });
        return picks;
    } catch (error) {
        console.error("Failed to fetch daily virtual picks:", error);
        return [];
    }
}

const cachedDailyPicks = cache(fetchDailyPicks);

export class BetlabVirtualRepository implements IVirtualRepository {
    async getDailyPicks(options?: GetDailyVirtualPicksOptions): Promise<VirtualPick[]> {
        return cachedDailyPicks(options);
    }
}

export const getVirtualRepository = (): IVirtualRepository => {
    return new BetlabVirtualRepository();
};
