/**
 * Live scores API client — fetches real-time score updates.
 *
 * This file is imported from client components, so it must NOT
 * import from the server-only betlab-api/client.ts.
 * Uses NEXT_PUBLIC_API_BASE_URL directly (available client-side).
 */

import type { LiveScoresResponse } from "@/core/entities/fixtures/live-score.entity"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

/**
 * Fetch live scores from the backend.
 * Returns null on error (polling should not crash the UI).
 */
export async function fetchLiveScores(): Promise<LiveScoresResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fixtures/live`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
