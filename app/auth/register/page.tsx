"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { useAuthStore } from "@/lib/stores/auth-store"
import {
  RegisterSchema,
  type RegisterFormData,
} from "@/lib/validations/auth-schema"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { PasswordInput } from "@/lib/components/ui/password-input"
import { Checkbox } from "@/lib/components/ui/checkbox"
import { Label } from "@/lib/components/ui/label"
import { useToast } from "@/lib/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, isLoading } = useAuthStore()
  const { toast } = useToast()
  const [acceptTerms, setAcceptTerms] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data.email, data.password)
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue sur BetLab ! Complétez votre profil.",
      })
      // Redirect to onboarding after successful registration
      router.push("/onboarding")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue. Veuillez réessayer.",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background dark:bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            BetLab
          </h1>
          <p className="text-muted-foreground">
            Créez votre compte
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Minimum 8 caractères avec une majuscule, une minuscule et un chiffre
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={(checked) => {
                  setAcceptTerms(checked as boolean)
                }}
                aria-invalid={!!errors.acceptTerms}
                className="mt-1"
              />
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                J'accepte les{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  politique de confidentialité
                </Link>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive ml-6" role="alert">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="lime"
            className="w-full h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création du compte...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Déjà un compte ? </span>
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:underline"
          >
            Se connecter
          </Link>
        </div>

        {/* Safe Area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
