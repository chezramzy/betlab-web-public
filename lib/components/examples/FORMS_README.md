# Documentation des Composants de Formulaires

## Composants shadcn/ui installés

### Composants de base
- `input` - Champ de saisie texte (optimisé mobile: 48px height, 16px font)
- `textarea` - Zone de texte multi-lignes (optimisé mobile)
- `select` - Liste déroulante
- `label` - Label pour les champs
- `checkbox` - Case à cocher
- `radio-group` - Groupe de boutons radio
- `switch` - Interrupteur on/off
- `form` - Wrapper de formulaire avec React Hook Form

### Composants custom créés

#### PasswordInput (`lib/components/ui/password-input.tsx`)
Input de mot de passe avec bouton pour afficher/masquer le texte.

```tsx
import { PasswordInput } from "@/lib/components/ui/password-input"

<PasswordInput
  placeholder="Entrez votre mot de passe"
  autoComplete="current-password"
/>
```

#### FormError (`lib/components/ui/form-error.tsx`)
Composant pour afficher les erreurs de validation avec icône et style cohérent.

```tsx
import { FormError } from "@/lib/components/ui/form-error"

// Message unique
<FormError message="Email invalide" />

// Liste d'erreurs
<FormError errors={["Email requis", "Format invalide"]} />
```

#### FormFieldWrapper (`lib/components/ui/form-field.tsx`)
Wrapper générique pour les champs avec label, description et erreur.

```tsx
import { FormFieldWrapper } from "@/lib/components/ui/form-field"

<FormFieldWrapper
  label="Email"
  htmlFor="email"
  required
  error={errors.email}
  description="Utilisez une adresse email valide"
>
  <Input id="email" type="email" />
</FormFieldWrapper>
```

## Schémas de validation Zod

Fichier: `lib/validations/auth-schema.ts`

### LoginSchema
```tsx
import { LoginSchema, type LoginFormData } from "@/lib/validations/auth-schema"

// Champs validés:
// - email: format email valide
// - password: minimum 8 caractères
// - rememberMe: booléen optionnel
```

### RegisterSchema
```tsx
import { RegisterSchema, type RegisterFormData } from "@/lib/validations/auth-schema"

// Champs validés:
// - email: format email valide
// - password: 8+ caractères, minuscule + majuscule + chiffre
// - confirmPassword: doit correspondre au password
// - acceptTerms: doit être true
```

### Autres schémas disponibles
- `ForgotPasswordSchema` - Réinitialisation de mot de passe
- `ResetPasswordSchema` - Nouveau mot de passe + confirmation

## Hook de validation

Fichier: `lib/hooks/use-form-validation.ts`

```tsx
import { useFormValidation } from "@/lib/hooks/use-form-validation"
import { LoginSchema } from "@/lib/validations/auth-schema"

const form = useFormValidation({
  schema: LoginSchema,
  defaultValues: {
    email: "",
    password: "",
  }
})

// Utilisation dans le formulaire
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Champs */}
  </form>
</Form>
```

### Fonctions utilitaires
```tsx
import {
  getFormErrors,
  hasFieldError,
  getFieldError
} from "@/lib/hooks/use-form-validation"

// Transformer les erreurs Zod
const errors = getFormErrors(error)

// Vérifier si un champ a une erreur
if (hasFieldError(form.formState.errors, "email")) {
  // ...
}

// Récupérer le message d'erreur
const message = getFieldError(form.formState.errors, "email")
```

## Exemples complets

### LoginFormExample
Fichier: `lib/components/examples/login-form-example.tsx`

Formulaire de connexion complet avec:
- Validation Zod
- Error handling
- Loading state
- Remember me checkbox
- Lien mot de passe oublié

```tsx
import { LoginFormExample } from "@/lib/components/examples/login-form-example"

<LoginFormExample
  onSubmit={async (data) => {
    // Traiter la connexion
    await loginUser(data)
  }}
  isLoading={isLoading}
/>
```

### RegisterFormExample
Fichier: `lib/components/examples/register-form-example.tsx`

Formulaire d'inscription avec:
- Validation complexe (password matching, regex)
- FormDescription pour aide contextuelle
- Checkbox obligatoire (conditions d'utilisation)
- Multiple error messages

```tsx
import { RegisterFormExample } from "@/lib/components/examples/register-form-example"

<RegisterFormExample
  onSubmit={async (data) => {
    await registerUser(data)
  }}
/>
```

## Optimisations mobile-friendly

### Tailles
- **Input height**: 48px (12 = 3rem) pour zone tactile confortable
- **Font size**: 16px minimum (évite le zoom automatique iOS)
- **Spacing vertical**: 16px (mb-4) entre les champs
- **Button height**: 44px minimum (size="lg")

### Attributs autocomplete
```tsx
// Email
<Input type="email" autoComplete="email" />

// Password (connexion)
<PasswordInput autoComplete="current-password" />

// Password (inscription)
<PasswordInput autoComplete="new-password" />
```

### Focus states
- Outline Navy visible pour navigation clavier
- Ring de 3px pour meilleure visibilité
- Couleur destructive (#EF4444) pour les erreurs

### Dark mode
- Tous les composants utilisent CSS variables
- Support automatique du dark mode
- Contraste optimisé pour accessibilité

## Import simplifié

Utilisez le fichier d'export central:

```tsx
import {
  Button,
  Input,
  PasswordInput,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormError,
} from "@/lib/components/ui"
```

## Exemple d'utilisation rapide

```tsx
"use client"

import { useFormValidation } from "@/lib/hooks/use-form-validation"
import { LoginSchema } from "@/lib/validations/auth-schema"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  PasswordInput,
  Button,
} from "@/lib/components/ui"

export function QuickLoginForm() {
  const form = useFormValidation({
    schema: LoginSchema,
    defaultValues: { email: "", password: "" }
  })

  const onSubmit = async (data) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>
    </Form>
  )
}
```

## Dépendances

Toutes les dépendances sont déjà installées:
- `react-hook-form`: ^7.66.0
- `@hookform/resolvers`: ^5.2.2
- `zod`: ^4.1.12
- `lucide-react`: Pour les icônes (Eye, EyeOff, AlertCircle)

## Support navigateurs

- Chrome/Edge: Complet
- Safari iOS: Optimisé (pas de zoom sur les inputs)
- Firefox: Complet
- Mobile: Touch-friendly avec targets >= 44px
