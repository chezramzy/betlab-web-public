/**
 * Prediction Validation — Pure utility functions
 *
 * Compares predictions to actual match results for finished matches.
 * No side effects, no API calls — purely client-side comparison.
 */

import type {
  PredictionData,
  MatchResultPrediction,
} from "@/core/entities/predictions/prediction.entity"

// ── Types ────────────────────────────────────────────

export type PredictionOutcome = "correct" | "incorrect" | null

export interface ValidationResult {
  /** 1X2 prediction outcome */
  matchResultOutcome: PredictionOutcome
  /** Which outcome was predicted */
  predictedResult: "home" | "draw" | "away" | null
  /** Which outcome actually happened */
  actualResult: "home" | "draw" | "away" | null
  /** Best market opportunity outcome */
  bestMarketOutcome: PredictionOutcome
}

interface Score {
  home: number
  away: number
}

// ── Core functions ───────────────────────────────────

/**
 * Determines the actual match result from the final score.
 */
export function getActualResult(score: Score): "home" | "draw" | "away" {
  if (score.home > score.away) return "home"
  if (score.home < score.away) return "away"
  return "draw"
}

/**
 * Determines the predicted outcome from a match_result prediction.
 * Returns the outcome with the highest probability.
 */
export function getPredictedResult(
  prediction: MatchResultPrediction
): "home" | "draw" | "away" {
  const home = prediction.homeWin.probability
  const draw = prediction.draw.probability
  const away = prediction.awayWin.probability
  const max = Math.max(home, draw, away)
  if (max === home) return "home"
  if (max === draw) return "draw"
  return "away"
}

// ── Best market validation ───────────────────────────

/**
 * Parses a numeric line from a market label (e.g., "2_5" → 2.5, "1_5" → 1.5)
 */
