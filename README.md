# ReplyM8 - Next.js Starter Project

A modern, production-ready Next.js starter project built with TypeScript, TailwindCSS, and shadcn/ui components.

## 🚀 Features

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **TailwindCSS 4** for styling
- **shadcn/ui** components built on Radix UI
- **Dark mode** support with theme toggle
- **Zustand** for state management
- **Server Components** by default
- **Absolute imports** with `@/` alias
- **Responsive design** with mobile-first approach
- **Accessible** components following WCAG guidelines

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/      # Dashboard route group
│   ├── (marketing)/      # Marketing route group
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── providers.tsx      # Global providers
│   └── globals.css        # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── shared/           # Custom shared components
│       ├── navbar.tsx
│       ├── footer.tsx
│       └── theme-toggle.tsx
├── lib/
│   ├── utils.ts          # Utility functions (cn helper)
│   └── store.ts          # Zustand stores
├── hooks/
│   └── use-mounted.ts    # Custom React hooks
├── types/
│   └── index.ts          # TypeScript type definitions
└── config/
    └── site.ts           # Site configuration
```

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Install Additional shadcn/ui Components (Optional)

To add more shadcn/ui components, use:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Dependencies

### Core
- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - TypeScript support

### Styling
- `tailwindcss` - Utility-first CSS framework
- `clsx` - Conditional class names
- `tailwind-merge` - Merge Tailwind classes

### UI Components
- `@radix-ui/react-slot` - Radix UI primitives
- `@radix-ui/react-dialog` - Dialog component
- `@radix-ui/react-dropdown-menu` - Dropdown menu
- `class-variance-authority` - Component variants
- `lucide-react` - Icon library

### State Management
- `zustand` - Lightweight state management

## 🎨 Configuration

### TailwindCSS

The project uses TailwindCSS 4 with CSS variables for theming. Configuration is in `tailwind.config.ts` and `src/app/globals.css`.

### Dark Mode

Dark mode is configured using the `class` strategy. The theme toggle component allows switching between light, dark, and system preferences.

### Absolute Imports

The project uses `@/` alias for absolute imports, configured in `tsconfig.json`:

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

## 🧩 Adding New Components

### shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

### Custom Components

1. **UI Primitives**: Place in `src/components/ui/`
2. **Shared Components**: Place in `src/components/shared/`
3. **Route-specific**: Place in `app/(segment)/components/`

### Component Example

```tsx
// src/components/shared/my-component.tsx
import { cn } from "@/lib/utils";

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  );
}
```

## 📝 Converting HTML to React Components

When converting HTML + Tailwind code:

1. **Convert `class` to `className`**
2. **Use React Server Components** unless interactivity is needed
3. **Extract reusable pieces** into components
4. **Use shadcn/ui components** where applicable
5. **Follow naming conventions**: PascalCase for components
6. **Add TypeScript types** for props

### Example Conversion

**Before (HTML):**
```html
<button class="px-4 py-2 bg-blue-500 text-white rounded">
  Click me
</button>
```

**After (React):**
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">
  Click me
</Button>
```

## 🎯 Best Practices

1. **Use Server Components** by default, add `"use client"` only when needed
2. **Extract repeated UI** into reusable components
3. **Use shadcn/ui** for common UI patterns
4. **Type everything** with TypeScript
5. **Follow the folder structure** conventions
6. **Use `cn()` helper** for conditional classes
7. **Mobile-first** responsive design
8. **Accessibility** - use proper ARIA attributes

## 🚢 Building for Production

```bash
npm run build
npm start
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)

## 📄 License

MIT
