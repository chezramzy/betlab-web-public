# PWA Setup - BetLab

Ce document détaille l'implémentation complète de la Progressive Web App pour BetLab.

## Fonctionnalités PWA Implémentées

### 1. Manifest PWA
- **Fichier**: `app/manifest.ts`
- **Fonctionnalités**:
  - Nom de l'application: BetLab - Pronostics Sportifs IA
  - Mode standalone (full screen sans barre de navigation)
  - Icônes: 16x16, 32x32, 192x192, 512x512, 180x180 (Apple)
  - Screenshots pour mobile et desktop
  - Shortcuts pour accès rapide (Matchs du jour, Favoris)
  - Catégories: sports, utilities

### 2. Icônes et Splash Screens
- **Scripts**:
  - `scripts/generate-icons.ts` - Génère toutes les icônes PWA
  - `scripts/generate-splash-screens.ts` - Génère splash screens iOS
- **Commandes**:
  ```bash
  pnpm generate:icons    # Génère les icônes
  pnpm generate:splash   # Génère splash screens
  pnpm generate:pwa      # Génère tout (icônes + splash)
  ```
- **Icônes générées**:
  - icon-16.png, icon-32.png (favicon)
  - icon-192.png, icon-512.png (PWA Android)
  - icon-apple-touch.png (iOS)
- **Splash screens**:
  - iphone6.png (750x1334)
  - iphone12.png (1170x2532)
  - iphone14pro.png (1179x2556)
  - ipad.png (1536x2048)

### 3. Service Worker
- **Fichier**: `public/sw.js`
- **Stratégies de cache**:
  - **Network-first** pour les API calls
  - **Cache-first** pour les assets statiques (images, fonts)
  - **Stale-while-revalidate** pour les pages HTML
- **Offline support**: Fallback vers page `/offline`
- **Enregistrement**: `lib/components/pwa/service-worker-register.tsx`

### 4. Install Prompt
- **Fichier**: `lib/components/pwa/install-prompt.tsx`
- **Fonctionnalités**:
  - Prompt après 3 visites ou 30 secondes
  - Ne réapparaît pas pendant 7 jours après dismissal
  - Support beforeinstallprompt event
  - UI adaptée mobile/desktop

### 5. Web Share API
- **Hook**: `lib/hooks/use-share.ts`
- **Fonctionnalités**:
  - Partage natif si disponible
  - Fallback: copie dans presse-papier
  - Toast feedback
  - Gestion des erreurs

### 6. Responsive Design

#### Breakpoints
- **Hook**: `lib/hooks/use-breakpoint.ts`
- **Breakpoints Tailwind**:
  - xs: 0-639px (mobile)
  - sm: 640-767px (mobile large)
  - md: 768-1023px (tablet)
  - lg: 1024-1279px (desktop)
  - xl: 1280-1535px (desktop large)
  - 2xl: 1536px+ (desktop XL)

#### Responsive Indicator (dev only)
- **Fichier**: `lib/components/dev/responsive-indicator.tsx`
- Affiche le breakpoint actuel en bas à droite
- Visible uniquement en développement

### 7. Safe Area Insets (iOS)
- **CSS**: `app/globals.css`
- **Variables CSS**:
  ```css
  --safe-area-inset-top
  --safe-area-inset-bottom
  --safe-area-inset-left
  --safe-area-inset-right
  ```
- **Classes utilitaires**:
  - `.safe-top`, `.safe-bottom`, `.safe-left`, `.safe-right`
  - `.safe-x`, `.safe-y`, `.safe-all`
  - `.mobile-bottom-nav` (padding-bottom adaptatif)
  - `.sticky-header` (top adaptatif)

