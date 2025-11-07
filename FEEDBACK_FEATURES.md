# Fonctionnalités des Composants Feedback - BetLab

## Vue d'ensemble

Cette documentation liste toutes les fonctionnalités disponibles pour chaque composant de feedback créé pour BetLab.

---

## 1. Spinner

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille du spinner (16px/24px/32px) |
| `variant` | `'primary' \| 'accent' \| 'white' \| 'muted'` | `'primary'` | Couleur du spinner |
| `label` | `string` | `'Chargement...'` | Label pour lecteurs d'écran |
| `className` | `string` | - | Classes CSS additionnelles |

### Variantes de couleurs

- **primary**: Navy (#1E3A8A) - Couleur principale BetLab
- **accent**: Lime (#84CC16) - Couleur accent BetLab
- **white**: Blanc - Pour fonds sombres
- **muted**: Texte secondaire - Pour effets discrets

### Exemples d'utilisation

```tsx
// Spinner par défaut
<Spinner />

// Petit spinner lime
<Spinner size="sm" variant="accent" />

// Grand spinner blanc sur fond sombre
<Spinner size="lg" variant="white" />

// Avec label personnalisé
<Spinner label="Chargement des matchs..." />
```

---

## 2. Loading State

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `mode` | `'inline' \| 'fullscreen'` | `'inline'` | Mode d'affichage |
| `message` | `string` | - | Message à afficher |
| `showOverlay` | `boolean` | `false` | Afficher un overlay backdrop |
| `spinnerSize` | `'sm' \| 'md' \| 'lg'` | `'lg'` | Taille du spinner |
| `spinnerVariant` | `'primary' \| 'accent' \| 'white' \| 'muted'` | `'primary'` | Couleur du spinner |
| `className` | `string` | - | Classes CSS additionnelles |

### Modes

- **inline**: S'affiche dans le conteneur parent (padding 8)
- **fullscreen**: Position fixe plein écran (z-50)

### Exemples d'utilisation

```tsx
// Loading inline simple
<LoadingState message="Chargement des données..." />

// Loading fullscreen avec overlay
<LoadingState
  mode="fullscreen"
  showOverlay
  message="Traitement en cours..."
  spinnerSize="lg"
/>

// Loading inline avec spinner lime
<LoadingState
  mode="inline"
  spinnerVariant="accent"
  message="Synchronisation..."
/>
```

---

## 3. Error State

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `title` | `string` | `'Une erreur s'est produite'` | Titre de l'erreur |
| `message` | `string` | `'Impossible de charger...'` | Description de l'erreur |
| `onRetry` | `() => void` | - | Callback du bouton retry |
| `retryLabel` | `string` | `'Réessayer'` | Label du bouton retry |
| `showIcon` | `boolean` | `true` | Afficher l'icône AlertCircle |
| `className` | `string` | - | Classes CSS additionnelles |

### Caractéristiques

- Icône AlertCircle (lucide-react) rouge (#EF4444)
- Bouton retry destructive (affiché si onRetry fourni)
- Attributs ARIA pour accessibilité (role="alert", aria-live="assertive")

### Exemples d'utilisation

```tsx
// Erreur simple
<ErrorState />

// Erreur avec retry
<ErrorState
  title="Impossible de charger les matchs"
  message="Vérifiez votre connexion internet"
  onRetry={() => refetch()}
/>

// Erreur personnalisée sans icône
<ErrorState
  title="Erreur de validation"
  message="Les données sont incorrectes"
  showIcon={false}
/>

// Avec React Query
const { error, refetch } = useQuery(...)
if (error) {
  return <ErrorState message={error.message} onRetry={refetch} />
}
```

---

## 4. Empty State

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `icon` | `React.ReactNode` | `<Inbox />` | Icône à afficher |
| `title` | `string` | `'Aucune donnée'` | Titre |
| `message` | `string` | `'Aucun élément...'` | Description |
| `action` | `{ label: string, onClick: () => void }` | - | Call-to-action optionnel |
| `className` | `string` | - | Classes CSS additionnelles |

### Caractéristiques

- Icône Inbox par défaut (personnalisable)
- Style léger (gray/muted)
- Bouton CTA optionnel (outline variant)
- Attributs ARIA (role="status", aria-live="polite")

### Exemples d'utilisation

```tsx
// Empty state simple
<EmptyState />

// Avec message personnalisé
<EmptyState
  title="Aucun match disponible"
  message="Il n'y a aucun match prévu pour le moment. Revenez plus tard."
/>

// Avec action
<EmptyState
  title="Aucune prédiction"
  message="Vous n'avez pas encore fait de prédictions."
  action={{
    label: "Créer une prédiction",
    onClick: () => navigate('/predictions/new')
  }}
/>

// Avec icône personnalisée
import { Trophy } from "lucide-react"
<EmptyState
  icon={<Trophy className="h-12 w-12" />}
  title="Aucun trophée"
  message="Participez aux compétitions pour gagner des trophées"
/>
```

---

## 5. Success Animation

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille de l'animation |
| `duration` | `number` | `2000` | Durée (ms) avant fade out |
| `show` | `boolean` | `true` | Contrôle l'affichage |
| `onAnimationComplete` | `() => void` | - | Callback après animation |
| `className` | `string` | - | Classes CSS additionnelles |

### Tailles

- **sm**: 48px (h-12 w-12)
- **md**: 64px (h-16 w-16)
- **lg**: 96px (h-24 w-24)

### Caractéristiques

- Checkmark animé (icône Check de lucide-react)
- Couleur success (#10B981)
- Animation de pulsation du cercle
- Fade in au début, fade out à la fin
- Auto-unmount après l'animation

### Exemples d'utilisation

```tsx
// Animation simple
const [showSuccess, setShowSuccess] = useState(false)
<SuccessAnimation show={showSuccess} />

// Animation grande avec callback
<SuccessAnimation
  size="lg"
  duration={3000}
  show={showSuccess}
  onAnimationComplete={() => {
    setShowSuccess(false)
    navigate('/dashboard')
  }}
/>

// Dans un formulaire
const handleSubmit = async () => {
  try {
    await savePrediction()
    setShowSuccess(true)
    toast.success("Prédiction enregistrée !")
  } catch (error) {
    toast.error("Erreur")
  }
}
```

---

## 6. Skeleton Card

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `variant` | `'match' \| 'stat' \| 'team' \| 'default'` | `'default'` | Type de card |
| `showImage` | `boolean` | `true` | Afficher skeleton d'image (default) |
| `showActions` | `boolean` | `false` | Afficher boutons d'action |
| `className` | `string` | - | Classes CSS additionnelles |

### Variantes

#### match
- Header avec date/heure
- 2 équipes avec logos et scores
- VS au centre
- Actions optionnelles (boutons)

#### stat
- Header avec label et icône
- Grande valeur numérique
- Barre de progression

#### team
- Logo d'équipe (grand)
- Nom et infos
- 3 statistiques en colonnes

#### default
- Image optionnelle
- 3 lignes de texte
- Actions optionnelles

### Exemples d'utilisation

```tsx
// Match card skeleton
<SkeletonCard variant="match" showActions />

// Grid de match cards
<div className="grid gap-4 md:grid-cols-3">
  {Array(6).fill(0).map((_, i) => (
    <SkeletonCard key={i} variant="match" showActions />
  ))}
</div>

// Stat cards
<div className="grid gap-4 md:grid-cols-4">
  {Array(4).fill(0).map((_, i) => (
    <SkeletonCard key={i} variant="stat" />
  ))}
</div>

// Pendant le chargement
if (isLoading) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SkeletonCard variant="match" showActions />
      <SkeletonCard variant="match" showActions />
      <SkeletonCard variant="match" showActions />
    </div>
  )
}
```

---

## 7. Skeleton List

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `count` | `number` | `3` | Nombre d'items |
| `variant` | `'default' \| 'with-avatar' \| 'with-icon' \| 'detailed'` | `'default'` | Type de liste |
| `showDivider` | `boolean` | `true` | Afficher les séparateurs |
| `className` | `string` | - | Classes CSS additionnelles |

### Variantes

#### default
- 2 lignes de texte simples

#### with-avatar
- Avatar circulaire (48px)
- Nom et description
- Bouton à droite

#### with-icon
- Icône carrée (40px)
- Label et sous-label

#### detailed
- Thumbnail à droite (64px)
- Titre et 2 lignes de description
- 3 tags en bas

### Exemples d'utilisation

```tsx
// Liste simple
<SkeletonList count={5} />

// Liste avec avatars
<SkeletonList variant="with-avatar" count={8} />

// Liste détaillée sans séparateurs
<SkeletonList
  variant="detailed"
  count={3}
  showDivider={false}
/>

// Pendant le chargement
if (isLoading) {
  return (
    <div className="space-y-4">
      <h2>Derniers matchs</h2>
      <SkeletonList variant="detailed" count={5} />
    </div>
  )
}
```

---

## 8. Alert

### Props (shadcn/ui)

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `variant` | `'default' \| 'destructive'` | `'default'` | Style de l'alerte |
| `className` | `string` | - | Classes CSS additionnelles |

### Sous-composants

- **AlertTitle**: Titre de l'alerte
- **AlertDescription**: Description de l'alerte

### Exemples d'utilisation

```tsx
import { Info, AlertCircle } from "lucide-react"

// Alerte info
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    Le match commence dans 30 minutes.
  </AlertDescription>
</Alert>

// Alerte destructive
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Erreur</AlertTitle>
  <AlertDescription>
    Impossible de sauvegarder vos modifications.
  </AlertDescription>
</Alert>
```

---

## 9. Alert Dialog

### Sous-composants (shadcn/ui)

- **AlertDialog**: Container principal
- **AlertDialogTrigger**: Bouton déclencheur
- **AlertDialogContent**: Contenu du dialogue
- **AlertDialogHeader**: En-tête
- **AlertDialogTitle**: Titre
- **AlertDialogDescription**: Description
- **AlertDialogFooter**: Pied de page
- **AlertDialogAction**: Bouton d'action principale
- **AlertDialogCancel**: Bouton d'annulation

### Exemples d'utilisation

```tsx
// Confirmation de suppression
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Supprimer</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
      <AlertDialogDescription>
        Cette action ne peut pas être annulée. Cela supprimera
        définitivement votre prédiction.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Continuer
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// Avec état et toast
const [open, setOpen] = useState(false)

<AlertDialog open={open} onOpenChange={setOpen}>
  {/* ... */}
  <AlertDialogAction
    onClick={() => {
      handleDelete()
      setOpen(false)
      toast.success("Supprimé avec succès")
    }}
  >
    Supprimer
  </AlertDialogAction>
</AlertDialog>
```

---

## 10. Toast (Sonner)

### Fonctions disponibles

```tsx
import { toast } from "sonner"

// Types de toast
toast(message: string, options?: ToastOptions)
toast.success(message: string, options?: ToastOptions)
toast.error(message: string, options?: ToastOptions)
toast.warning(message: string, options?: ToastOptions)
toast.info(message: string, options?: ToastOptions)
toast.promise(promise: Promise, messages: PromiseMessages)
toast.loading(message: string, options?: ToastOptions)
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `description` | `string` | Texte de description |
| `action` | `{ label: string, onClick: () => void }` | Bouton d'action |
| `duration` | `number` | Durée d'affichage (ms) |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | Position |
| `dismissible` | `boolean` | Peut être fermé |
| `closeButton` | `boolean` | Bouton de fermeture |

### Exemples d'utilisation

```tsx
// Toast simple
toast("Match créé")

// Toast success
toast.success("Prédiction enregistrée avec succès !")

// Toast error
toast.error("Impossible d'enregistrer la prédiction")

// Toast avec description
toast("Match en cours", {
  description: "Liverpool vs Manchester City",
})

// Toast avec action
toast("Match terminé", {
  description: "Consultez les résultats",
  action: {
    label: "Voir",
    onClick: () => navigate("/match/123"),
  },
})

// Promise toast
toast.promise(
  fetchData(),
  {
    loading: "Chargement...",
    success: (data) => `${data.length} matchs chargés`,
    error: "Erreur de chargement",
  }
)

// Toast personnalisé
toast.success("Opération réussie", {
  duration: 5000,
  position: "top-right",
  dismissible: true,
})

// Dans une mutation
const mutation = useMutation({
  mutationFn: savePrediction,
  onSuccess: () => {
    toast.success("Prédiction enregistrée !")
  },
  onError: (error) => {
    toast.error("Erreur", {
      description: error.message,
    })
  },
})
```

---

## Patterns d'utilisation courants

### 1. Chargement de données

```tsx
function DataList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  })

  if (isLoading) {
    return <SkeletonList variant="detailed" count={5} />
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="Aucune donnée"
        action={{ label: "Actualiser", onClick: refetch }}
      />
    )
  }

  return <div>{/* Render data */}</div>
}
```

### 2. Soumission de formulaire

```tsx
function Form() {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (data) => {
    try {
      await saveData(data)
      setShowSuccess(true)
      toast.success("Données enregistrées !")
      setTimeout(() => {
        setShowSuccess(false)
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      toast.error("Erreur", {
        description: error.message,
      })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
      {showSuccess && (
        <SuccessAnimation size="lg" show={showSuccess} />
      )}
    </>
  )
}
```

### 3. Opération longue

```tsx
function LongOperation() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      await longRunningTask()
      toast.success("Terminé !")
    } catch (error) {
      toast.error("Erreur", { description: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Button onClick={handleProcess} disabled={isProcessing}>
        {isProcessing && <Spinner size="sm" className="mr-2" />}
        Lancer le processus
      </Button>

      {isProcessing && (
        <LoadingState
          mode="fullscreen"
          showOverlay
          message="Traitement en cours..."
        />
      )}
    </>
  )
}
```

---

## Accessibilité

Tous les composants incluent :

- **Attributs ARIA appropriés** (role, aria-label, aria-live)
- **Support des lecteurs d'écran** (sr-only labels)
- **Gestion du focus** (pour dialogs)
- **Animations respectueuses** (prefers-reduced-motion)
- **Contraste suffisant** (WCAG AA)
- **Navigation clavier** (Tab, Enter, Escape)

---

## Performance

- **Animations CSS uniquement** (pas de JavaScript)
- **Lazy loading** des composants
- **Memoization** avec React.forwardRef
- **Tree-shaking** compatible
- **Bundle size optimisé**
