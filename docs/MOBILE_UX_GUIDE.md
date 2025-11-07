# Guide d'Intégration - Améliorations UX Mobile

Ce guide explique comment utiliser les nouveaux composants et hooks d'UX mobile dans BetLab.

## Table des matières

1. [Pull-to-Refresh](#pull-to-refresh)
2. [Ripple Button & Haptic Feedback](#ripple-button--haptic-feedback)
3. [Success Toast](#success-toast)
4. [Loading Skeletons](#loading-skeletons)
5. [Empty & Error States](#empty--error-states)
6. [Swipeable Cards](#swipeable-cards)
7. [Optimistic Updates](#optimistic-updates)

---

## Pull-to-Refresh

### Installation

```tsx
import { usePullToRefresh } from '@/lib/hooks/use-pull-to-refresh'
import { PullToRefreshIndicator } from '@/lib/components/ui/pull-to-refresh-indicator'
```

### Utilisation

```tsx
export default function HomePage() {
  const { data: matches, refetch } = useFixtures({ date: selectedDate })

  const { scrollableRef, pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await refetch()
    },
    threshold: 80, // Distance pour déclencher (optionnel, défaut: 80px)
    enabled: true, // Activer/désactiver (optionnel, défaut: true)
  })

  return (
    <div ref={scrollableRef} className="relative min-h-screen overflow-y-auto">
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
      />

      {/* Votre contenu */}
    </div>
  )
}
```

---

## Ripple Button & Haptic Feedback

### RippleButton

```tsx
import { RippleButton } from '@/lib/components/ui/ripple-button'

<RippleButton
  onClick={handleClick}
  className="px-4 py-2 bg-navy text-white rounded-lg"
  rippleColor="rgba(200, 220, 63, 0.5)" // Optionnel
  haptic={true} // Optionnel, défaut: true
>
  Cliquez-moi
</RippleButton>
```

### Haptic Feedback standalone

```tsx
import { useHapticFeedback } from '@/lib/hooks/use-haptic-feedback'

const { vibrate } = useHapticFeedback()

const handleLike = () => {
  vibrate('light') // 'light' | 'medium' | 'heavy' | 'success' | 'error'
  // Votre logique
}
```

---

## Success Toast

### Installation

```tsx
import { useSuccessToast } from '@/lib/hooks/use-success-toast'
import { SuccessToast } from '@/lib/components/ui/success-toast'
```

### Utilisation

```tsx
export default function MyPage() {
  const { show, message, showSuccess, hideSuccess } = useSuccessToast()

  const handleAction = async () => {
    await doSomething()
    showSuccess('Action réussie !')
  }

  return (
    <>
      <SuccessToast
        show={show}
        message={message}
        onClose={hideSuccess}
        duration={3000} // Optionnel, défaut: 3000ms
      />

      {/* Votre contenu */}
    </>
  )
}
```

---

## Loading Skeletons

### Skeleton amélioré

```tsx
import { Skeleton } from '@/lib/components/ui/skeleton'

// Variants disponibles
<Skeleton variant="default" className="w-full h-20" />
<Skeleton variant="circle" className="w-12 h-12" />
<Skeleton variant="text" className="w-3/4" />

// Désactiver l'animation
<Skeleton animate={false} className="w-full h-20" />
```

### Match Card Skeleton

```tsx
import { MatchCardSkeleton } from '@/lib/components/cards/match-card-skeleton'

// Version normale
<MatchCardSkeleton />

// Version compacte
<MatchCardSkeleton compact />
```

### Utilisation avec React Query

```tsx
const { data, isLoading } = useFixtures({ date })

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

---

## Empty & Error States

### Empty State

```tsx
import { EmptyState } from '@/lib/components/ui/empty-state'
import { CalendarOff } from 'lucide-react'

<EmptyState
  icon={<CalendarOff className="w-12 h-12" />}
  title="Aucun match trouvé"
  message="Il n'y a aucun match prévu pour cette date."
  action={{
    label: "Voir aujourd'hui",
    onClick: () => setDate(new Date()),
  }}
/>
```

### Error State

```tsx
import { ErrorState } from '@/lib/components/ui/error-state'

const { data, isError, error, refetch } = useFixtures({ date })

if (isError) {
  return (
    <ErrorState
      title="Erreur de chargement"
      message={error.message || 'Impossible de charger les matchs'}
      onRetry={() => refetch()}
      retryLabel="Réessayer" // Optionnel
    />
  )
}
```

---

## Swipeable Cards

### MatchCardSwipeable

```tsx
import { MatchCardSwipeable } from '@/lib/components/cards/match-card-swipeable'
import { MatchCard } from '@/lib/components/cards/match-card'

<MatchCardSwipeable
  matchId={match.id}
  isFavorite={favorites.includes(match.id)}
  onFavoriteToggle={() => toggleFavorite(match.id)}
  onShare={() => shareMatch(match.id)}
>
  <MatchCard match={match} />
</MatchCardSwipeable>
```

### Gestes

- **Swipe Left**: Ajouter/retirer des favoris (avec haptic feedback)
- **Swipe Right**: Partager le match (avec haptic feedback)
- Les indicateurs visuels apparaissent pendant le swipe

---

## Optimistic Updates

### Favoris optimistes

```tsx
import { useOptimisticFavorite } from '@/lib/utils/optimistic'

export default function MatchList({ initialFavorites }: Props) {
  const { optimisticFavorites, addOptimisticFavorite } = useOptimisticFavorite(initialFavorites)

  const toggleFavorite = async (matchId: string) => {
    // Mise à jour optimiste immédiate
    addOptimisticFavorite(matchId)

    // Requête serveur
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ matchId }),
      })
    } catch (error) {
      // Gérer l'erreur et potentiellement rollback
    }
  }

  return (
    <>
      {matches.map(match => (
        <MatchCard
          key={match.id}
          match={match}
          isFavorite={optimisticFavorites.includes(match.id)}
          onFavoriteToggle={() => toggleFavorite(match.id)}
        />
      ))}
    </>
  )
}
```

### Liste optimiste générique

```tsx
import { useOptimisticList } from '@/lib/utils/optimistic'

const { optimisticItems, addItem, updateItem, deleteItem } = useOptimisticList(initialItems)

// Ajouter un item
await addItem(newItem)

// Mettre à jour un item
await updateItem(updatedItem)

// Supprimer un item
await deleteItem(itemId)
```

---

## Exemple Complet

Voir le fichier `lib/components/examples/mobile-ux-example.tsx` pour un exemple complet intégrant toutes ces fonctionnalités.

## Checklist d'Intégration

- [ ] Pull-to-refresh sur toutes les listes
- [ ] Ripple effect sur tous les boutons importants
- [ ] Haptic feedback sur les actions importantes
- [ ] Loading skeletons réalistes
- [ ] Empty states avec illustrations
- [ ] Error states avec retry
- [ ] Success animations/toasts sur les actions
- [ ] Swipe gestures sur les cards
- [ ] Optimistic updates pour les favoris
- [ ] Tous les touch targets ≥44px (recommandation Apple/Google)

## Notes Importantes

1. **Performance**: Les animations utilisent `transform` et `opacity` pour de meilleures performances
2. **Accessibilité**: Tous les états ont des attributs ARIA appropriés
3. **Progressive Enhancement**: Les fonctionnalités dégradent gracieusement sur les navigateurs non supportés
4. **Haptic Feedback**: Fonctionne uniquement sur les appareils mobiles supportant l'API Vibration
5. **Pull-to-Refresh**: Utilise des event listeners natifs pour une expérience fluide

## Support Navigateurs

- Chrome/Edge: ✅ Complet
- Safari iOS: ✅ Complet
- Firefox: ✅ Complet (pas de vibration)
- Samsung Internet: ✅ Complet

## Ressources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Swipeable](https://github.com/FormidableLabs/react-swipeable)
- [Web Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