function parseLine(raw: string): number | null {
  const cleaned = raw.replace(/_/g, ".").replace(/,/g, ".")
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

/**
 * Extracts the numeric line value from a market label string.
 */
function extractLineFromLabel(label: string): number | null {
  const matches = label.match(/(\d+[._]?\d*)/g)
  if (!matches || matches.length === 0) return null
  const last = matches[matches.length - 1] ?? ""
  return parseLine(last)
}

/**
 * Validates a best market opportunity label against the actual score.
 * Returns null for unrecognized or unvalidatable market types.
 */
export function validateBestMarket(
  rawLabel: string | undefined,
  score: Score
): PredictionOutcome {
  if (!rawLabel) return null

  const normalized = rawLabel
    .trim()
    .toLowerCase()
    .replace(/[.\s,]+/g, "_")

  const totalGoals = score.home + score.away

  // ── Over / Under (total) ──
  if (normalized.startsWith("over_")) {
    const line = extractLineFromLabel(normalized.replace(/^over_/, ""))
    if (line === null) return null
    return totalGoals > line ? "correct" : "incorrect"
  }
  if (normalized.startsWith("under_")) {
    const line = extractLineFromLabel(normalized.replace(/^under_/, ""))
    if (line === null) return null
    return totalGoals < line ? "correct" : "incorrect"
  }

  // ── BTTS ──
  if (normalized === "btts_yes" || normalized === "btts") {
    return score.home > 0 && score.away > 0 ? "correct" : "incorrect"
  }
  if (normalized === "btts_no") {
    return score.home === 0 || score.away === 0 ? "correct" : "incorrect"
  }

  // ── 1X2 ──
  if (normalized === "1x2_home") {
    return score.home > score.away ? "correct" : "incorrect"
  }
  if (normalized === "1x2_draw") {
    return score.home === score.away ? "correct" : "incorrect"
  }
  if (normalized === "1x2_away") {
    return score.home < score.away ? "correct" : "incorrect"
  }

  // ── Double chance ──
  if (normalized.startsWith("double_chance_") || normalized.startsWith("dc_")) {
    const dc = normalized.replace(/^(double_chance_|dc_)/, "").replace(/_/g, "")
    if (dc === "1x") {
      return score.home >= score.away ? "correct" : "incorrect"
    }
    if (dc === "12") {
      return score.home !== score.away ? "correct" : "incorrect"
    }
    if (dc === "x2") {
      return score.home <= score.away ? "correct" : "incorrect"
    }
    return null
  }

  // ── DNB (draw = push → null) ──
  if (normalized === "dnb_home") {
    if (score.home === score.away) return null // push
    return score.home > score.away ? "correct" : "incorrect"
  }
  if (normalized === "dnb_away") {
    if (score.home === score.away) return null // push
    return score.home < score.away ? "correct" : "incorrect"
  }

  // ── Home/Away over/under ──
  if (normalized.startsWith("home_over_")) {
    const line = extractLineFromLabel(normalized.replace(/^home_over_/, ""))
    if (line === null) return null
    return score.home > line ? "correct" : "incorrect"
  }
  if (normalized.startsWith("home_under_")) {
    const line = extractLineFromLabel(normalized.replace(/^home_under_/, ""))
    if (line === null) return null
    return score.home < line ? "correct" : "incorrect"
  }
  if (normalized.startsWith("away_over_")) {
    const line = extractLineFromLabel(normalized.replace(/^away_over_/, ""))
    if (line === null) return null
    return score.away > line ? "correct" : "incorrect"
  }
  if (normalized.startsWith("away_under_")) {
    const line = extractLineFromLabel(normalized.replace(/^away_under_/, ""))
    if (line === null) return null
    return score.away < line ? "correct" : "incorrect"
  }

  // ── Team totals ──
  const teamTotalsMatch = normalized.match(
    /^team_totals_(home|away)_(over|under)_(.+)$/
  )
  if (teamTotalsMatch) {
    const side = teamTotalsMatch[1]
    const direction = teamTotalsMatch[2]
    const line = extractLineFromLabel(teamTotalsMatch[3])
    if (line === null) return null
    const goals = side === "home" ? score.home : score.away
    if (direction === "over") return goals > line ? "correct" : "incorrect"
    return goals < line ? "correct" : "incorrect"
  }

  // ── Half-time / Asian handicap / corners → not validatable ──
  if (
    normalized.includes("ht_") ||
    normalized.includes("1h_") ||
    normalized.includes("asian") ||
    normalized.includes("handicap") ||
    normalized.includes("corner")
  ) {
    return null
  }

  // ── Unrecognized market → null ──
  return null
}

// ── Main validation ──────────────────────────────────

/**
 * Validates a prediction against the actual match result.
 * Returns null fields when validation is not possible.
 */
export function validatePrediction(
  prediction: PredictionData | undefined,
  score: Score | undefined,
  status: "scheduled" | "live" | "finished"
): ValidationResult {
  const empty: ValidationResult = {
    matchResultOutcome: null,
    predictedResult: null,
    actualResult: null,
    bestMarketOutcome: null,
  }

  if (status !== "finished" || !score || !prediction) return empty

  const actualResult = getActualResult(score)

  // Match result (1X2) validation
  let matchResultOutcome: PredictionOutcome = null
  let predictedResult: "home" | "draw" | "away" | null = null

  if (prediction.type === "match_result") {
    predictedResult = getPredictedResult(prediction)
    matchResultOutcome = predictedResult === actualResult ? "correct" : "incorrect"
  }

  // Best market validation — extract raw label from opportunities
  let bestMarketOutcome: PredictionOutcome = null
  if (prediction.type === "match_result") {
    const opps = prediction.analytics?.opportunities ?? []
    if (opps.length > 0) {
      const best = opps.reduce((acc, cur) => (cur.prob > acc.prob ? cur : acc))
      bestMarketOutcome = validateBestMarket(best.label, score)
    } else {
      // Fallback: best market is the 1X2 result itself
      bestMarketOutcome = matchResultOutcome
    }
  }

  return {
    matchResultOutcome,
    predictedResult,
    actualResult,
    bestMarketOutcome,
  }
}
