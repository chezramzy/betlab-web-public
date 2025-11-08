import { cacheProfiles } from "@/core/cache/policies";

export const TEAMS_CACHE = {
  tags: {
    stats: (teamId: number) => `team-stats:${teamId}`,
  },
  life: {
    stats: cacheProfiles.metadata,
  },
} as const;
