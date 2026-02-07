"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/shared/utils"
import type { PredictionOutcome } from "./utils/prediction-validation"

interface PredictionValidationBadgeProps {
  outcome: PredictionOutcome
  /** "inline" for next to Prono chip, "overlay" for on probability bar segment */
  variant?: "inline" | "overlay"
  className?: string
}

export function PredictionValidationBadge({
  outcome,
  variant = "inline",
  className,
}: PredictionValidationBadgeProps) {
  if (outcome === null) return null

  const isCorrect = outcome === "correct"

  if (variant === "overlay") {
    return (
      <span
        className={cn(
          "absolute -top-1.5 -right-1.5 z-10",
          "w-4 h-4 rounded-full flex items-center justify-center",
          "shadow-xs ring-2 ring-white",
          isCorrect ? "bg-success" : "bg-error",
          className
        )}
        aria-label={isCorrect ? "Prono correct" : "Prono incorrect"}
      >
        {isCorrect ? (
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        ) : (
          <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        )}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold",
        isCorrect
          ? "bg-success/10 text-success"
          : "bg-error/10 text-error",
        className
      )}
      aria-label={isCorrect ? "Prono correct" : "Prono incorrect"}
    >
      {isCorrect ? (
        <>
          <Check className="w-3 h-3" strokeWidth={3} />
          <span>Bon</span>
        </>
      ) : (
        <>
          <X className="w-3 h-3" strokeWidth={3} />
          <span>Rate</span>
        </>
      )}
    </span>
  )
}
