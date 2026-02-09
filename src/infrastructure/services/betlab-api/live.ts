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
    const data = await res.json()
    if (!data || !Array.isArray(data.fixtures)) return null

    const fixtures = data.fixtures.map((fx: any) => {
      const statusShort = String(fx.status || "").toUpperCase()
      let status: LiveScoresResponse["fixtures"][number]["status"] = "live"
      if (statusShort === "HT") status = "halftime"
      else if (["FT", "AET", "PEN"].includes(statusShort)) status = "finished"
      else if (statusShort === "BT") status = "break"

      const goals = fx.goals ?? {}
      const score = fx.score ?? {}
      const halftime = score.halftime
      const home = goals.home ?? score.fulltime?.home ?? 0
      const away = goals.away ?? score.fulltime?.away ?? 0

      return {
        fixtureId: fx.id ?? 0,
        status,
        score: {
          home,
          away,
          halftime:
            halftime && halftime.home != null && halftime.away != null
              ? { home: halftime.home, away: halftime.away }
              : undefined,
        },
        minute: fx.elapsed ?? null,
        homeTeam: fx.home_team?.name ?? null,
        awayTeam: fx.away_team?.name ?? null,
        events: [],
      }
    })

    return {
      count: fixtures.length,
      fixtures,
      timestamp: data.last_update ?? new Date().toISOString(),
    }
  } catch {
    return null
  }
}
