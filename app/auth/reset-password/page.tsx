"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { authService } from "@/lib/core/services/auth-service"
import { Button } from "@/lib/components/ui/button"
import { PasswordInput } from "@/lib/components/ui/password-input"
import { PasswordStrength } from "@/lib/components/ui/password-strength"
import { useToast } from "@/lib/hooks/use-toast"

// Validation schema with password requirements
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tokenError, setTokenError] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check for token in URL
  useEffect(() => {
    // In Supabase, the token is sent as a hash fragment, not a query param
    // We need to check the session state instead
    const checkSession = async () => {
      const session = await authService.getSession()
      if (!session) {
        setTokenError(true)
        toast({
          variant: "destructive",
          title: "Lien invalide",
          description: "Le lien de réinitialisation est invalide ou a expiré",
        })
        // Redirect to forgot-password after 3 seconds
        setTimeout(() => {
          router.push("/auth/forgot-password")
        }, 3000)
      }
    }

    checkSession()
  }, [router, toast])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch("password")

  async function onSubmit(data: ResetPasswordFormData) {
    setIsLoading(true)
    try {
      const { error } = await authService.updatePassword(data.password)

      if (error) {
        if (error.message.includes("session") || error.message.includes("token")) {
          setTokenError(true)
          toast({
            variant: "destructive",
            title: "Session expirée",
            description: "Votre session a expiré. Veuillez recommencer.",
          })
          setTimeout(() => {
            router.push("/auth/forgot-password")
          }, 2000)
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Une erreur est survenue",
          })
        }
        return
      }

      setIsSuccess(true)
      toast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour avec succès",
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du mot de passe",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Token error state
  if (tokenError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Lien invalide ou expiré
            </h1>
            <p className="text-base text-muted-foreground">
              Le lien de réinitialisation n'est plus valide.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirection en cours...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Mot de passe mis à jour !
            </h1>
            <p className="text-base text-muted-foreground">
              Votre mot de passe a été modifié avec succès.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirection vers la connexion...
            </p>
          </div>

          {/* Loading indicator */}
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }

  // Form state
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Nouveau mot de passe
          </h1>
          <p className="text-base text-muted-foreground">
            Choisissez un mot de passe sécurisé pour votre compte
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Nouveau mot de passe
            </label>
            <PasswordInput
              id="password"
              placeholder="Entrez votre nouveau mot de passe"
              autoComplete="new-password"
              className="h-12 text-base"
              aria-invalid={errors.password ? "true" : "false"}
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <PasswordStrength password={password} />
          )}

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              Confirmer le mot de passe
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              autoComplete="new-password"
              className="h-12 text-base"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="lime"
            className="h-12 w-full text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Réinitialisation en cours...
              </>
            ) : (
              "Réinitialiser le mot de passe"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
