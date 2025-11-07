# Quick Start - Améliorations UX Mobile

Guide rapide pour intégrer les améliorations UX mobile dans vos pages.

## 1. Page avec Pull-to-Refresh (Méthode Simple)

Utilisez le `MobilePageWrapper` pour une intégration automatique :

```tsx
import { MobilePageWrapper } from '@/lib/components/layouts/mobile-page-wrapper'

export default function MyPage() {
  const { data, refetch } = useMyData()

  return (
    <MobilePageWrapper onRefresh={refetch}>
      {/* Votre contenu */}
    </MobilePageWrapper>
  )
}
```

## 2. Ajouter des Boutons avec Ripple Effect

Remplacez vos boutons standards par `RippleButton` :

```tsx
import { RippleButton } from '@/lib/components/ui/ripple-button'

// Avant
<button onClick={handleClick}>Click me</button>

// Après
<RippleButton onClick={handleClick} className="...">
  Click me
</RippleButton>
```

## 3. Ajouter des Cards Swipeable

Wrappez vos cards existantes :

```tsx
import { MatchCardSwipeable } from '@/lib/components/cards/match-card-swipeable'

<MatchCardSwipeable
  matchId={match.id}
  isFavorite={isFavorite}
  onFavoriteToggle={toggleFavorite}
  onShare={shareMatch}
>
  <MatchCard match={match} />
</MatchCardSwipeable>
```

## 4. Afficher un Success Toast

```tsx
import { useSuccessToast } from '@/lib/hooks/use-success-toast'

const { showSuccess } = useSuccessToast()

const handleSave = async () => {
  await save()
  showSuccess('Sauvegardé avec succès !')
}
```

## 5. Loading States

```tsx
import { MatchCardSkeleton } from '@/lib/components/cards/match-card-skeleton'

if (isLoading) {
  return (
    <>
      <MatchCardSkeleton />
      <MatchCardSkeleton />
      <MatchCardSkeleton />
    </>
  )
}
```

## 6. Empty & Error States

```tsx
import { EmptyState } from '@/lib/components/ui/empty-state'
import { ErrorState } from '@/lib/components/ui/error-state'

if (isError) {
  return <ErrorState message={error.message} onRetry={refetch} />
}

if (data.length === 0) {
  return <EmptyState title="Aucun résultat" message="..." />
}
```

## 7. Optimistic Updates (Favoris)

```tsx
import { useOptimisticFavorite } from '@/lib/utils/optimistic'

const [favorites, setFavorites] = useState<string[]>([])
const { optimisticFavorites, addOptimisticFavorite } = useOptimisticFavorite(favorites)

const toggleFavorite = async (id: string) => {
  // UI update immédiat
  addOptimisticFavorite(id)

  // API call
  await api.toggleFavorite(id)

  // Update real state
  setFavorites(prev =>
    prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
  )
}
```

## Exemple Complet

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

## Checklist d'Intégration

Pour chaque page :

- [ ] Utiliser `MobilePageWrapper` pour pull-to-refresh
- [ ] Remplacer les boutons importants par `RippleButton`
- [ ] Ajouter `MatchCardSkeleton` pendant le loading
- [ ] Gérer les états vides avec `EmptyState`
- [ ] Gérer les erreurs avec `ErrorState`
- [ ] Afficher `SuccessToast` sur les actions réussies
- [ ] Wrapper les cards avec `MatchCardSwipeable` si applicable
- [ ] Utiliser optimistic updates pour les favoris

## Test Rapide

1. Démarrer le serveur :
   ```bash
   pnpm dev
   ```

2. Accéder à la page de démo :
   ```
   http://localhost:3000/example-mobile-ux
   ```

3. Tester sur mobile (Chrome DevTools > Toggle device toolbar)

## Ressources

- [Guide complet](./MOBILE_UX_GUIDE.md)
- [Liste des améliorations](./MOBILE_UX_IMPROVEMENTS.md)
- [Exemple de code](../lib/components/examples/mobile-ux-example.tsx)

---

C'est tout ! Votre page est maintenant optimisée pour mobile 🎉
