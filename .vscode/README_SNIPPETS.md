# VS Code Snippets - Mobile UX

Snippets VS Code pour faciliter l'intégration des composants UX mobile.

## Utilisation

Dans un fichier `.tsx`, tapez le préfixe du snippet puis appuyez sur `Tab`.

## Snippets Disponibles

### `ptr-setup` - Pull to Refresh Setup
Setup complet du pull-to-refresh avec hook et indicateur.

```tsx
// Tapez: ptr-setup + Tab
const { scrollableRef, pullDistance, isRefreshing } = usePullToRefresh({
  onRefresh: async () => {
    await refetch()
  },
  threshold: 80,
})
```

### `mpw` - Mobile Page Wrapper
Wrapper de page mobile avec pull-to-refresh intégré.

```tsx
// Tapez: mpw + Tab
<MobilePageWrapper onRefresh={refetch}>
  {/* content */}
</MobilePageWrapper>
```

### `rbtn` - Ripple Button
Bouton avec effet ripple et haptic feedback.

```tsx
// Tapez: rbtn + Tab
<RippleButton
  onClick={handleClick}
  className="px-4 py-2 bg-navy text-white rounded-lg"
  haptic={true}
>
  Button Text
</RippleButton>
```

### `toast` - Success Toast
Setup complet du success toast.

```tsx
// Tapez: toast + Tab
const { show, message, showSuccess, hideSuccess } = useSuccessToast()

const handleAction = async () => {
  await doSomething()
  showSuccess('Action réussie !')
}
```

### `haptic` - Haptic Feedback
Hook de haptic feedback.

```tsx
// Tapez: haptic + Tab
const { vibrate } = useHapticFeedback()

const handleClick = () => {
  vibrate('light') // light | medium | heavy | success | error
}
```

### `swipe-card` - Swipeable Card
Card avec gestes de swipe.

```tsx
// Tapez: swipe-card + Tab
<MatchCardSwipeable
  matchId={match.id}
  isFavorite={isFavorite}
  onFavoriteToggle={toggleFavorite}
  onShare={shareMatch}
>
  <MatchCard match={match} />
</MatchCardSwipeable>
```

### `opt-fav` - Optimistic Favorite
Optimistic update pour favoris.

```tsx
// Tapez: opt-fav + Tab
const { optimisticFavorites, addOptimisticFavorite } = useOptimisticFavorite(initialFavorites)

const toggleFavorite = async (id: string) => {
  addOptimisticFavorite(id)
  try {
    await api.toggleFavorite(id)
  } catch (error) {
    // Handle error
  }
}
```

### `skeleton` - Loading Skeleton
Liste de skeletons pour le loading.

```tsx
// Tapez: skeleton + Tab
if (isLoading) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </div>
  )
}
```

### `empty` - Empty State
Composant empty state.

```tsx
// Tapez: empty + Tab
<EmptyState
  icon={<Inbox className="w-12 h-12" />}
  title="Aucune donnée"
  message="Il n'y a aucun élément à afficher."
  action={{
    label: "Actualiser",
    onClick: handleRefresh,
  }}
/>
```

### `error-state` - Error State
Composant error state avec retry.

```tsx
// Tapez: error-state + Tab
<ErrorState
  title="Erreur de chargement"
  message={error.message || 'Impossible de charger les données'}
  onRetry={refetch}
/>
```

### `mobile-page` - Complete Mobile Page
Template complet de page mobile.

```tsx
// Tapez: mobile-page + Tab
'use client'

import { MobilePageWrapper } from '@/lib/components/layouts/mobile-page-wrapper'
// ... autres imports

export default function MyPage() {
  const { data, isLoading, isError, error, refetch } = useMyData()
  const { showSuccess } = useSuccessToast()

  if (isError) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <MobilePageWrapper onRefresh={refetch}>
      {/* Votre contenu */}
    </MobilePageWrapper>
  )
}
```

## Tips

- Appuyez sur `Tab` pour naviguer entre les champs à remplir
- Les valeurs par défaut sont suggérées
- Modifiez selon vos besoins

## Import Auto-Complete

VS Code devrait auto-importer les composants. Sinon, ajoutez manuellement :

```tsx
import { usePullToRefresh } from '@/lib/hooks/use-pull-to-refresh'
import { useHapticFeedback } from '@/lib/hooks/use-haptic-feedback'
import { useSuccessToast } from '@/lib/hooks/use-success-toast'
import { PullToRefreshIndicator } from '@/lib/components/ui/pull-to-refresh-indicator'
import { RippleButton } from '@/lib/components/ui/ripple-button'
import { SuccessToast } from '@/lib/components/ui/success-toast'
import { MatchCardSwipeable } from '@/lib/components/cards/match-card-swipeable'
import { MobilePageWrapper } from '@/lib/components/layouts/mobile-page-wrapper'
import { useOptimisticFavorite } from '@/lib/utils/optimistic'
```
