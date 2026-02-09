"use client"

/**
 * useLiveScores — Polls backend for live score updates every 30 s.
 *
 * Only polls when there are live or imminent (< 2h) matches.
 * Merges live data into the existing match list without re-render storms.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { fetchLiveScores } from "@/infrastructure/services/betlab-api/live"
import type { MatchWithPrediction } from "@/core/entities/fixtures/fixture.entity"
import type { LiveScoreUpdate } from "@/core/entities/fixtures/live-score.entity"

const POLL_INTERVAL = 30_000 // 30 seconds
const IMMINENT_THRESHOLD = 2 * 60 * 60 * 1000 // 2 hours in ms

interface UseLiveScoresResult {
  matches: MatchWithPrediction[]
  isLive: boolean
  lastUpdate: Date | null
}

function mapLiveStatus(
  status: LiveScoreUpdate["status"]
): MatchWithPrediction["status"] {
  if (status === "live" || status === "halftime" || status === "break") return "live"
  if (status === "finished") return "finished"
  return "live"
}

function hasLiveOrImminentMatches(matches: MatchWithPrediction[]): boolean {
  const now = Date.now()
  for (const m of matches) {
    if (m.status === "live") return true
    if (m.status === "scheduled") {
      const kickoff =
        m.kickoffTime instanceof Date
          ? m.kickoffTime.getTime()
          : new Date(m.kickoffTime).getTime()
      if (kickoff - now < IMMINENT_THRESHOLD && kickoff > now) return true
    }
  }
  return false
}

function mergeScores(
  matches: MatchWithPrediction[],
  updates: LiveScoreUpdate[]
): MatchWithPrediction[] {
  if (updates.length === 0) return matches

  const updateMap = new Map<number, LiveScoreUpdate>()
  for (const u of updates) {
    updateMap.set(u.fixtureId, u)
  }

  let changed = false
  const merged = matches.map((match) => {
    const update = updateMap.get(match.fixtureId)
    if (!update) return match

    const newStatus = mapLiveStatus(update.status)
    const scoreChanged =
      match.score?.home !== update.score.home ||
      match.score?.away !== update.score.away ||
      (update.score.halftime &&
        (match.score?.halftime?.home !== update.score.halftime.home ||
          match.score?.halftime?.away !== update.score.halftime.away))
    const statusChanged = match.status !== newStatus
    const elapsedChanged = (update.minute ?? null) !== (match.elapsed ?? null)

    if (!scoreChanged && !statusChanged && !elapsedChanged) return match

    changed = true
    return {
      ...match,
      status: newStatus,
      score: {
        home: update.score.home,
        away: update.score.away,
        halftime: update.score.halftime ?? match.score?.halftime,
      },
      elapsed: update.minute ?? match.elapsed,
    }
  })

  return changed ? merged : matches
}

export function useLiveScores(
  matches: MatchWithPrediction[],
  enabled: boolean = true
): UseLiveScoresResult {
  const [liveMatches, setLiveMatches] = useState(matches)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const matchesRef = useRef(matches)

  // Keep ref in sync with incoming matches (when filters change, date changes, etc.)
  useEffect(() => {
    matchesRef.current = matches
    setLiveMatches(matches)
  }, [matches])

  const shouldPoll = enabled && hasLiveOrImminentMatches(matches)

  const poll = useCallback(async () => {
    const response = await fetchLiveScores()
    if (!response || !response.fixtures) return

    setLiveMatches((prev) => {
      const merged = mergeScores(prev, response.fixtures)
      matchesRef.current = merged
      return merged
    })
    setLastUpdate(new Date())
  }, [])

  useEffect(() => {
    if (!shouldPoll) return

    // Initial fetch
    poll()

    const intervalId = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(intervalId)
  }, [shouldPoll, poll])

  const isLive = liveMatches.some((m) => m.status === "live")

  return { matches: liveMatches, isLive, lastUpdate }
}
