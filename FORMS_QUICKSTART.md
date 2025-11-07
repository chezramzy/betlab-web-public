# Quick Start - Composants Forms BetLab

## Installation complète

Tous les composants de formulaires shadcn/ui + React Hook Form + Zod sont installés et configurés.

---

## Utilisation rapide

### 1. Exemple minimal (copier-coller ready)

```tsx
"use client"

import { useFormValidation } from "@/lib/hooks"
import { LoginSchema } from "@/lib/validations"
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

export function MyLoginForm() {
  const form = useFormValidation({
    schema: LoginSchema,
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data) => {
    console.log(data)
    // Appel API ici
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

        <Button type="submit" className="w-full">Se connecter</Button>
      </form>
    </Form>
  )
}
```

---

## 2. Composants disponibles

### Forms basiques
```tsx
import {
  Input,           // Input texte optimisé mobile (48px)
  PasswordInput,   // Input password avec toggle visibility
  Textarea,        // Zone de texte multi-lignes
  Select,          // Liste déroulante
  Checkbox,        // Case à cocher
  RadioGroup,      // Boutons radio
  Switch,          // Toggle on/off
} from "@/lib/components/ui"
```

### Forms React Hook Form
```tsx
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/lib/components/ui"
```

### Composants custom
```tsx
import {
  FormError,        // Affichage erreurs avec icon
  FormFieldWrapper, // Wrapper label + error
} from "@/lib/components/ui"
```

---

## 3. Schémas de validation disponibles

```tsx
import {
  LoginSchema,           // Email + Password
  RegisterSchema,        // Email + Password + Confirm + Terms
  ForgotPasswordSchema,  // Email only
  ResetPasswordSchema,   // Password + Confirm
  type LoginFormData,
  type RegisterFormData,
} from "@/lib/validations"
```

---

## 4. Exemples complets

### Login
```tsx
import { LoginFormExample } from "@/lib/components/examples"

<LoginFormExample
  onSubmit={async (data) => await loginUser(data)}
/>
```

### Register
```tsx
import { RegisterFormExample } from "@/lib/components/examples"

<RegisterFormExample
  onSubmit={async (data) => await registerUser(data)}
/>
```

### Test rapide
```tsx
import { QuickFormTest } from "@/lib/components/examples/quick-form-test"

<QuickFormTest />
```

---

## 5. Créer un nouveau schéma Zod

```tsx
// lib/validations/my-schema.ts
import { z } from "zod"

export const ContactSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Message trop court"),
})

export type ContactFormData = z.infer<typeof ContactSchema>
```

Puis utiliser:
```tsx
const form = useFormValidation({
  schema: ContactSchema,
  defaultValues: { name: "", email: "", message: "" }
})
```

---

## 6. Gestion des erreurs

### Erreur globale du formulaire
```tsx
import { FormError } from "@/lib/components/ui"

const [error, setError] = useState("")

<FormError message={error} />
```

### Erreur par champ
```tsx
// Automatique avec FormMessage
<FormMessage />

// Ou manuel
<FormFieldWrapper error={form.formState.errors.email?.message}>
  <Input />
</FormFieldWrapper>
```

---

## 7. Optimisations Mobile

Tous les composants sont déjà optimisés:
- Height: 48px (touch-friendly)
- Font-size: 16px (pas de zoom iOS)
- Spacing: 16px vertical
- Touch targets: >= 44px
- Autocomplete: Configuré
- Dark mode: Supporté

---

## 8. Fichiers importants

```
lib/
├── components/
│   ├── ui/
│   │   ├── input.tsx
│   │   ├── password-input.tsx ⭐
│   │   ├── form-error.tsx ⭐
│   │   └── index.ts (exports)
│   │
│   └── examples/
│       ├── login-form-example.tsx ⭐
│       ├── register-form-example.tsx ⭐
│       ├── quick-form-test.tsx ⭐
│       └── FORMS_README.md (doc complète)
│
├── validations/
│   ├── auth-schema.ts ⭐
│   └── index.ts
│
└── hooks/
    ├── use-form-validation.ts ⭐
    └── index.ts
```

---

## 9. Dépendances (déjà installées)

```json
{
  "react-hook-form": "^7.66.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.1.12"
}
```

---

## 10. Documentation complète

Voir: `lib/components/examples/FORMS_README.md`

Pour le rapport complet: `BATCH1_FORMS_REPORT.md`

---

## Support

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [shadcn/ui Docs](https://ui.shadcn.com/)

---

**Prêt à l'emploi!** Tous les composants sont testés et commentés.
