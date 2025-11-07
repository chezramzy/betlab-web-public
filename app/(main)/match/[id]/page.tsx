"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { useMatchDetail } from "@/lib/hooks/use-match-detail"
import {
  MatchHeader,
  TabsNavigation,
  PredictionsTab,
  AnalysisTab,
  H2HTab,
  type TabId,
} from "@/lib/components/match-detail"

/**
 * Page dynamique de détails d'un match
 * Route: /match/[id]
 * Mobile-first avec tabs swipeable
 */
export default function MatchDetailPage() {
  const params = useParams()
  const matchId = params.id as string

  const [activeTab, setActiveTab] = useState<TabId>("predictions")

  // Fetch match details
  const { data: match, isLoading, isError, error, refetch } = useMatchDetail(matchId)

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />
  }

  // Error state
  if (isError || !match) {
    return (
      <ErrorState
        message={error?.message || "Impossible de charger les détails du match"}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header sticky avec infos du match */}
      <MatchHeader match={match} />

      {/* Navigation tabs sticky */}
      <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenu des tabs */}
      <div className="px-4 py-6 space-y-6 pb-safe">
        {activeTab === "predictions" && <PredictionsTab match={match} />}
        {activeTab === "analysis" && <AnalysisTab match={match} />}
        {activeTab === "h2h" && <H2HTab match={match} />}
      </div>
    </div>
  )
}

/**
 * Skeleton de chargement
 */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="h-[env(safe-area-inset-top)]" />
        <div className="container mx-auto px-4 py-4 h-[180px] space-y-4">
          {/* League info skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
            <div className="w-11 h-11 bg-muted rounded-full animate-pulse" />
          </div>

          {/* Teams skeleton */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-16 h-16 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="h-8 w-20 bg-muted rounded animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-16 h-16 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="sticky top-[180px] z-40 bg-background border-b">
        <div className="flex items-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 py-4 flex justify-center">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="px-4 py-6 space-y-4">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-foreground/90 text-background rounded-full shadow-lg">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Chargement...</span>
      </div>
    </div>
  )
}

/**
 * État d'erreur avec bouton retry
 */
interface ErrorStateProps {
  message: string
  onRetry: () => void
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Une erreur est survenue</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {/* Retry button - Touch target ≥44px */}
        <button
          onClick={onRetry}
          className="w-full min-h-[44px] px-6 py-3 bg-navy dark:bg-lime text-white dark:text-navy rounded-lg font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>

        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="w-full min-h-[44px] px-6 py-3 border rounded-lg font-medium active:scale-95 transition-transform"
        >
          Retour
        </button>
      </div>
    </div>
  )
}
