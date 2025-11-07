# Checklist d'Intégration UX Mobile

Utilisez cette checklist pour intégrer les améliorations UX mobile dans BetLab.

## Phase 1 : Configuration & Tests

- [ ] Démarrer le serveur de développement (`pnpm dev`)
- [ ] Accéder à la page de démo : `http://localhost:3000/example-mobile-ux`
- [ ] Tester tous les composants sur mobile (Chrome DevTools)
- [ ] Tester sur un appareil mobile réel si possible
- [ ] Vérifier que le haptic feedback fonctionne (mobile uniquement)

## Phase 2 : Page d'Accueil (Home)

### Pull-to-Refresh
- [ ] Intégrer `usePullToRefresh` sur la liste de matchs
- [ ] Ajouter `PullToRefreshIndicator`
- [ ] Tester le refresh des données
- [ ] Vérifier l'animation de l'indicateur

### Match Cards
- [ ] Wrapper les `MatchCard` avec `MatchCardSwipeable`
- [ ] Implémenter `onFavoriteToggle` avec optimistic update
- [ ] Implémenter `onShare` avec success toast
- [ ] Tester les swipes left/right
- [ ] Vérifier les indicateurs visuels pendant le swipe

### Loading States
- [ ] Remplacer les skeletons basiques par `MatchCardSkeleton`
- [ ] Afficher 3-5 skeletons pendant le chargement
- [ ] Tester l'animation pulse

### Empty State
- [ ] Afficher `EmptyState` quand aucun match
- [ ] Ajouter une action "Voir aujourd'hui"
- [ ] Utiliser l'icône `CalendarOff`

### Error State
- [ ] Afficher `ErrorState` en cas d'erreur de chargement
- [ ] Implémenter le retry avec `refetch`
- [ ] Tester le scénario d'erreur

### Buttons
- [ ] Remplacer les boutons de filtre par `RippleButton`
- [ ] Vérifier l'effet ripple au clic
- [ ] Tester le haptic feedback

## Phase 3 : Page de Détails Match

### Actions
- [ ] Utiliser `RippleButton` pour tous les CTA
- [ ] Ajouter haptic feedback sur "Placer un pari"
- [ ] Afficher `SuccessToast` après action réussie

### Pull-to-Refresh
- [ ] Intégrer pull-to-refresh pour rafraîchir les stats
- [ ] Tester le refresh des données en temps réel

### Loading States
- [ ] Utiliser `Skeleton` pour les stats en chargement
- [ ] Utiliser variant="circle" pour les logos d'équipes
- [ ] Utiliser variant="text" pour les noms

### Error Handling
- [ ] Afficher `ErrorState` si erreur de chargement des stats
- [ ] Implémenter retry

## Phase 4 : Page Favoris

### Optimistic Updates
- [ ] Implémenter `useOptimisticFavorite`
- [ ] Update immédiat de l'UI lors du retrait de favori
- [ ] Gérer le rollback en cas d'erreur API

### Empty State
- [ ] Afficher `EmptyState` quand aucun favori
- [ ] Ajouter action "Découvrir les matchs"
- [ ] Utiliser l'icône `Heart`

### Swipeable Cards
- [ ] Swipe left pour retirer des favoris
- [ ] Confirmation visuelle avec haptic feedback
- [ ] Success toast "Retiré des favoris"

## Phase 5 : Pages de Listes (Predictions, Résultats, etc.)

Pour chaque page :

### Pull-to-Refresh
- [ ] Intégrer `MobilePageWrapper` (méthode simple)
- [ ] OU utiliser `usePullToRefresh` manuellement
- [ ] Tester le refresh

### Loading
- [ ] Utiliser les skeletons appropriés
- [ ] Afficher 5-10 items pendant le chargement

### Empty State
- [ ] Afficher message approprié
- [ ] Ajouter action si applicable

### Error State
- [ ] Gérer les erreurs de chargement
- [ ] Implémenter retry

## Phase 6 : Composants Globaux

### Mobile Bottom Nav
- [ ] Convertir les boutons en `RippleButton`
- [ ] Ajouter haptic feedback sur navigation
- [ ] Tester l'effet ripple

### Mobile Header
- [ ] Utiliser `RippleButton` pour les boutons d'action
- [ ] Ajouter haptic feedback

### Modals/Sheets
- [ ] Utiliser `RippleButton` pour les actions
- [ ] Success toast pour confirmations
- [ ] Haptic feedback sur actions importantes

## Phase 7 : Formulaires

### Login/Register
- [ ] `RippleButton` pour le submit
- [ ] Success toast après inscription réussie
- [ ] Error state pour erreurs de validation
- [ ] Haptic feedback 'error' en cas d'échec

### Profil/Settings
- [ ] Success toast après sauvegarde
- [ ] Haptic feedback 'success' sur save
- [ ] Loading skeleton pendant le chargement

## Phase 8 : Touches Finales

### Touch Targets
- [ ] Vérifier que tous les boutons font ≥44x44px
- [ ] Augmenter le padding si nécessaire
- [ ] Tester sur mobile avec des gros doigts

### Performance
- [ ] Vérifier que les animations sont fluides (60fps)
- [ ] Tester sur appareil mobile mid-range
- [ ] Optimiser si ralentissements

### Accessibilité
- [ ] Vérifier les ARIA attributes
- [ ] Tester la navigation au clavier
- [ ] Vérifier le contraste des couleurs

### Cross-browser
- [ ] Tester sur Chrome mobile
- [ ] Tester sur Safari iOS
- [ ] Tester sur Samsung Internet
- [ ] Vérifier la dégradation gracieuse

## Phase 9 : Documentation & Code Review

### Code
- [ ] Supprimer les console.log de debug
- [ ] Ajouter des commentaires si nécessaire
- [ ] Vérifier les types TypeScript

### Documentation
- [ ] Mettre à jour le README si nécessaire
- [ ] Documenter les nouveaux composants customs
- [ ] Ajouter des exemples d'utilisation

### Tests
- [ ] Écrire des tests unitaires pour les hooks critiques
- [ ] Tester les edge cases
- [ ] Vérifier la couverture de code

## Phase 10 : Déploiement

### Pré-déploiement
- [ ] Build en production (`pnpm build`)
- [ ] Tester le build localement
- [ ] Vérifier qu'il n'y a pas d'erreurs console

### Post-déploiement
- [ ] Tester sur production avec mobile réel
- [ ] Vérifier les analytics (si configuré)
- [ ] Monitorer les erreurs (Sentry, etc.)

---

## Notes

- Priorité aux pages les plus utilisées (Home, Match Detail)
- Intégrer progressivement, page par page
- Tester après chaque intégration
- Demander des retours utilisateurs

## Ressources

- [Quick Start](./QUICK_START_MOBILE_UX.md)
- [Guide Complet](./MOBILE_UX_GUIDE.md)
- [Liste des Améliorations](./MOBILE_UX_IMPROVEMENTS.md)
- [Exemple de Code](../lib/components/examples/mobile-ux-example.tsx)

---

**Bonne intégration !** 🚀