### 8. Device Detection
- **Fichier**: `lib/utils/device.ts`
- **Fonctions disponibles**:
  - `hasNotch()` - Détecte iPhone X+
  - `hasDynamicIsland()` - Détecte iPhone 14 Pro+
  - `isIOS()` - Détecte iOS
  - `isAndroid()` - Détecte Android
  - `isStandalone()` - Détecte si PWA installée
  - `isMobile()` - Détecte mobile
  - `isTablet()` - Détecte tablette
  - `getSafeAreaInsets()` - Retourne les insets
  - `getDeviceType()` - Retourne 'mobile' | 'tablet' | 'desktop'
  - `getOS()` - Retourne 'ios' | 'android' | 'other'
  - `canInstallPWA()` - Détecte si PWA peut être installée

### 9. Page Offline
- **Fichier**: `app/offline/page.tsx`
- **Fonctionnalités**:
  - Message clair hors ligne
  - Bouton retry
  - Conseils de dépannage
  - Design cohérent avec l'app

## Metadata SEO

### Viewport
- Width: device-width
- Initial scale: 1
- Maximum scale: 5
- User scalable: true
- Theme color adaptatif (light/dark)

### Metadata
- Title template: `%s | BetLab`
- Description SEO optimisée
- Open Graph (Facebook, LinkedIn)
- Twitter Card
- Apple Web App tags
- Format detection désactivée (téléphone)

## Installation PWA

### Android
1. Ouvrir l'app dans Chrome
2. Cliquer sur le prompt "Installer l'application"
3. OU Menu > Ajouter à l'écran d'accueil

### iOS
1. Ouvrir l'app dans Safari
2. Appuyer sur le bouton Partager (carré avec flèche)
3. Sélectionner "Sur l'écran d'accueil"
4. Confirmer

### Desktop (Chrome, Edge)
1. Ouvrir l'app
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou Menu > Installer BetLab

## Testing

### Test PWA en local
```bash
# Build production
pnpm build

# Start production server
pnpm start

# Ouvrir http://localhost:3000
# Le Service Worker ne fonctionne qu'en production
```

### Lighthouse PWA Audit
1. Ouvrir Chrome DevTools
2. Onglet Lighthouse
3. Sélectionner "Progressive Web App"
4. Générer le rapport

### Test sur devices réels

#### iOS
- Utilisez Safari (obligatoire)
- Testez avec/sans notch
- Vérifiez les safe area insets

#### Android
- Utilisez Chrome
- Testez l'install prompt
- Vérifiez le mode standalone

## Checklist PWA

- [x] Manifest PWA complet et valide
- [x] Icônes toutes tailles (16, 32, 192, 512, 180)
- [x] Splash screens iOS (iPhone 6, 12, 14 Pro, iPad)
- [x] Install prompt fonctionnel
- [x] Share API intégré
- [x] Service Worker avec offline support
- [x] Page offline créée
- [x] Responsive 320px-1920px
- [x] Safe area insets iOS
- [x] Notch/Dynamic Island handling
- [x] Metadata SEO complète
- [x] Device detection utils
- [x] Responsive indicator (dev)

## Prochaines Améliorations

### Court terme
- [ ] Push notifications
- [ ] Background sync pour requêtes échouées
- [ ] Cache API calls importants
- [ ] Add to home screen prompt iOS (instructions)

### Moyen terme
- [ ] Periodic background sync
- [ ] Share target API (recevoir des partages)
- [ ] File handling
- [ ] Badging API (notifications count)

### Long terme
- [ ] Web Bluetooth (connexion devices)
- [ ] Geolocation pour matchs à proximité
- [ ] Camera API pour scan QR codes
- [ ] Payment Request API

## Support Navigateurs

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Manifest | ✅ | ✅ | ✅ | ✅ |
| Install Prompt | ✅ | ❌* | ❌ | ✅ |
| Web Share | ✅ | ✅ | ❌ | ✅ |
| Safe Areas | ✅ | ✅ | ❌ | ✅ |

*Safari iOS supporte l'installation mais pas le beforeinstallprompt event

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA](https://web.dev/progressive-web-apps/)
- [Next.js: PWA](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- [iOS Safe Areas](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
