/**
 * Match Detail Page Components
 *
 * Reusable components for loading and error states.
 * These are client components for interactivity but can also be used in server context.
 */

"use client";

import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

/**
 * Loading Skeleton
 */
export function LoadingSkeleton() {
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
  );
}

/**
 * Error State
 */
interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Une erreur est survenue</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {/* Retry button - requires page reload in server component context */}
        <button
          onClick={() => window.location.reload()}
          className="w-full min-h-[44px] px-6 py-3 bg-navy text-white rounded-lg font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
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
  );
}
