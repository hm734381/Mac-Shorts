# Story 1-1: Project Foundation & Configuration

## Story Information
- **Story ID**: Story 1-1
- **Branch**: feature/story-1-1-foundation  
- **Dependencies**: None (can start immediately)
- **Parallel-safe**: true
- **Module/area**: Root configuration files, project setup
- **Estimated effort**: 2-3 hours

## Story Description
As a developer, I want to set up the foundational Next.js project with TypeScript, Tailwind CSS, and shadcn/ui so that we have a properly configured development environment ready for feature development.

## Acceptance Criteria
1. ✅ Next.js 14+ project initialized with TypeScript and App Router
2. ✅ Tailwind CSS configured and working
3. ✅ shadcn/ui initialized with base configuration
4. ✅ ESLint configured with Next.js recommended rules
5. ✅ Prettier configured for consistent code formatting
6. ✅ Basic folder structure created as per architecture
7. ✅ Vercel deployment configuration in place
8. ✅ Git repository initialized with proper .gitignore
9. ✅ Package manager (pnpm) configured
10. ✅ Development server runs without errors

## Technical Implementation Details

### 1. Initialize Next.js Project
```bash
npx create-next-app@latest mac-shortcuts --typescript --app --tailwind --eslint
cd mac-shortcuts
```

### 2. Install pnpm and Convert
```bash
npm install -g pnpm
rm -rf node_modules package-lock.json
pnpm install
```

### 3. Initialize shadcn/ui
```bash
pnpm dlx shadcn-ui@latest init
```
- Choose: New York style
- Choose: Slate base color
- Choose: CSS variables for colors

### 4. Create Folder Structure
```
mac-shortcuts/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── learn/
│   │   └── page.tsx
│   ├── practice/
│   │   └── page.tsx
│   ├── reference/
│   │   └── page.tsx
│   └── progress/
│       └── page.tsx
├── components/
│   ├── ui/           (shadcn/ui components)
│   ├── shortcuts/
│   ├── keyboard/
│   ├── practice/
│   └── layout/
├── lib/
├── hooks/
├── store/
├── data/
├── types/
├── styles/
└── tests/
    ├── unit/
    └── e2e/
```

### 5. Configure ESLint & Prettier

**.eslintrc.json**:
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

**.prettierrc**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false
}
```

### 6. Update package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  }
}
```

### 7. Configure Vercel Deployment

**vercel.json**:
```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### 8. Update tsconfig.json Paths
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/hooks/*": ["hooks/*"],
      "@/store/*": ["store/*"],
      "@/data/*": ["data/*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

## Dependencies to Install
```bash
# Core dependencies (should already be installed)
pnpm add next@latest react@latest react-dom@latest

# Development dependencies
pnpm add -D @types/node @types/react @types/react-dom
pnpm add -D eslint eslint-config-next prettier
pnpm add -D typescript tailwindcss postcss autoprefixer

# shadcn/ui dependencies
pnpm add class-variance-authority clsx tailwind-merge
pnpm add lucide-react
```

## Testing Checklist
- [ ] Run `pnpm dev` - development server starts on http://localhost:3000
- [ ] Run `pnpm build` - project builds without errors
- [ ] Run `pnpm lint` - no linting errors
- [ ] Run `pnpm type-check` - no TypeScript errors
- [ ] Navigate to /learn, /practice, /reference, /progress routes
- [ ] Dark mode toggle works (if implemented)
- [ ] Tailwind styles apply correctly
- [ ] shadcn/ui components render properly

## Git Workflow
```bash
# Create and checkout feature branch
git checkout -b feature/story-1-1-foundation

# Make changes and commit
git add .
git commit -m "feat: initialize Next.js project with TypeScript and shadcn/ui"

# Push to remote
git push -u origin feature/story-1-1-foundation
```

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Code follows established conventions
- [ ] No console errors or warnings
- [ ] Development environment fully functional
- [ ] README.md updated with setup instructions
- [ ] Committed to feature branch
- [ ] Ready for parallel development on other stories

## Notes for AI Agent Implementation
- Start with `create-next-app` using the latest version
- Ensure all configuration files are properly formatted
- Create empty page.tsx files for each route to prevent 404 errors
- Don't add any actual UI components yet - that's for other stories
- Focus only on setup and configuration
- Make sure the folder structure exactly matches the architecture document