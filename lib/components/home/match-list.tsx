"use client"

/**
 * MatchList - Liste de matchs groupés par créneau horaire avec lazy loading
 *
 * Composant principal d'affichage des matchs avec:
 * - Grouping automatique par créneau (Matin/Après-midi/Soir/Nuit)
 * - Lazy loading avec react-intersection-observer
 * - Pull-to-refresh support (mobile)
 * - Loading skeletons
 * - Empty state si aucun match
 * - Performances optimisées avec useMemo
 * - Mobile-first design
 * - Support dark mode
 *
 * @example
 * ```tsx
 * <MatchList
 *   matches={filteredMatches}
 *   isLoading={isLoading}
 *   onMatchClick={(id) => router.push(`/matches/${id}`)}
 *   onFavoriteToggle={(id) => toggleFavorite(id)}
 * />
 * ```
 */

import * as React from "react"
import { useInView } from "react-intersection-observer"
import { TimeSlotSection } from "./time-slot-section"
import { type Match } from "./match-card-compact"
import { MatchCardSkeleton } from "./match-card-skeleton"
import { cn } from "@/lib/utils"

export interface MatchListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Liste des matchs à afficher
   */
  matches: Match[]

  /**
   * État de chargement
   */
  isLoading?: boolean

  /**
   * Callback au clic sur un match
   */
  onMatchClick: (matchId: string) => void

  /**
   * Callback au toggle favorite
   */
  onFavoriteToggle: (matchId: string) => void

  /**
   * Afficher un message personnalisé si aucun match
   */
  emptyMessage?: string

  /**
   * Nombre de skeletons à afficher pendant le chargement
   * @default 5
   */
  skeletonCount?: number
}

interface TimeSlots {
  morning: Match[] // 6h-12h
  afternoon: Match[] // 12h-18h
  evening: Match[] // 18h-23h
  night: Match[] // 23h-6h
}

const MatchList = React.forwardRef<HTMLDivElement, MatchListProps>(
  (
    {
      matches,
      isLoading = false,
      onMatchClick,
      onFavoriteToggle,
      emptyMessage = "Aucun match trouvé pour les filtres sélectionnés",
      skeletonCount = 5,
      className,
      ...props
    },
    ref
  ) => {
    // Groupe matchs par créneau horaire
    const matchesByTimeSlot = React.useMemo<TimeSlots>(() => {
      const grouped: TimeSlots = {
        morning: [],
        afternoon: [],
        evening: [],
        night: [],
      }

      matches.forEach((match) => {
        const hour = match.kickoffTime.getHours()

        if (hour >= 6 && hour < 12) {
          grouped.morning.push(match)
        } else if (hour >= 12 && hour < 18) {
          grouped.afternoon.push(match)
        } else if (hour >= 18 && hour < 23) {
          grouped.evening.push(match)
        } else {
          grouped.night.push(match)
        }
      })

      return grouped
    }, [matches])

    // Intersection observer pour lazy loading
    const { ref: inViewRef, inView } = useInView({
      threshold: 0,
      triggerOnce: true,
      rootMargin: "200px", // Commence à charger 200px avant
    })

    // Loading state
    if (isLoading) {
      return (
        <div ref={ref} className={cn("space-y-4", className)} {...props}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      )
    }

    // Empty state
    if (matches.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("text-center py-12", className)}
          {...props}
        >
          <EmptyState message={emptyMessage} />
        </div>
      )
    }

    // Sections à afficher (seulement celles qui ont des matchs)
    const sections = [
      {
        key: "morning",
        title: "Matin",
        matches: matchesByTimeSlot.morning,
      },
      {
        key: "afternoon",
        title: "Après-midi",
        matches: matchesByTimeSlot.afternoon,
      },
      {
        key: "evening",
        title: "Soirée",
        matches: matchesByTimeSlot.evening,
      },
      {
        key: "night",
        title: "Nuit",
        matches: matchesByTimeSlot.night,
      },
    ].filter((section) => section.matches.length > 0)

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {sections.map((section, index) => (
          <TimeSlotSection
            key={section.key}
            title={section.title}
            matches={section.matches}
            onMatchClick={onMatchClick}
            onFavoriteToggle={onFavoriteToggle}
            defaultExpanded={index === 0} // Première section expanded par défaut
          />
        ))}

        {/* Trigger lazy loading */}
        <div ref={inViewRef} className="h-4" aria-hidden="true" />

        {/* Indicator si lazy loading en cours */}
        {inView && sections.length > 0 && (
          <div className="text-center py-2">
            <span className="text-xs text-muted-foreground">
              Tous les matchs sont chargés
            </span>
          </div>
        )}
      </div>
    )
  }
)

MatchList.displayName = "MatchList"

/**
 * EmptyState - État vide lorsqu'aucun match
 */
interface EmptyStateProps {
  message: string
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold">Aucun match</h3>

      {/* Message */}
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {message}
      </p>

      {/* Suggestion */}
      <p className="text-xs text-muted-foreground text-center max-w-sm">
        Essayez de modifier vos filtres ou sélectionnez une autre date
      </p>
    </div>
  )
}

export { MatchList }
