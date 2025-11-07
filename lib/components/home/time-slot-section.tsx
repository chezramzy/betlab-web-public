"use client"

/**
 * TimeSlotSection - Section créneau horaire avec collapse/expand
 *
 * Groupe les matchs par créneau horaire avec:
 * - Header cliquable avec titre du créneau
 * - Compteur de matchs
 * - Collapse/expand avec animation smooth
 * - Icon chevron rotatif
 * - Touch-friendly (min 44px touch target)
 * - Support dark mode
 *
 * @example
 * ```tsx
 * <TimeSlotSection
 *   title="Matin"
 *   matches={morningMatches}
 *   onMatchClick={(id) => router.push(`/matches/${id}`)}
 *   onFavoriteToggle={(id) => toggleFavorite(id)}
 * />
 * ```
 */

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { MatchCardCompact, type Match } from "./match-card-compact"
import { cn } from "@/lib/utils"

export interface TimeSlotSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Titre du créneau (Matin, Après-midi, Soirée, Nuit)
   */
  title: string

  /**
   * Liste des matchs du créneau
   */
  matches: Match[]

  /**
   * Callback au clic sur un match
   */
  onMatchClick: (matchId: string) => void

  /**
   * Callback au toggle favorite
   */
  onFavoriteToggle: (matchId: string) => void

  /**
   * Section initialement expanded
   * @default true
   */
  defaultExpanded?: boolean
}

const TimeSlotSection = React.forwardRef<HTMLDivElement, TimeSlotSectionProps>(
  (
    {
      title,
      matches,
      onMatchClick,
      onFavoriteToggle,
      defaultExpanded = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
    const contentRef = React.useRef<HTMLDivElement>(null)

    // Get emoji pour chaque créneau
    const getTimeSlotEmoji = (title: string) => {
      switch (title.toLowerCase()) {
        case "matin":
          return "🌅"
        case "après-midi":
          return "☀️"
        case "soirée":
          return "🌆"
        case "nuit":
          return "🌙"
        default:
          return "⚽"
      }
    }

    return (
      <div
        ref={ref}
        className={cn("space-y-3", className)}
        {...props}
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-lg",
            "bg-muted hover:bg-muted/80 transition-all",
            "min-h-[44px] touch-manipulation",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-expanded={isExpanded}
          aria-controls={`timeslot-${title}`}
          type="button"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{getTimeSlotEmoji(title)}</span>
            <span className="text-sm font-bold">{title}</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold",
                "bg-[var(--lime)] text-[var(--navy)]"
              )}
              aria-label={`${matches.length} match${matches.length > 1 ? "s" : ""}`}
            >
              {matches.length}
            </span>
          </div>

          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              !isExpanded && "-rotate-90"
            )}
            aria-hidden="true"
          />
        </button>

        {/* Matches - Collapsible */}
        <div
          id={`timeslot-${title}`}
          ref={contentRef}
          className={cn(
            "transition-all duration-300 overflow-hidden",
            isExpanded ? "opacity-100" : "opacity-0 max-h-0"
          )}
          aria-hidden={!isExpanded}
        >
          {isExpanded && (
            <div className="space-y-3 px-4">
              {matches.map((match) => (
                <MatchCardCompact
                  key={match.id}
                  match={match}
                  onClick={() => onMatchClick(match.id)}
                  onFavoriteToggle={() => onFavoriteToggle(match.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
)

TimeSlotSection.displayName = "TimeSlotSection"

export { TimeSlotSection }
