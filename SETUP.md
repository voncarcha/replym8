# Quick Setup Guide

## ✅ What's Already Configured

- ✅ Next.js 16 with App Router
- ✅ TypeScript configuration
- ✅ TailwindCSS 4 with dark mode (class strategy)
- ✅ shadcn/ui configuration (`components.json`)
- ✅ Absolute imports (`@/` alias)
- ✅ Zustand for state management
- ✅ Theme toggle component
- ✅ Navbar and Footer components
- ✅ Route groups: `(marketing)` and `(dashboard)`
- ✅ Utility functions (`cn` helper)
- ✅ Project folder structure

## 🚀 Next Steps

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Add More shadcn/ui Components (As Needed)
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label
```

## 📋 Converting Your HTML Code

When you're ready to convert your HTML + Tailwind code:

1. **Share your HTML code** - Paste it here
2. **I'll convert it** to React Server Components
3. **Extract reusable pieces** into components
4. **Use shadcn/ui** where appropriate
5. **Follow the project structure** conventions

## 🎯 Component Conversion Checklist

- [ ] Convert `class` → `className`
- [ ] Use Server Components (no `"use client"` unless needed)
- [ ] Extract repeated UI into components
- [ ] Use shadcn/ui components (Button, Card, Dialog, etc.)
- [ ] Add TypeScript types for props
- [ ] Use `cn()` helper for conditional classes
- [ ] Follow PascalCase naming for components
- [ ] Place components in correct folders:
  - `src/components/ui/` - shadcn components
  - `src/components/shared/` - custom shared components
  - `app/(segment)/components/` - route-specific components

## 📁 Key Files

- `src/app/layout.tsx` - Root layout with Navbar/Footer
- `src/app/providers.tsx` - Theme provider
- `src/components/shared/navbar.tsx` - Navigation bar
- `src/components/shared/footer.tsx` - Footer component
- `src/components/shared/theme-toggle.tsx` - Dark mode toggle
- `src/lib/utils.ts` - Utility functions (cn helper)
- `src/lib/store.ts` - Zustand theme store
- `components.json` - shadcn/ui configuration

## 🎨 Styling

- Use TailwindCSS utility classes
- Use `cn()` for conditional classes: `cn("base-class", className)`
- Dark mode: Use `dark:` prefix for dark mode styles
- Colors: Use CSS variables (defined in `globals.css`)

## 🔧 Common Patterns

### Button
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Conditional Classes
```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)}>
```

---

**Ready to convert your HTML code? Paste it and I'll handle the rest!**

