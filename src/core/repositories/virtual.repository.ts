import type { VirtualPick } from "@/core/entities/virtual/virtual-pick.entity";

export interface GetDailyVirtualPicksOptions {
    date?: string;
    minConfidence?: number;
    maxResults?: number;
    crossLeagueOnly?: boolean;
    leagueFilter?: string;
}

export interface IVirtualRepository {
    getDailyPicks(options?: GetDailyVirtualPicksOptions): Promise<VirtualPick[]>;
}
