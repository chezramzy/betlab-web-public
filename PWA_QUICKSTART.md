# PWA Quick Start - BetLab

Guide rapide pour démarrer avec la PWA BetLab.

## Installation

Les dépendances PWA sont déjà installées:
```bash
# Déjà fait
pnpm add -D sharp tsx
```

## 1. Générer les Assets (2 min)

### Option A: Tout générer en une commande
```bash
pnpm generate:pwa
```

### Option B: Étape par étape
```bash
# 1. Générer les icônes
pnpm generate:icons

# 2. Générer les splash screens
pnpm generate:splash
```

**Note**: Les scripts utilisent `public/logo.svg` si disponible, sinon `public/next.svg` en fallback.

## 2. Tester en Local (3 min)

### Build Production
Le Service Worker ne fonctionne qu'en production:

```bash
# Build
pnpm build

# Start en production
pnpm start
```

Ouvrir http://localhost:3000

### Vérifier PWA
1. Chrome DevTools > Application
2. Onglet "Manifest" - Vérifier le manifest
3. Onglet "Service Workers" - Vérifier le SW actif
4. Onglet "Storage" - Vérifier le cache

## 3. Tester l'Installation

### Android/Desktop Chrome
1. Ouvrir l'app
2. Attendre le prompt d'installation (après 3 visites ou 30s)
3. Cliquer "Installer"
4. OU: Menu > Installer BetLab

### iOS Safari
1. Ouvrir dans Safari
2. Bouton Partager (carré avec flèche)
3. "Sur l'écran d'accueil"
4. Confirmer

## 4. Utiliser les Hooks

### Share Button
```tsx
import { useShare } from '@/lib/hooks/use-share'
import { Share2 } from 'lucide-react'
import { Button } from '@/lib/components/ui/button'

export function MyComponent() {
  const { share, isSharing } = useShare()

  return (
    <Button
      onClick={() => share({
        title: 'Mon Match',
        text: 'Voir sur BetLab',
        url: window.location.href
      })}
      disabled={isSharing}
    >
      <Share2 /> Partager
    </Button>
  )
}
```

### Responsive Layout
```tsx
import { useBreakpoint } from '@/lib/hooks/use-breakpoint'

export function MyLayout() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()

  return (
    <div className={isMobile ? 'p-4' : 'p-8'}>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
```

### Device Detection
```tsx
import { hasNotch, isStandalone, getOS } from '@/lib/utils/device'

export function MyComponent() {
  const showNotchPadding = hasNotch()
  const isPWA = isStandalone()
  const os = getOS() // 'ios' | 'android' | 'other'

  return (
    <div className={showNotchPadding ? 'safe-top' : ''}>
      {isPWA && <p>App installée!</p>}
      {os === 'ios' && <p>Bienvenue sur iOS</p>}
    </div>
  )
}
```

## 5. Safe Areas iOS

### Classes CSS Disponibles
```tsx
// Padding individuel
<div className="safe-top">      {/* padding-top */}
<div className="safe-bottom">   {/* padding-bottom */}
<div className="safe-left">     {/* padding-left */}
<div className="safe-right">    {/* padding-right */}

// Padding combiné
<div className="safe-x">        {/* left + right */}
<div className="safe-y">        {/* top + bottom */}
<div className="safe-all">      {/* all sides */}

// Spécial navigation
<nav className="mobile-bottom-nav">  {/* 16px + safe-bottom */}
<header className="sticky-header">   {/* top: safe-top */}
```

### Inline avec env()
```tsx
<nav className="fixed bottom-0 pb-[env(safe-area-inset-bottom)]">
  Navigation
</nav>

<header className="sticky top-[env(safe-area-inset-top)]">
  Header
</header>
```

## 6. Dev Tools

### Responsive Indicator
Déjà actif en développement! Visible en bas à droite:
- Breakpoint actuel (XS, SM, MD, LG, XL, 2XL)
- Width en pixels
- Device type (Mobile/Tablet/Desktop)

### Désactiver temporairement
```tsx
// Dans app/layout.tsx, commenter:
// <ResponsiveIndicator />
```

## 7. Tester Offline

### Chrome DevTools
1. Ouvrir DevTools > Network
2. Cocher "Offline"
3. Recharger la page
4. Doit afficher la page /offline

### Service Worker
1. DevTools > Application > Service Workers
2. Cocher "Offline"
3. Tester la navigation

## 8. Audit Lighthouse

### Lancer l'audit PWA
```bash
# 1. Build production
pnpm build && pnpm start

# 2. Chrome DevTools > Lighthouse
# 3. Sélectionner "Progressive Web App"
# 4. Generate report
```

### Score attendu: 100/100

Critères PWA:
- ✅ Installable
- ✅ Works offline
- ✅ Fast
- ✅ Responsive
- ✅ Safe HTTPS (en production)

## 9. Déploiement

### Vérifier avant déploiement
- [ ] Logo BetLab remplacé dans public/logo.svg
- [ ] `pnpm generate:pwa` exécuté
- [ ] Screenshots créés (optionnel)
- [ ] URLs manifest.ts à jour
- [ ] Test sur device réel
- [ ] Lighthouse PWA: 100

### Vercel (recommandé)
```bash
# Le manifest et SW sont automatiquement inclus
vercel deploy --prod
```

### HTTPS Obligatoire
Les Service Workers nécessitent HTTPS en production.
Vercel, Netlify, etc. fournissent HTTPS automatiquement.

## 10. Customisation

### Modifier le manifest
```typescript
// app/manifest.ts
export default function manifest() {
  return {
    name: 'Votre nom',
    short_name: 'Nom court',
    theme_color: '#VOTRECOULEUR',
    // ...
  }
}
```

### Modifier les icônes
```bash
# 1. Remplacer public/logo.svg par votre logo
# 2. Regénérer
pnpm generate:pwa
```

### Modifier le Service Worker
```javascript
// public/sw.js
const CACHE_NAME = 'betlab-v2' // Incrémenter la version
// Modifier les stratégies de cache
```

## FAQ

### Le prompt d'installation n'apparaît pas
- Vérifier que c'est en production (`pnpm build && pnpm start`)
- Attendre 3 visites de pages OU 30 secondes
- Sur iOS: pas de prompt automatique, installation manuelle

### Le Service Worker ne se met pas à jour
- Incrémenter CACHE_NAME dans sw.js
- Hard refresh: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
- DevTools > Application > Service Workers > "Update"

### L'app offline ne fonctionne pas
- Vérifier que le SW est actif (DevTools > Application)
- Vérifier que /offline est dans STATIC_ASSETS du sw.js
- Tester en mode production uniquement

### Safe areas ne fonctionnent pas
- Tester sur device réel iOS (simulateur peut différer)
- Vérifier viewport dans app/layout.tsx
- Vérifier que viewport-fit=cover est bien configuré

## Ressources

- **Documentation complète**: PWA_SETUP.md
- **Liste fichiers**: PWA_FILES_CREATED.md
- **Rapport final**: PWA_RAPPORT_FINAL.md
- **Exemples**: lib/components/examples/

## Support

Pour toute question:
1. Consulter PWA_SETUP.md
2. Vérifier les exemples dans lib/components/examples/
3. Tester avec Lighthouse PWA

---

**Temps total**: 10 minutes pour setup complet
**Prêt pour production**: Après remplacement du logo et tests
