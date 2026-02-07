/**
 * Live Score Update — Entity types for real-time match data.
 */

export interface LiveScoreEvent {
  type: "goal" | "card"
  minute: number | null
  team: string | null
  player: string | null
  detail: string | null
}

export interface LiveScoreUpdate {
  fixtureId: number
  status: "live" | "halftime" | "break" | "finished"
  score: { home: number; away: number }
  minute: number | null
  homeTeam: string | null
  awayTeam: string | null
  events: LiveScoreEvent[]
}

export interface LiveScoresResponse {
  count: number
  fixtures: LiveScoreUpdate[]
  timestamp: string
}
