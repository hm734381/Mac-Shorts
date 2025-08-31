markdown# Mac Shortcuts Learning Platform - Architecture Document

## Introduction

This document outlines the overall project architecture for the Mac Shortcuts Learning Platform, focusing on the frontend implementation using Next.js and shadcn/ui components. The architecture is designed to be simple, performant, and extensible for future enhancements.

**Starter Template or Existing Project:** N/A - Greenfield project using Next.js create-next-app with TypeScript template

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| Today | 1.0 | Initial Architecture | Architect |

## High Level Architecture

### Technical Summary
The Mac Shortcuts Learning Platform is a client-side web application built with Next.js 14+ using the App Router, React Server Components where appropriate, and shadcn/ui for the component library. The architecture follows a static-first approach with all shortcut data served as static JSON, utilizing browser localStorage for progress persistence. The application is deployed on Vercel's edge network for optimal performance and global distribution.

### High Level Overview
- **Architecture Style:** Static SPA with Next.js App Router
- **Repository Structure:** Monorepo
- **Service Architecture:** Client-side only (no backend services initially)
- **Primary Data Flow:** Static JSON → React Components → localStorage
- **Deployment:** Vercel Edge Network

### High Level Project Diagram
```mermaid
graph TD
    User[User Browser] --> CDN[Vercel CDN]
    CDN --> NextApp[Next.js Application]
    NextApp --> Routes[App Router Pages]
    Routes --> Components[React Components]
    Components --> ShadcnUI[shadcn/ui Components]
    Components --> Data[Static JSON Data]
    Components --> Storage[localStorage API]
    
    Components --> KeyHandler[Keyboard Event Handler]
    KeyHandler --> Practice[Practice Mode Logic]
    
    style NextApp fill:#f9f,stroke:#333,stroke-width:2px
    style ShadcnUI fill:#9f9,stroke:#333,stroke-width:2px
Architectural and Design Patterns

Component-Based Architecture: Modular React components with clear separation of concerns - Rationale: Maintainability and reusability
Static Generation: Leverage Next.js SSG for optimal performance - Rationale: Best performance for content that doesn't change frequently
Repository Pattern: Abstract data access even for static data - Rationale: Future-proofing for API integration
Observer Pattern: React hooks for state management and side effects - Rationale: React's native pattern for reactive updates
Composite Pattern: Nested component hierarchy for UI composition - Rationale: Natural fit for React component architecture

Tech Stack
Cloud Infrastructure

Provider: Vercel
Key Services: Edge Functions (future), Analytics, Web Vitals
Deployment Regions: Global Edge Network

Technology Stack Table
CategoryTechnologyVersionPurposeRationaleLanguageTypeScript5.3+Primary development languageType safety, better IDE support, fewer runtime errorsRuntimeNode.js20 LTSBuild and development runtimeLatest LTS for stabilityFrameworkNext.js14.2+React frameworkApp Router, RSC, built-in optimizationsUI Libraryshadcn/uiLatestComponent libraryAccessible, customizable, Radix UI basedStylingTailwind CSS3.4+Utility-first CSSPairs with shadcn/ui, rapid developmentState ManagementZustand4.5+Client state managementSimple, TypeScript-friendly, lightweightBuild ToolNext.js CLIBuilt-inBuild and dev serverIntegrated with frameworkPackage Managerpnpm8+Dependency managementFaster, more efficient than npmLintingESLint8+Code qualityNext.js config + custom rulesFormattingPrettier3+Code formattingConsistent code styleTestingVitest1.2+Unit testingFast, ESM native, Jest compatibleE2E TestingPlaywright1.40+End-to-end testingCross-browser testingIconsLucide ReactLatestIcon libraryConsistent with shadcn/uiAnalyticsVercel AnalyticsLatestUsage analyticsBuilt-in with Vercel
Data Models
Shortcut
Purpose: Core entity representing a keyboard shortcut
Key Attributes:

id: string - Unique identifier
category: CategoryType - Category classification
name: string - Display name
description: string - What the shortcut does
keys: KeyCombination - Key combination details
difficulty: 'beginner' | 'intermediate' | 'advanced' - Skill level
tags: string[] - Searchable tags
frequency: 'common' | 'occasional' | 'rare' - Usage frequency

TypeScript Interface:
typescriptinterface Shortcut {
  id: string;
  category: CategoryType;
  name: string;
  description: string;
  keys: KeyCombination;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  frequency: 'common' | 'occasional' | 'rare';
}

interface KeyCombination {
  modifiers: ('cmd' | 'option' | 'ctrl' | 'shift')[];
  key: string;
  displayFormat: string; // e.g., "⌘⇧A"
}
Relationships:

Belongs to one Category
Has many UserProgress records

Category
Purpose: Grouping mechanism for shortcuts
Key Attributes:

id: string - Unique identifier
name: string - Display name
icon: string - Visual identifier
description: string - Category description
shortcutIds: string[] - Associated shortcuts
order: number - Display order

TypeScript Interface:
typescriptinterface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  shortcutIds: string[];
  order: number;
}
Relationships:

Contains many Shortcuts

UserProgress
Purpose: Track individual shortcut learning progress
Key Attributes:

shortcutId: string - Reference to shortcut
attempts: number - Total practice attempts
successes: number - Successful attempts
lastPracticed: Date - Most recent practice
mastered: boolean - Mastery status
notes: string (optional) - User notes

TypeScript Interface:
typescriptinterface UserProgress {
  shortcutId: string;
  attempts: number;
  successes: number;
  lastPracticed: Date;
  mastered: boolean;
  notes?: string;
}

interface UserStats {
  totalLearned: number;
  totalMastered: number;
  streakDays: number;
  lastPracticeDate: Date;
  categoryProgress: Record<string, CategoryProgress>;
}
Relationships:

References one Shortcut
Belongs to user session (localStorage)

Components
Data Layer
Responsibility: Manage static shortcut data and user progress
Key Interfaces:

getShortcuts()
getCategories()
saveProgress()
loadProgress()

Dependencies: None (static JSON files)
Technology Stack: TypeScript interfaces, localStorage API
UI Components
Responsibility: Render interface using shadcn/ui components
Key Interfaces:

ShortcutCard
KeyboardVisualizer
PracticeMode
ProgressDashboard

Dependencies: shadcn/ui, Tailwind CSS
Technology Stack: React, TypeScript, Radix UI primitives
Business Logic
Responsibility: Handle practice sessions, progress tracking, keyboard input
Key Interfaces:

PracticeSession manager
KeyboardEventHandler
ProgressCalculator
ShortcutMatcher

Dependencies: Data Layer
Technology Stack: TypeScript, Web APIs
State Management
Responsibility: Manage application state and user session
Key Interfaces:

useShortcutStore
useProgressStore
usePreferencesStore

Dependencies: Zustand
Technology Stack: Zustand, React Context
Core Workflows
mermaidsequenceDiagram
    participant U as User
    participant B as Browser
    participant A as Next.js App
    participant D as Data Layer
    participant L as localStorage

    Note over U,L: Practice Mode Workflow
    U->>B: Press keyboard shortcut
    B->>A: Keyboard event
    A->>A: Process key combination
    A->>D: Check correct answer
    D->>A: Return validation
    A->>L: Save attempt result
    L->>A: Confirm saved
    A->>U: Show feedback (correct/incorrect)
    
    Note over U,L: Progress Tracking
    A->>L: Load user progress
    L->>A: Return progress data
    A->>A: Calculate statistics
    A->>U: Display progress dashboard
Database Schema
Static Data Structure (JSON):
/data
  /shortcuts.json     # All shortcuts data
  /categories.json    # Category definitions
  /metadata.json      # App metadata and configuration
localStorage Schema:
javascript// Key: 'mac-shortcuts-progress'
{
  version: '1.0',
  userData: {
    stats: UserStats,
    progress: UserProgress[],
    preferences: UserPreferences
  },
  lastUpdated: ISO timestamp
}
Source Tree
mac-shortcuts-app/
├── .next/                      # Next.js build output
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page
│   ├── learn/
│   │   └── page.tsx            # Learning interface
│   ├── practice/
│   │   └── page.tsx            # Practice mode
│   ├── reference/
│   │   └── page.tsx            # Quick reference
│   ├── progress/
│   │   └── page.tsx            # Progress dashboard
│   └── globals.css             # Global styles with Tailwind
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── command.tsx
│   │   └── ...
│   ├── shortcuts/              # Feature components
│   │   ├── shortcut-card.tsx
│   │   ├── category-grid.tsx
│   │   └── shortcut-list.tsx
│   ├── keyboard/               # Keyboard components
│   │   ├── keyboard-visualizer.tsx
│   │   ├── key-display.tsx
│   │   └── key-listener.tsx
│   ├── practice/               # Practice components
│   │   ├── practice-session.tsx
│   │   ├── practice-prompt.tsx
│   │   └── practice-feedback.tsx
│   └── layout/                 # Layout components
│       ├── header.tsx
│       ├── navigation.tsx
│       └── theme-toggle.tsx
├── lib/
│   ├── utils.ts                # Utility functions
│   ├── shortcuts-data.ts       # Data access layer
│   ├── keyboard-utils.ts       # Keyboard handling
│   └── storage.ts              # localStorage wrapper
├── hooks/                       # Custom React hooks
│   ├── use-shortcuts.ts
│   ├── use-progress.ts
│   ├── use-keyboard.ts
│   └── use-practice-session.ts
├── store/                       # Zustand stores
│   ├── shortcuts-store.ts
│   ├── progress-store.ts
│   └── preferences-store.ts
├── data/                        # Static data
│   ├── shortcuts.json
│   ├── categories.json
│   └── metadata.json
├── types/                       # TypeScript types
│   ├── shortcut.ts
│   ├── progress.ts
│   └── index.ts
├── styles/                      # Additional styles
│   └── components.css
├── public/                      # Static assets
│   └── icons/
├── tests/                       # Test files
│   ├── unit/
│   └── e2e/
├── .env.local                   # Environment variables
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
Infrastructure and Deployment
Infrastructure as Code

Tool: Vercel CLI / vercel.json
Location: vercel.json in root
Approach: Configuration as code for Vercel platform

Deployment Strategy

Strategy: Continuous Deployment on push to main
CI/CD Platform: Vercel (integrated with GitHub)
Pipeline Configuration: .github/workflows/ci.yml for tests

Environments

Development: http://localhost:3000 - Local development
Preview: Auto-generated Vercel preview URLs - PR previews
Production: https://your-domain.vercel.app - Live environment

Environment Promotion Flow
Local Dev → GitHub PR → Vercel Preview → Merge to Main → Production
Rollback Strategy

Primary Method: Vercel instant rollback to previous deployment
Trigger Conditions: Failed health checks, error rate spike
Recovery Time Objective: < 1 minute

Error Handling Strategy
General Approach

Error Model: Try-catch with fallback UI
Exception Hierarchy: Custom error classes for different scenarios
Error Propagation: Error boundaries at route and component level

Logging Standards

Library: Console for development, Vercel Analytics for production
Format: Structured JSON logs
Levels: ERROR, WARN, INFO, DEBUG
Required Context:

Correlation ID: Request ID from Vercel
Service Context: Component/function name
User Context: Session ID (no PII)



Error Handling Patterns
Data Loading Errors

Retry Policy: No retry for static data
Fallback UI: Show error message with reload option
Error Message: User-friendly explanation

localStorage Errors

Fallback: Continue without persistence
User Notice: Toast notification about limited functionality
Recovery: Attempt to fix on next session

Coding Standards
Core Standards

Languages & Runtimes: TypeScript 5.3+, Node.js 20 LTS
Style & Linting: ESLint with Next.js config, Prettier
Test Organization: __tests__ folders, .test.ts suffix

Naming Conventions
ElementConventionExampleComponentsPascalCaseShortcutCard.tsxHookscamelCase with 'use'useKeyboard.tsUtilitiescamelCaseformatShortcut.tsTypes/InterfacesPascalCaseShortcutDataConstantsUPPER_SNAKE_CASEMAX_ATTEMPTS
Critical Rules

Component Structure: Use function components with TypeScript interfaces for props
Data Access: Always use data access layer functions, never direct JSON imports in components
State Updates: Use Zustand actions, never mutate state directly
Error Handling: All data operations must have try-catch with user feedback
Accessibility: All interactive elements must have proper ARIA labels
Key Events: Use the centralized keyboard handler, don't attach listeners directly

Test Strategy and Standards
Testing Philosophy

Approach: Test user behavior, not implementation
Coverage Goals: 80% for business logic, 60% for UI
Test Pyramid: Many unit tests, some integration, few E2E

Test Types and Organization
Unit Tests

Framework: Vitest 1.2+
File Convention: *.test.ts or *.test.tsx
Location: __tests__ folders next to source
Mocking Library: Vitest built-in mocks
Coverage Requirement: 80% for /lib and /hooks

AI Agent Requirements:

Generate tests for all public methods
Cover edge cases and error conditions
Follow AAA pattern (Arrange, Act, Assert)
Mock all external dependencies

Integration Tests

Scope: User flows within the app
Location: tests/integration/
Test Infrastructure:

localStorage: Mock implementation
Static Data: Test fixtures



End-to-End Tests

Framework: Playwright 1.40+
Scope: Critical user journeys
Environment: Against preview deployments
Test Data: Seeded test scenarios

Test Data Management

Strategy: Static test fixtures
Fixtures: tests/fixtures/
Factories: Test data builders for complex objects
Cleanup: localStorage clear between tests

Continuous Testing

CI Integration: Run tests on PR, block merge on failure
Performance Tests: Lighthouse CI for web vitals
Security Tests: Dependency scanning with Dependabot

Security
Input Validation

Validation Library: Zod for schema validation
Validation Location: At component boundaries
Required Rules:

All external inputs MUST be validated
Validation at component boundary before processing
Whitelist approach preferred over blacklist



Authentication & Authorization

Auth Method: No authentication required for MVP
Session Management: Anonymous sessions via localStorage
Required Patterns:

No PII collection
Session data stays client-side



Secrets Management

Development: .env.local for any API keys
Production: Vercel environment variables
Code Requirements:

NEVER hardcode secrets
Access via process.env only
No secrets in client-side code



API Security

Rate Limiting: Vercel Edge default limits
CORS Policy: Not applicable (no API)
Security Headers: Via next.config.js
HTTPS Enforcement: Automatic on Vercel

Data Protection

Encryption at Rest: Not required (no sensitive data)
Encryption in Transit: HTTPS everywhere
PII Handling: No PII collected
Logging Restrictions: No user data in logs

Dependency Security

Scanning Tool: GitHub Dependabot
Update Policy: Monthly review and update
Approval Process: PR review for all dependency updates

Security Testing

SAST Tool: ESLint security plugin
DAST Tool: Not required for static site
Penetration Testing: Not required for MVP