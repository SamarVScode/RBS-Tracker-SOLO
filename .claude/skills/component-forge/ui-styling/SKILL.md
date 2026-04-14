---
name: component-forge/ui-styling
description: Tailwind CSS + shadcn/ui patterns for React/Next.js. Load only when README STYLING = Tailwind or CSS modules. Never load for inline styles or StyleSheet.create projects.
---

# UI Styling — Tailwind + shadcn/ui

Load this skill when `context-brief.md` STYLING field is `Tailwind` or `CSS modules`.
Skip entirely for inline styles (web) or StyleSheet.create (RN).

## Setup (if not already installed)
```bash
# shadcn/ui init (sets up Tailwind + Radix primitives)
npx shadcn@latest init

# Add components as needed
npx shadcn@latest add button card dialog form input select
```

## Core Pattern
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function FeatureCard({ title, description }: Props) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        <Button className="mt-4 w-full">Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

## Token System (3-layer — never use raw hex)
```css
/* Primitive */
--color-blue-600: #2563EB;

/* Semantic (use these in components) */
--color-primary: var(--color-blue-600);
--color-background: #ffffff;
--color-surface: #f9fafb;
--color-error: #dc2626;

/* Component (scoped overrides only) */
--button-bg: var(--color-primary);
--card-bg: var(--color-surface);
```

In Tailwind config:
```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      background: "hsl(var(--background))",
      surface: "hsl(var(--surface))",
      "muted-foreground": "hsl(var(--muted-foreground))"
    }
  }
}
```

## Responsive Layout
```tsx
// Mobile-first: 375 → 768 → 1024 → 1440
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <div className="p-4 md:p-6" />
</div>

// Container
<div className="container mx-auto px-4 max-w-6xl">
```

## Dark Mode
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
```

## Form with Validation (shadcn/ui + react-hook-form + zod)
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({ email: z.string().email(), password: z.string().min(8) })

export function LoginForm() {
  const form = useForm({ resolver: zodResolver(schema) })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </Form>
  )
}
```

## Key Tailwind Utilities
```
Layout:    flex items-center justify-between | grid gap-4 | container mx-auto px-4
Spacing:   p-4 px-6 py-3 | m-0 mt-4 mb-6 | gap-2 gap-4 space-y-4
Type:      text-sm text-base text-lg text-xl | font-medium font-semibold font-bold
           leading-relaxed tracking-tight | text-muted-foreground
Colors:    bg-primary text-primary-foreground | bg-destructive | bg-muted
Borders:   rounded-md rounded-lg rounded-full | border border-border | ring-2 ring-ring
Shadow:    shadow-sm shadow-md shadow-lg | hover:shadow-xl transition-shadow
States:    hover:bg-accent focus-visible:ring-2 | disabled:opacity-50 disabled:cursor-not-allowed
Animation: transition-all duration-200 ease-out | animate-in fade-in slide-in-from-bottom-4
```

## Rules
- Never use raw hex — always `var(--token)` or Tailwind semantic classes
- Never use arbitrary values for colors: `text-[#123]` is forbidden
- Dark mode: every `bg-*` and `text-*` needs a `dark:` variant
- Accessible by default: shadcn/ui components use Radix primitives — don't bypass them
- Mobile-first: base class = mobile, `md:` = tablet, `lg:` = desktop
