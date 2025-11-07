'use client';

import * as React from "react"
import { toast } from "sonner"
import { RefreshCw, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

// Components UI
import { Button } from "@/lib/components/ui/button"
import { Spinner } from "@/lib/components/ui/spinner"
import { LoadingState } from "@/lib/components/ui/loading-state"
import { ErrorState } from "@/lib/components/ui/error-state"
import { EmptyState } from "@/lib/components/ui/empty-state"
import { SuccessAnimation } from "@/lib/components/ui/success-animation"
import { SkeletonCard } from "@/lib/components/ui/skeleton-card"
import { SkeletonList } from "@/lib/components/ui/skeleton-list"
import { Alert, AlertDescription, AlertTitle } from "@/lib/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/lib/components/ui/alert-dialog"

export function FeedbackStatesExample() {
  const [showLoading, setShowLoading] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [showSkeleton, setShowSkeleton] = React.useState(false)

  const handleLoadingDemo = () => {
    setShowLoading(true)
    setTimeout(() => setShowLoading(false), 3000)
  }

  const handleSuccessDemo = () => {
    setShowSuccess(true)
  }

  const handleSkeletonDemo = () => {
    setShowSkeleton(true)
    setTimeout(() => setShowSkeleton(false), 3000)
  }

  return (
    <div className="container max-w-6xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Exemples de Composants Feedback
        </h1>
        <p className="text-muted-foreground">
          Démonstration de tous les états de feedback utilisateur disponibles dans BetLab
        </p>
      </div>

      {/* Spinners */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Spinners</h2>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-wrap items-center gap-8">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Small - Primary</p>
              <Spinner size="sm" variant="primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Medium - Accent</p>
              <Spinner size="md" variant="accent" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Large - Primary</p>
              <Spinner size="lg" variant="primary" />
            </div>
            <div className="space-y-2 bg-primary p-4 rounded">
              <p className="text-sm text-primary-foreground">White variant</p>
              <Spinner size="md" variant="white" />
            </div>
          </div>
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <h3 className="font-medium">Inline Loading</h3>
            </div>
            <div className="h-64 relative">
              <LoadingState
                mode="inline"
                message="Chargement des données..."
                spinnerSize="lg"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <h3 className="font-medium">Démo Fullscreen</h3>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Cliquez pour afficher un loading fullscreen pendant 3 secondes
              </p>
              <Button onClick={handleLoadingDemo}>
                Afficher Loading Fullscreen
              </Button>
            </div>
          </div>
        </div>

        {showLoading && (
          <LoadingState
            mode="fullscreen"
            showOverlay
            message="Chargement en cours..."
            spinnerSize="lg"
          />
        )}
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Error State</h2>
        <div className="rounded-lg border bg-card">
          <ErrorState
            title="Impossible de charger les matchs"
            message="Une erreur s'est produite lors du chargement des données. Veuillez vérifier votre connexion et réessayer."
            onRetry={() => toast.error("Nouvelle tentative...")}
            retryLabel="Réessayer"
          />
        </div>
      </section>

      {/* Empty State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Empty State</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card">
            <EmptyState
              title="Aucun match disponible"
              message="Il n'y a aucun match prévu pour le moment. Revenez plus tard."
            />
          </div>

          <div className="rounded-lg border bg-card">
            <EmptyState
              title="Aucune prédiction"
              message="Vous n'avez pas encore fait de prédictions. Commencez dès maintenant !"
              action={{
                label: "Créer une prédiction",
                onClick: () => toast.info("Création d'une prédiction..."),
              }}
            />
          </div>
        </div>
      </section>

      {/* Success Animation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Success Animation</h2>
        <div className="rounded-lg border bg-card p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4">
              <Button onClick={handleSuccessDemo} variant="default">
                Afficher Success Animation
              </Button>
            </div>

            {showSuccess && (
              <SuccessAnimation
                size="lg"
                duration={3000}
                onAnimationComplete={() => {
                  setShowSuccess(false)
                  toast.success("Animation terminée !")
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Skeleton Loaders */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Skeleton Loaders</h2>

        <div className="space-y-2">
          <Button onClick={handleSkeletonDemo} variant="outline">
            {showSkeleton ? "Chargement..." : "Afficher Skeletons (3s)"}
          </Button>
        </div>

        {showSkeleton ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <SkeletonCard variant="match" showActions />
              <SkeletonCard variant="stat" />
              <SkeletonCard variant="team" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-medium mb-4">Liste avec avatar</h3>
                <SkeletonList variant="with-avatar" count={3} />
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-medium mb-4">Liste détaillée</h3>
                <SkeletonList variant="detailed" count={2} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <SkeletonCard variant="match" showActions />
              <SkeletonCard variant="stat" />
              <SkeletonCard variant="team" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-medium mb-4">Liste avec avatar</h3>
                <SkeletonList variant="with-avatar" count={3} />
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-medium mb-4">Liste détaillée</h3>
                <SkeletonList variant="detailed" count={2} />
              </div>
            </div>
          </>
        )}
      </section>

      {/* Alerts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Alerts</h2>
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Le match commence dans 30 minutes. Assurez-vous de faire vos prédictions.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de sauvegarder votre prédiction. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Alert Dialog */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Alert Dialog</h2>
        <div className="rounded-lg border bg-card p-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Supprimer la prédiction</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera définitivement
                  votre prédiction de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => toast.success("Prédiction supprimée")}
                >
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      {/* Toast Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Toasts (Sonner)</h2>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => toast.success("Prédiction enregistrée avec succès !")}
              variant="default"
            >
              <CheckCircle className="h-4 w-4" />
              Toast Success
            </Button>

            <Button
              onClick={() => toast.error("Erreur lors de l'enregistrement")}
              variant="destructive"
            >
              <AlertCircle className="h-4 w-4" />
              Toast Error
            </Button>

            <Button
              onClick={() => toast.warning("Attention : Le match commence bientôt")}
              variant="outline"
            >
              <AlertTriangle className="h-4 w-4" />
              Toast Warning
            </Button>

            <Button
              onClick={() => toast.info("Nouvelle mise à jour disponible")}
              variant="secondary"
            >
              <Info className="h-4 w-4" />
              Toast Info
            </Button>

            <Button
              onClick={() =>
                toast("Match en cours", {
                  description: "Liverpool vs Manchester City",
                  action: {
                    label: "Voir",
                    onClick: () => console.log("Voir le match"),
                  },
                })
              }
              variant="outline"
            >
              Toast avec Action
            </Button>

            <Button
              onClick={() =>
                toast.promise(
                  new Promise((resolve) => setTimeout(resolve, 2000)),
                  {
                    loading: "Chargement...",
                    success: "Données chargées !",
                    error: "Erreur de chargement",
                  }
                )
              }
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
              Toast Promise
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
