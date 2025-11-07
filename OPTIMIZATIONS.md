# Optimisations de Performance Mobile - BetLab

Ce document récapitule toutes les optimisations mises en place pour maximiser les performances mobile de BetLab.

## Objectifs

- **Lighthouse Score**: 90+ sur mobile
- **Initial Load**: < 2 secondes
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

## Optimisations Implémentées

### 1. Images et Assets

#### next/image partout
- ✅ Tous les logos d'équipes utilisent `next/image`
- ✅ Tous les logos de ligues utilisent `next/image`
- ✅ Formats modernes (AVIF, WebP) activés
- ✅ Lazy loading par défaut
- ✅ Blur placeholder pour éviter CLS

**Fichiers modifiés:**
- `lib/components/home/match-card-compact.tsx`
- `lib/components/home/leagues-selector.tsx`
- `lib/components/cards/match-card.tsx` (déjà optimisé)

**Fichiers créés:**
- `lib/utils/image-loader.ts` - Loader custom pour images externes

**Configuration:**
- `next.config.ts` - Remote patterns, formats, device sizes

### 2. Code Splitting et Lazy Loading

#### Dynamic imports pour composants lourds
- ✅ Recharts components lazy loadés
- ✅ Confetti lazy loadé
- ✅ Skeletons pour loading states

**Fichiers créés:**
- `lib/components/lazy/index.tsx` - Système centralisé de lazy loading

**Usage:**
```tsx
import { LazyRadarChart, LazyAreaChart } from '@/lib/components/lazy'

// Dans votre composant
<LazyRadarChart data={data} />
```

### 3. Bundle Optimization

#### Analyse du bundle
```bash
pnpm analyze
```

#### Tree-shaking optimisé
- ✅ date-fns: import centralisé
- ✅ lucide-react: auto tree-shaking via Next.js
- ✅ Recharts: lazy loaded
- ✅ Console.log supprimés en production (sauf error/warn)

**Fichiers créés:**
- `lib/utils/date.ts` - Exports centralisés pour date-fns

**Configuration:**
- `next.config.ts` - optimizePackageImports pour packages lourds

**Usage:**
```tsx
// AVANT
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// APRÈS
import { format, fr } from '@/lib/utils/date'
```

### 4. React Query Optimizations

#### Configuration optimisée pour mobile
- ✅ Stale time: 5 minutes (réduit requêtes)
- ✅ GC time: 10 minutes (garde cache plus longtemps)
- ✅ Retry logic intelligent
- ✅ Skip queries si offline
- ✅ Pas de refetch au window focus (mobile)

**Fichiers créés:**
- `lib/config/react-query.ts` - Configuration centralisée
- Helpers de prefetch et invalidation

**Fichiers modifiés:**
- `lib/components/providers/query-provider.tsx` - Utilise config centralisée

### 5. Route Prefetching

#### Prefetch intelligent des routes
- ✅ Hook `usePrefetchRoutes` - prefetch multiple routes
- ✅ Hook `usePrefetchOnHover` - prefetch au hover/touch
- ✅ Hook `usePrefetchOnVisible` - prefetch si visible
- ✅ Hook `usePrefetchOnIntersection` - prefetch avec IntersectionObserver

**Fichiers créés:**
- `lib/utils/prefetch.ts` - Hooks de prefetching

**Usage:**
```tsx
// Dans HomePage
import { usePrefetchRoutes } from '@/lib/utils/prefetch'

function HomePage() {
  usePrefetchRoutes(['/matches', '/favorites', '/settings'])
  return <div>...</div>
}

// Dans MatchCard
import { usePrefetchOnHover } from '@/lib/utils/prefetch'

function MatchCard({ matchId }) {
  const prefetchHandlers = usePrefetchOnHover(`/match/${matchId}`)
  return <div {...prefetchHandlers}>...</div>
}
```

### 6. Fonts Optimization

#### Google Fonts optimisés
- ✅ `display: swap` - évite FOUT
- ✅ Preload activé
- ✅ Fallbacks system fonts
- ✅ Seulement poids utilisés chargés

**Fichiers modifiés:**
- `app/layout.tsx` - Configuration Geist fonts

### 7. Performance Monitoring

#### Web Vitals tracking
- ✅ Monitoring CLS, FCP, FID, INP, LCP, TTFB
- ✅ Ratings (good/needs-improvement/poor)
- ✅ Envoi vers analytics (GA4, Vercel)
- ✅ Logging en développement

**Fichiers créés:**
- `lib/utils/performance.ts` - Utilities de monitoring
- `lib/components/web-vitals-reporter.tsx` - Composant reporter

**Fichiers modifiés:**
- `app/layout.tsx` - Inclut WebVitalsReporter

### 8. Build Configuration

#### Next.js config optimisé
- ✅ Bundle analyzer configuré
- ✅ Image optimization configuré
- ✅ Compiler optimizations activés
- ✅ Package imports optimisés

**Fichiers modifiés:**
- `next.config.ts` - Configuration complète
- `package.json` - Script `analyze`

## Scripts Disponibles

```bash
# Développement
pnpm dev

# Build production
pnpm build

# Analyser le bundle
pnpm analyze

# Linter
pnpm lint
```

## Checklist de Déploiement

Avant de déployer en production, vérifier:

- [ ] Build réussit sans erreurs: `pnpm build`
- [ ] Bundle analyzer exécuté: `pnpm analyze`
- [ ] Pas de bundles > 250kb
- [ ] Images optimisées (AVIF/WebP)
- [ ] Lazy loading activé sur composants lourds
- [ ] Web Vitals reporter activé
- [ ] Lighthouse score mobile > 90

## Optimisations Futures

### Phase 2 (à venir)
- [ ] Service Worker pour cache assets statiques
- [ ] PWA avec offline support
- [ ] Compression Brotli/Gzip
- [ ] Preconnect vers API domains
- [ ] Resource hints (dns-prefetch, preconnect)
- [ ] Critical CSS inline

### Phase 3 (à venir)
- [ ] CDN pour images (Cloudinary, ImageKit)
- [ ] Edge caching (Vercel, Cloudflare)
- [ ] ISR pour pages statiques
- [ ] Streaming SSR
- [ ] Partial Prerendering (PPR)

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Vitals](https://web.dev/vitals/)
- [React Query Performance](https://tanstack.com/query/latest/docs/framework/react/guides/performance)
- [Bundle Analysis](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)

## Support

Pour questions ou problèmes liés aux optimisations, créer une issue avec le label `performance`.
