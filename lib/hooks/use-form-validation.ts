"use client"

import { useForm, UseFormProps, UseFormReturn, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

/**
 * Hook helper pour la validation de formulaire avec Zod
 * Simplifie l'utilisation de react-hook-form avec zodResolver
 *
 * @example
 * const form = useFormValidation({
 *   schema: LoginSchema,
 *   defaultValues: { email: "", password: "" }
 * })
 */
export function useFormValidation<
  TSchema extends z.ZodType<any, any, any>,
  TFieldValues extends FieldValues = z.infer<TSchema>
>(
  props: {
    schema: TSchema
  } & Omit<UseFormProps<TFieldValues>, "resolver">
): UseFormReturn<TFieldValues> {
  const { schema, ...formProps } = props

  return useForm<TFieldValues>({
    resolver: zodResolver(schema) as any,
    mode: "onBlur", // Valide au blur pour meilleure UX mobile
    ...formProps,
  })
}

/**
 * Transforme les erreurs Zod en format lisible
 * Utile pour afficher les erreurs globales du formulaire
 */
export function getFormErrors(error: unknown): string[] {
  if (error instanceof z.ZodError) {
    return error.issues.map((err) => err.message)
  }

  if (error instanceof Error) {
    return [error.message]
  }

  return ["Une erreur inattendue s'est produite"]
}

/**
 * Vérifie si un champ a une erreur
 */
export function hasFieldError(
  errors: Record<string, any>,
  fieldName: string
): boolean {
  return !!errors[fieldName]
}

/**
 * Récupère le message d'erreur d'un champ
 */
export function getFieldError(
  errors: Record<string, any>,
  fieldName: string
): string | undefined {
  return errors[fieldName]?.message
}
