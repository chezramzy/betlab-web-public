"use client"

import * as React from "react"
import { useFormValidation } from "@/lib/hooks/use-form-validation"
import { LoginSchema, type LoginFormData } from "@/lib/validations/auth-schema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/form"
import { Input } from "@/lib/components/ui/input"
import { PasswordInput } from "@/lib/components/ui/password-input"
import { Button } from "@/lib/components/ui/button"
import { Checkbox } from "@/lib/components/ui/checkbox"
import { FormError } from "@/lib/components/ui/form-error"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"

/**
 * EXEMPLE DE FORMULAIRE DE CONNEXION COMPLET
 *
 * Démontre:
 * - Validation avec Zod + React Hook Form
 * - Composants shadcn/ui
 * - Error handling
 * - Loading state
 * - Mobile-friendly (48px inputs, 16px font, 16px spacing)
 * - Autocomplete approprié
 * - Dark mode support
 *
 * Utilisation:
 * <LoginFormExample onSubmit={handleLogin} />
 */

export interface LoginFormExampleProps {
  onSubmit?: (data: LoginFormData) => Promise<void> | void
  isLoading?: boolean
}

export function LoginFormExample({
  onSubmit,
  isLoading: externalLoading,
}: LoginFormExampleProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [formError, setFormError] = React.useState<string>("")

  // Initialiser le formulaire avec validation Zod
  const form = useFormValidation({
    schema: LoginSchema,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Handler de soumission
  const handleSubmit = async (data: LoginFormData) => {
    setFormError("")
    setIsLoading(true)

    try {
      // Appeler la fonction de soumission fournie
      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Simulation d'un appel API pour l'exemple
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Login data:", data)
        // En cas de succès, rediriger ou afficher un message
      }
    } catch (error) {
      // Gestion des erreurs
      if (error instanceof Error) {
        setFormError(error.message)
      } else {
        setFormError("Une erreur s'est produite lors de la connexion")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loading = externalLoading || isLoading

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour vous connecter à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Afficher les erreurs globales du formulaire */}
        {formError && (
          <FormError message={formError} className="mb-4" />
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Champ Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nom@example.com"
                      autoComplete="email"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ Password avec toggle visibility */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Entrez votre mot de passe"
                      autoComplete="current-password"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Checkbox Remember Me */}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">
                      Se souvenir de moi
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Lien mot de passe oublié */}
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton de soumission avec loading state */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg" // 44px height pour touch-friendly
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>

            {/* Lien vers l'inscription */}
            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <a href="/register" className="text-primary hover:underline">
                S'inscrire
              </a>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
