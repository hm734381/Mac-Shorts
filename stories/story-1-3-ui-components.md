# Story 1-3: UI Component Library Setup

## Story Information
- **Story ID**: Story 1-3
- **Branch**: feature/story-1-3-ui-components
- **Dependencies**: None (can start immediately)
- **Parallel-safe**: true
- **Module/area**: /components/ui, /components/layout
- **Estimated effort**: 2-3 hours

## Story Description
As a developer, I want to set up the shadcn/ui component library with all required components and create base layout components so that we have a consistent UI foundation for the application.

## Acceptance Criteria
1. ✅ All required shadcn/ui components installed and configured
2. ✅ Dark mode toggle implemented and working
3. ✅ Header component with navigation created
4. ✅ Layout components responsive on all screen sizes
5. ✅ Lucide React icons configured and working
6. ✅ Component styling patterns established
7. ✅ Theme configuration complete
8. ✅ Base color scheme applied
9. ✅ Typography scales defined
10. ✅ Component documentation created

## Technical Implementation Details

### 1. Install Required shadcn/ui Components
```bash
# Core components
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add label
pnpm dlx shadcn-ui@latest add tabs
pnpm dlx shadcn-ui@latest add badge
pnpm dlx shadcn-ui@latest add progress
pnpm dlx shadcn-ui@latest add toast
pnpm dlx shadcn-ui@latest add command
pnpm dlx shadcn-ui@latest add dialog
pnpm dlx shadcn-ui@latest add dropdown-menu
pnpm dlx shadcn-ui@latest add navigation-menu
pnpm dlx shadcn-ui@latest add separator
pnpm dlx shadcn-ui@latest add skeleton
pnpm dlx shadcn-ui@latest add toggle
pnpm dlx shadcn-ui@latest add tooltip
pnpm dlx shadcn-ui@latest add form
pnpm dlx shadcn-ui@latest add accordion
pnpm dlx shadcn-ui@latest add scroll-area
```

### 2. Create Theme Provider

**components/theme-provider.tsx**:
```typescript
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### 3. Create Header Component

**components/layout/header.tsx**:
```typescript
"use client"

import Link from "next/link"
import { Keyboard } from "lucide-react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { cn } from "@/lib/utils"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Keyboard className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Mac Shortcuts
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/learn" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  )}>
                    Learn
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/practice" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  )}>
                    Practice
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/reference" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  )}>
                    Reference
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/progress" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  )}>
                    Progress
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

### 4. Create Theme Toggle Component

**components/layout/theme-toggle.tsx**:
```typescript
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 5. Update Root Layout

**app/layout.tsx**:
```typescript
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mac Shortcuts - Learn macOS Keyboard Shortcuts",
  description: "Master Mac keyboard shortcuts with interactive practice and visual learning",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 6. Configure Global Styles

**app/globals.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 7. Create Component Examples

**components/ui/examples.tsx**:
```typescript
// Example usage of components for reference
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function ComponentExamples() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
      
      <Progress value={66} className="w-full" />
    </div>
  )
}
```

## Required Dependencies
```bash
# Theme support
pnpm add next-themes

# Icons
pnpm add lucide-react

# Additional shadcn/ui dependencies (auto-installed with components)
pnpm add @radix-ui/react-accordion
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-label
pnpm add @radix-ui/react-navigation-menu
pnpm add @radix-ui/react-progress
pnpm add @radix-ui/react-scroll-area
pnpm add @radix-ui/react-separator
pnpm add @radix-ui/react-tabs
pnpm add @radix-ui/react-toast
pnpm add @radix-ui/react-toggle
pnpm add @radix-ui/react-tooltip
pnpm add cmdk
```

## Testing Checklist
- [ ] All shadcn/ui components installed successfully
- [ ] Dark mode toggle switches themes correctly
- [ ] Header navigation links work
- [ ] Components render without errors
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Theme persists on page refresh
- [ ] All Lucide icons display correctly
- [ ] Toast notifications work
- [ ] No console errors or warnings

## Git Workflow
```bash
# Create worktree for parallel development
git worktree add -b feature/story-1-3-ui-components ../mac-shorts-ui-components

# Work in the worktree
cd ../mac-shorts-ui-components

# Make changes and commit
git add .
git commit -m "feat: setup shadcn/ui component library with theme support"

# Push to remote
git push -u origin feature/story-1-3-ui-components
```

## Definition of Done
- [ ] All acceptance criteria met
- [ ] All required components installed
- [ ] Theme system working
- [ ] Layout components responsive
- [ ] No TypeScript errors
- [ ] Component patterns documented
- [ ] Ready for feature development

## Notes for AI Agent Implementation
- Install components one by one to avoid conflicts
- Test each component after installation
- Ensure theme provider wraps the entire app
- Use the cn() utility for conditional classes
- Follow shadcn/ui patterns for consistency
- Don't customize components yet - just get them working
- Make sure all imports use the @ alias