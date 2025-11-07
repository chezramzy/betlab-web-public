"use client"

import { useSportStore } from "@/lib/stores/sport-store"
import { SportType } from "@/lib/core/enums/sport-type"
import { cn } from "@/lib/utils"

export function SportSelector({ className }: { className?: string }) {
  const { activeSport, setActiveSport } = useSportStore()

  const sports = [
    { id: SportType.FOOTBALL, label: "Football", emoji: "⚽" },
    { id: SportType.BASKETBALL, label: "Basketball", emoji: "🏀" },
  ]

  return (
    <div className={cn("flex gap-2", className)}>
      {sports.map((sport) => {
        const isActive = activeSport === sport.id

        return (
          <button
            key={sport.id}
            onClick={() => setActiveSport(sport.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px]",
              isActive
                ? "bg-lime text-navy scale-105"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            aria-pressed={isActive}
            aria-label={`Sélectionner ${sport.label}`}
          >
            <span>{sport.emoji}</span>
            <span>{sport.label}</span>
          </button>
        )
      })}
    </div>
  )
}
