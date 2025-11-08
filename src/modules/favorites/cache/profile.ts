import { cacheProfiles } from "@/core/cache/policies";

export const FAVORITES_CACHE = {
  tags: {
    byUser: (userId: string) => `user:favorites:${userId}`,
  },
  life: {
    byUser: cacheProfiles.userPrivate,
  },
} as const;
