# Guide Rapide - Utilisation des Optimisations

## Utiliser les Images Optimisées

```tsx
// ❌ AVANT
<img src={team.logo} alt={team.name} className="w-16 h-16" />

// ✅ APRÈS
import Image from 'next/image'
import { TEAM_LOGO_BLUR } from '@/lib/utils/image-loader'

<Image
  src={team.logo}
  alt={team.name}
  width={64}
  height={64}
  loading="lazy"
  quality={75}
  placeholder="blur"
  blurDataURL={TEAM_LOGO_BLUR}
/>
```

## Utiliser date-fns Optimisé

```tsx
// ❌ AVANT
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// ✅ APRÈS
import { format, fr } from '@/lib/utils/date'
```

## Lazy Loading de Composants Lourds

```tsx
// Lazy load Recharts
import { LazyRadarChart, ChartSkeleton } from '@/lib/components/lazy'

function MyComponent() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <LazyRadarChart data={data} />
    </Suspense>
  )
}
```

## Prefetch Intelligent de Routes

```tsx
// Prefetch au chargement de la page
import { usePrefetchRoutes } from '@/lib/utils/prefetch'

function HomePage() {
  // Prefetch après 1 seconde
  usePrefetchRoutes(['/matches', '/favorites', '/settings'])

  return <div>...</div>
}

// Prefetch au hover/touch
import { usePrefetchOnHover } from '@/lib/utils/prefetch'

function MatchCard({ matchId }) {
  const prefetchHandlers = usePrefetchOnHover(`/match/${matchId}`)

  return (
    <div {...prefetchHandlers}>
      {/* Card content */}
    </div>
  )
}
```

## React Query Optimisé

```tsx
// Déjà configuré globalement!
// Juste utiliser useQuery normalement

import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data } = useQuery({
    queryKey: ['fixtures', date],
    queryFn: fetchFixtures,
    // Les optimisations sont déjà appliquées:
    // - staleTime: 5 minutes
    // - gcTime: 10 minutes
    // - retry: 2
    // - etc.
  })
}
```

## Monitoring des Performances

```tsx
// Déjà activé dans app/layout.tsx!
// Les Web Vitals sont automatiquement trackés

// Pour mesures custom:
import { measureFunction } from '@/lib/utils/performance'

async function loadData() {
  const { result, duration } = await measureFunction('load-data', async () => {
    return await fetch('/api/data').then(r => r.json())
  })

  console.log(`Data loaded in ${duration}ms`)
  return result
}
```

## Scripts NPM

```bash
# Développement
pnpm dev

# Build production
pnpm build

# Analyser le bundle (IMPORTANT!)
pnpm analyze

# Linter
pnpm lint
```

## Vérifier les Optimisations

1. **Build successful**:
   ```bash
   pnpm build
   # Devrait réussir en ~15-20 secondes
   ```

2. **Analyser le bundle**:
   ```bash
   pnpm analyze
   # Ouvre le navigateur avec visualization
   ```

3. **Test local**:
   ```bash
   pnpm build && pnpm start
   # Ouvre http://localhost:3000
   # Ouvre DevTools > Network pour vérifier tailles
   ```

4. **Lighthouse Audit**:
   - Ouvrir Chrome DevTools
   - Onglet "Lighthouse"
   - Mode: Mobile
   - Catégories: Performance
   - Cliquer "Analyze page load"

## Objectifs de Performance

| Métrique | Target | Critical |
|----------|--------|----------|
| Lighthouse Score | 90+ | 80+ |
| Initial Load | < 2s | < 3s |
| LCP | < 2.5s | < 4s |
| INP | < 200ms | < 500ms |
| CLS | < 0.1 | < 0.25 |

## Troubleshooting

### Build échoue
```bash
# Supprimer .next et node_modules
rm -rf .next node_modules
pnpm install
pnpm build
```

### Images ne chargent pas
- Vérifier que le domaine est dans `next.config.ts` > `images.remotePatterns`
- Ajouter le domaine si nécessaire

### Web Vitals non trackés
- Vérifier console: devrait voir logs en dev
- Vérifier que `<WebVitalsReporter />` est dans layout
- Configurer analytics pour production

## Prochaines Optimisations

À implémenter selon priorité:

1. **Service Worker** (PWA offline)
2. **CDN pour images** (Cloudinary/ImageKit)
3. **ISR** pour pages statiques
4. **Compression Brotli**
5. **Resource hints** (preconnect, dns-prefetch)

Voir `OPTIMIZATIONS.md` pour détails complets.
