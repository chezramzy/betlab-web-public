"use client"

/**
 * QUICK TEST - Formulaire simple pour tester les composants
 * Usage: Copier ce code dans une page Next.js pour tester
 */

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
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/lib/components/ui"

export function QuickFormTest() {
  const form = useFormValidation({
    schema: LoginSchema,
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data)
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Formulaire</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="test@example.com" {...field} />
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
                      <PasswordInput placeholder="Minimum 8 caractères" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">
                Tester la validation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
