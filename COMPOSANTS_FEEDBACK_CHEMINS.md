# Chemins des Composants Feedback - BetLab

## Composants UI (lib/components/ui/)

### Composants shadcn/ui de base
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\skeleton.tsx`
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\alert.tsx`
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\alert-dialog.tsx`
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\button.tsx` (existant)

### Toast
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\sonner.tsx`

### Composants d'états personnalisés BetLab
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\spinner.tsx`
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\loading-state.tsx`
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\error-state.tsx`
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\empty-state.tsx`
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\success-animation.tsx`

### Skeleton Loaders spécialisés
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\skeleton-card.tsx`
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\skeleton-list.tsx`

### Export centralisé
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\index.ts`

## Exemples

### Composant de démonstration
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\examples\feedback-states-example.tsx`

## Documentation

- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\FEEDBACK_README.md`
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\BATCH1_AGENT4_RAPPORT.md`

## Configuration

### Layout (Toaster configuré)
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\app\layout.tsx`

### Configuration shadcn/ui
- `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\components.json`

## Import depuis n'importe où dans le projet

```tsx
import {
  // shadcn/ui base
  Skeleton,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,

  // Toast
  Toaster, // Déjà dans layout.tsx

  // États personnalisés BetLab
  Spinner,
  LoadingState,
  ErrorState,
  EmptyState,
  SuccessAnimation,

  // Skeleton Loaders
  SkeletonCard,
  SkeletonList,

  // Types
  SpinnerProps,
  LoadingStateProps,
  ErrorStateProps,
  EmptyStateProps,
  SuccessAnimationProps,
  SkeletonCardProps,
  SkeletonListProps,
} from "@/lib/components/ui"

// Toast (sonner)
import { toast } from "sonner"
```

## Exemple de page de démonstration

Pour créer une page de démonstration, créer :
`C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\app\examples\feedback\page.tsx`

```tsx
import { FeedbackStatesExample } from "@/lib/components/examples/feedback-states-example"

export default function FeedbackExamplesPage() {
  return <FeedbackStatesExample />
}
```

Puis visiter : `http://localhost:3000/examples/feedback`
