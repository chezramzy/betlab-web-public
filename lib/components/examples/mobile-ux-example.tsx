'use client'

/**
 * Mobile UX Example - Démo des améliorations UX mobile
 *
 * Démontre:
 * - Pull-to-refresh
 * - Ripple button avec haptic feedback
 * - Success toast
 * - Loading skeletons améliorés
 * - Empty & Error states
 * - Optimistic updates
 */

import { useState } from 'react'
import { usePullToRefresh } from '@/lib/hooks/use-pull-to-refresh'
import { useSuccessToast } from '@/lib/hooks/use-success-toast'
import { useHapticFeedback } from '@/lib/hooks/use-haptic-feedback'
import { PullToRefreshIndicator } from '@/lib/components/ui/pull-to-refresh-indicator'
import { SuccessToast } from '@/lib/components/ui/success-toast'
import { RippleButton } from '@/lib/components/ui/ripple-button'
import { Skeleton } from '@/lib/components/ui/skeleton'
import { EmptyState } from '@/lib/components/ui/empty-state'
import { ErrorState } from '@/lib/components/ui/error-state'
import { Heart, Share2, RefreshCw, Inbox } from 'lucide-react'
import { MatchCardSkeleton } from '@/lib/components/cards/match-card-skeleton'

export function MobileUXExample() {
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3'])
  const [showEmpty, setShowEmpty] = useState(false)
  const [showError, setShowError] = useState(false)

  const { show, message, showSuccess, hideSuccess } = useSuccessToast()
  const { vibrate } = useHapticFeedback()

  // Pull to refresh
  const { scrollableRef, pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      showSuccess('Données rafraîchies !')
    },
    threshold: 80,
  })

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    showSuccess('Données rafraîchies !')
  }

  const handleLike = () => {
    vibrate('light')
    showSuccess('Ajouté aux favoris')
  }

  const handleShare = () => {
    vibrate('medium')
    showSuccess('Partagé avec succès')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Toast */}
      <SuccessToast
        show={show}
        message={message}
        onClose={hideSuccess}
      />

      {/* Main Content with Pull to Refresh */}
      <div
        ref={scrollableRef}
        className="relative min-h-screen overflow-y-auto"
      >
        <PullToRefreshIndicator
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
        />

        <div className="container mx-auto p-4 space-y-6 pt-16">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Mobile UX Demo</h1>
            <p className="text-sm text-muted-foreground">
              Démonstration des améliorations UX mobile
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4 p-4 bg-card rounded-lg border">
            <h2 className="font-semibold">Contrôles</h2>

            <div className="grid grid-cols-2 gap-2">
              <RippleButton
                onClick={handleRefresh}
                className="px-4 py-2 bg-navy text-white rounded-lg font-medium"
                haptic
              >
                <RefreshCw className="w-4 h-4 mr-2 inline" />
                Refresh
              </RippleButton>

              <RippleButton
                onClick={handleLike}
                className="px-4 py-2 bg-destructive text-white rounded-lg font-medium"
                rippleColor="rgba(255, 255, 255, 0.3)"
              >
                <Heart className="w-4 h-4 mr-2 inline" />
                Like
              </RippleButton>

              <RippleButton
                onClick={handleShare}
                className="px-4 py-2 bg-lime text-navy rounded-lg font-medium"
                rippleColor="rgba(0, 51, 102, 0.2)"
              >
                <Share2 className="w-4 h-4 mr-2 inline" />
                Share
              </RippleButton>

              <RippleButton
                onClick={() => setIsLoading(!isLoading)}
                className="px-4 py-2 border rounded-lg font-medium"
              >
                Toggle Loading
              </RippleButton>

              <RippleButton
                onClick={() => setShowEmpty(!showEmpty)}
                className="px-4 py-2 border rounded-lg font-medium"
              >
                Toggle Empty
              </RippleButton>

              <RippleButton
                onClick={() => setShowError(!showError)}
                className="px-4 py-2 border rounded-lg font-medium"
              >
                Toggle Error
              </RippleButton>
            </div>
          </div>

          {/* Skeleton Demo */}
          {isLoading && (
            <div className="space-y-4">
              <h2 className="font-semibold">Loading Skeletons</h2>

              {/* Text Skeletons */}
              <div className="space-y-2 p-4 bg-card rounded-lg border">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-full" />
                <Skeleton variant="text" className="w-5/6" />
              </div>

              {/* Circle Skeletons */}
              <div className="flex gap-4 p-4 bg-card rounded-lg border">
                <Skeleton variant="circle" className="w-12 h-12" />
                <Skeleton variant="circle" className="w-12 h-12" />
                <Skeleton variant="circle" className="w-12 h-12" />
              </div>

              {/* Match Card Skeleton */}
              <MatchCardSkeleton />
              <MatchCardSkeleton compact />
            </div>
          )}

          {/* Empty State Demo */}
          {showEmpty && !showError && (
            <EmptyState
              icon={<Inbox className="w-12 h-12" />}
              title="Aucune donnée"
              message="Il n'y a aucun élément à afficher pour le moment."
              action={{
                label: "Actualiser",
                onClick: handleRefresh,
              }}
            />
          )}

          {/* Error State Demo */}
          {showError && (
            <ErrorState
              title="Erreur de chargement"
              message="Impossible de charger les données. Veuillez réessayer."
              onRetry={handleRefresh}
            />
          )}

          {/* Normal Content */}
          {!showEmpty && !showError && !isLoading && (
            <div className="space-y-4">
              <h2 className="font-semibold">Liste d'items</h2>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-card rounded-lg border flex items-center justify-between"
                >
                  <span>{item}</span>
                  <div className="flex gap-2">
                    <RippleButton
                      onClick={handleLike}
                      className="p-2 rounded-full hover:bg-muted"
                    >
                      <Heart className="w-5 h-5" />
                    </RippleButton>
                    <RippleButton
                      onClick={handleShare}
                      className="p-2 rounded-full hover:bg-muted"
                    >
                      <Share2 className="w-5 h-5" />
                    </RippleButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold">Instructions</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Tirez vers le bas pour rafraîchir (sur mobile)</li>
              <li>• Appuyez sur les boutons pour sentir le feedback haptique</li>
              <li>• Les boutons ont un effet ripple au clic</li>
              <li>• Les toasts de succès apparaissent avec animation</li>
              <li>• Testez les différents états avec les boutons de contrôle</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
