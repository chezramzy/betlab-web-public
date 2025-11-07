"use client"

import * as React from "react"
import { useFormValidation } from "@/lib/hooks/use-form-validation"
import { RegisterSchema, type RegisterFormData } from "@/lib/validations/auth-schema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/lib/components/ui/form"
import { Input } from "@/lib/components/ui/input"
import { PasswordInput } from "@/lib/components/ui/password-input"
import { Button } from "@/lib/components/ui/button"
import { Checkbox } from "@/lib/components/ui/checkbox"
import { FormError } from "@/lib/components/ui/form-error"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"

/**
 * EXEMPLE DE FORMULAIRE D'INSCRIPTION COMPLET
 *
 * Démontre:
 * - Validation complexe (password matching, regex, conditions)
 * - FormDescription pour aide contextuelle
 * - Multiple error messages
 * - Checkbox avec validation obligatoire
 * - Mobile-friendly avec tous les optimisations
 *
 * Utilisation:
 * <RegisterFormExample onSubmit={handleRegister} />
 */

export interface RegisterFormExampleProps {
  onSubmit?: (data: RegisterFormData) => Promise<void> | void
  isLoading?: boolean
}

export function RegisterFormExample({
  onSubmit,
  isLoading: externalLoading,
}: RegisterFormExampleProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [formError, setFormError] = React.useState<string>("")

  // Initialiser le formulaire avec validation Zod
  const form = useFormValidation({
    schema: RegisterSchema,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  // Handler de soumission
  const handleSubmit = async (data: RegisterFormData) => {
    setFormError("")
    setIsLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Simulation d'un appel API
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Register data:", data)
      }
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message)
      } else {
        setFormError("Une erreur s'est produite lors de l'inscription")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loading = externalLoading || isLoading

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Remplissez le formulaire pour créer votre compte BetLab
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Erreurs globales */}
        {formError && (
          <FormError message={formError} className="mb-4" />
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Email */}
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
                  <FormDescription>
                    Utilisez une adresse email valide pour la confirmation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Créez un mot de passe sécurisé"
                      autoComplete="new-password"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum 8 caractères avec une minuscule, majuscule et chiffre
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirmez votre mot de passe"
                      autoComplete="new-password"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Accept Terms - Checkbox obligatoire */}
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      J'accepte les{" "}
                      <a
                        href="/terms"
                        className="text-primary hover:underline"
                        target="_blank"
                      >
                        conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a
                        href="/privacy"
                        className="text-primary hover:underline"
                        target="_blank"
                      >
                        politique de confidentialité
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </Button>

            {/* Lien vers la connexion */}
            <p className="text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <a href="/login" className="text-primary hover:underline">
                Se connecter
              </a>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
