# Quick Reference - Mobile UX

## Import Rapide

```tsx
// Hooks
import { usePullToRefresh } from '@/lib/hooks/use-pull-to-refresh'
import { useHapticFeedback } from '@/lib/hooks/use-haptic-feedback'
import { useSuccessToast } from '@/lib/hooks/use-success-toast'

// Composants UI
import { PullToRefreshIndicator } from '@/lib/components/ui/pull-to-refresh-indicator'
import { RippleButton } from '@/lib/components/ui/ripple-button'
import { SuccessToast } from '@/lib/components/ui/success-toast'
import { Skeleton } from '@/lib/components/ui/skeleton'
import { EmptyState } from '@/lib/components/ui/empty-state'
import { ErrorState } from '@/lib/components/ui/error-state'

// Composants Cards
import { MatchCardSwipeable } from '@/lib/components/cards/match-card-swipeable'
import { MatchCardSkeleton } from '@/lib/components/cards/match-card-skeleton'

// Layouts
import { MobilePageWrapper } from '@/lib/components/layouts/mobile-page-wrapper'

// Utils
import { useOptimisticFavorite, useOptimisticList } from '@/lib/utils/optimistic'
```

## Utilisation Rapide

### 1. Page Mobile Simple (Recommandé)

```tsx
import { MobilePageWrapper } from '@/lib/components/layouts/mobile-page-wrapper'

export default function MyPage() {
  const { refetch } = useMyData()

  return (
    <MobilePageWrapper onRefresh={refetch}>
      {/* Votre contenu */}
    </MobilePageWrapper>
  )
}
```

### 2. Bouton avec Effet Ripple

```tsx
<RippleButton onClick={handleClick}>Click me</RippleButton>
```

### 3. Success Toast

```tsx
const { showSuccess } = useSuccessToast()

const handleSave = async () => {
  await save()
  showSuccess('Sauvegardé !')
}
```

### 4. Loading Skeleton

```tsx
if (isLoading) {
  return <MatchCardSkeleton />
}
```

### 5. Empty State

```tsx
if (data.length === 0) {
  return <EmptyState title="Aucune donnée" />
}
```

### 6. Error State

```tsx
if (isError) {
  return <ErrorState message={error.message} onRetry={refetch} />
}
```

### 7. Swipeable Card

```tsx
<MatchCardSwipeable
  matchId={match.id}
  isFavorite={isFavorite}
  onFavoriteToggle={toggleFavorite}
  onShare={shareMatch}
>
  <MatchCard match={match} />
</MatchCardSwipeable>
```

### 8. Haptic Feedback

```tsx
const { vibrate } = useHapticFeedback()

vibrate('light')   // Léger
vibrate('medium')  // Moyen
vibrate('heavy')   // Fort
vibrate('success') // Pattern succès
vibrate('error')   // Pattern erreur
```

### 9. Optimistic Favorite

```tsx
const { optimisticFavorites, addOptimisticFavorite } = useOptimisticFavorite(favorites)

const toggleFavorite = async (id: string) => {
  addOptimisticFavorite(id) // Update immédiat
  await api.toggleFavorite(id) // API call
}
```

## Snippets VS Code

| Snippet | Description |
|---------|-------------|
| `ptr-setup` | Pull to refresh complet |
| `mpw` | Mobile page wrapper |
| `rbtn` | Ripple button |
| `toast` | Success toast |
| `haptic` | Haptic feedback |
| `swipe-card` | Swipeable card |
| `opt-fav` | Optimistic favorite |
| `skeleton` | Loading skeleton |
| `empty` | Empty state |
| `error-state` | Error state |
| `mobile-page` | Page mobile complète |

## Props Principales

### MobilePageWrapper
```tsx
{
  children: ReactNode
  onRefresh?: () => Promise<void>
  enablePullToRefresh?: boolean
  className?: string
}
```

### RippleButton
```tsx
{
  onClick: () => void
  className?: string
  rippleColor?: string  // default: 'rgba(200, 220, 63, 0.5)'
  haptic?: boolean      // default: true
}
```

### MatchCardSwipeable
```tsx
{
  matchId: string
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onShare?: () => void
  children: ReactNode
}
```

### Skeleton
```tsx
{
  variant?: 'default' | 'circle' | 'text'
  animate?: boolean
  className?: string
}
```

## Pattern Complet

```tsx
'use client'

import { MobilePageWrapper } from '@/lib/components/layouts/mobile-page-wrapper'
import { useSuccessToast } from '@/lib/hooks/use-success-toast'
import { RippleButton } from '@/lib/components/ui/ripple-button'
import { MatchCardSkeleton } from '@/lib/components/cards/match-card-skeleton'
import { ErrorState } from '@/lib/components/ui/error-state'
import { EmptyState } from '@/lib/components/ui/empty-state'

export default function MyPage() {
  const { data, isLoading, isError, error, refetch } = useMyData()
  const { showSuccess } = useSuccessToast()

  const handleAction = async () => {
    await doSomething()
    showSuccess('Action réussie !')
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <MobilePageWrapper onRefresh={refetch}>
      <div className="p-4 space-y-4">
        <h1>Ma Page</h1>

        {isLoading ? (
          <>
            <MatchCardSkeleton />
            <MatchCardSkeleton />
          </>
        ) : data.length === 0 ? (
          <EmptyState title="Aucune donnée" />
        ) : (
          data.map(item => (
            <div key={item.id}>
              {/* Votre contenu */}
            </div>
          ))
        )}

        <RippleButton onClick={handleAction}>
          Action
        </RippleButton>
      </div>
    </MobilePageWrapper>
  )
}
```

## Documentation Complète

- **Quick Start**: `docs/QUICK_START_MOBILE_UX.md`
- **Guide Complet**: `docs/MOBILE_UX_GUIDE.md`
- **Checklist**: `docs/INTEGRATION_CHECKLIST.md`
- **Améliorations**: `docs/MOBILE_UX_IMPROVEMENTS.md`

## Page de Démo

```bash
pnpm dev
```

Accéder à: `http://localhost:3000/example-mobile-ux`
