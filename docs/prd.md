# Mac Shortcuts Learning Platform - Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Enable users to efficiently learn and master system-wide Mac keyboard shortcuts
- Provide an accessible web-based platform requiring no installation
- Create an effective learning experience that promotes retention and practical application
- Reduce the learning curve for Mac users seeking productivity improvements

### Background Context
Many Mac users rely heavily on mouse/trackpad interactions, missing out on the significant productivity gains available through keyboard shortcuts. While Mac OS includes hundreds of powerful shortcuts, most users only know a handful. This web application addresses the gap between available shortcuts and user knowledge, providing a structured learning platform that makes mastering Mac shortcuts accessible and engaging.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| Today | 1.0 | Initial PRD Creation | PM |

## Requirements

### Functional
- FR1: The application shall display Mac system-wide keyboard shortcuts organized by category (e.g., General, Finder, Screenshots, Accessibility)
- FR2: The application shall provide an interactive practice mode where users can test their shortcut knowledge
- FR3: The application shall track user progress and learning statistics
- FR4: The application shall offer a visual keyboard display showing the keys to press for each shortcut
- FR5: The application shall include a search/filter function to find specific shortcuts quickly
- FR6: The application shall provide descriptions of what each shortcut does
- FR7: The application shall detect if the user is on a Mac and show appropriate keyboard layout
- FR8: The application shall offer a quick reference mode for looking up shortcuts without practice
- FR9: The application shall include common shortcut combinations that work across most Mac applications

### Non-Functional
- NFR1: The web application shall load within 3 seconds on standard broadband connections
- NFR2: The application shall be responsive and work on desktop, tablet, and mobile devices
- NFR3: The application shall work on modern browsers (Chrome, Safari, Firefox, Edge - latest 2 versions)
- NFR4: The application shall store user progress locally in browser storage
- NFR5: The application shall be accessible (WCAG AA compliant)
- NFR6: The application shall require no user registration for basic features

## User Interface Design Goals

### Overall UX Vision
Clean, focused interface that doesn't distract from learning shortcuts

### Key Interaction Paradigms
- Progressive disclosure - start simple, reveal complexity as users advance
- Immediate feedback on practice attempts
- Visual and textual learning combined

### Core Screens and Views
- Landing/Home Screen with learning paths
- Category Browser Screen
- Practice Mode Screen
- Progress Dashboard
- Quick Reference Screen

### Accessibility
WCAG AA

### Branding
Clean, modern, Apple-inspired aesthetic to match Mac design language

### Target Device and Platforms
Web Responsive (optimized for desktop but functional on all devices)

## Technical Assumptions

### Repository Structure: Monorepo

### Service Architecture
Next.js application with App Router

### Testing Requirements
Unit tests for core logic, integration tests for user flows

### Additional Technical Assumptions
- Frontend framework: Next.js 14+ with TypeScript
- UI Components: shadcn/ui components (Radix UI primitives with Tailwind CSS)
- Styling: Tailwind CSS (comes with shadcn/ui)
- No backend API required initially (all shortcut data as static JSON, progress in localStorage)
- Deployment to Vercel (optimal for Next.js)
- Keyboard event handling using Web APIs
- State management: React hooks and context (Zustand if needed for complex state)

## Epic List

- Epic 1: Foundation & Core Data - Set up project, create shortcut database, establish basic UI structure
- Epic 2: Learning Interface - Build category browser, shortcut display, and visual keyboard component
- Epic 3: Practice Mode - Create interactive practice system with progress tracking
- Epic 4: User Progress & Polish - Add progress persistence, quick reference mode, and final UI polish

## Epic 1: Foundation & Core Data

**Epic Goal:** Establish Next.js project with shadcn/ui, create comprehensive shortcut database, and implement basic navigation structure.

### Story 1.1: Project Setup & Configuration
As a developer,
I want to initialize the Next.js project with shadcn/ui,
so that we have a working foundation with our component library.

**Acceptance Criteria:**
1. Next.js project created with TypeScript and App Router
2. Tailwind CSS configured
3. shadcn/ui initialized with base components
4. ESLint and Prettier configured
5. Basic folder structure established (/app, /components, /lib, /data)
6. Vercel deployment configured
7. Git repository initialized with .gitignore

### Story 1.2: Shortcut Data Structure & Database
As a developer,
I want to create the Mac shortcuts data structure,
so that we have all shortcut information available for the app.

**Acceptance Criteria:**
1. JSON data structure defined for shortcuts (category, name, keys, description, tags)
2. Complete dataset of system-wide Mac shortcuts created
3. Categories include: General, Finder, Screenshots, Window Management, Accessibility, Text Editing
4. Each shortcut has: id, category, name, key combination, description, difficulty level
5. Data validation utility created
6. TypeScript interfaces defined for shortcut data

### Story 1.3: Basic Layout & Navigation
As a user,
I want to see a clean application layout with navigation,
so that I can access different sections of the app.

**Acceptance Criteria:**
1. Next.js layout with header and main content area
2. Navigation using shadcn/ui NavigationMenu or Tabs
3. Responsive layout working on desktop and mobile
4. Home page with welcome message and feature cards
5. Basic routing set up for /learn, /practice, /reference
6. Dark/light mode toggle using shadcn/ui theme

## Epic 2: Learning Interface

**Epic Goal:** Build the core learning experience with category browser, detailed shortcut display, and visual keyboard representation.

### Story 2.1: Category Browser
As a user,
I want to browse shortcuts by category,
so that I can focus on learning related shortcuts together.

**Acceptance Criteria:**
1. Category grid/list view using shadcn/ui Card components
2. Each category shows name, icon, and shortcut count
3. Clicking category navigates to filtered shortcut list
4. Search bar to filter categories
5. Categories show learning progress (e.g., 5/20 learned)

### Story 2.2: Shortcut Display Component
As a user,
I want to see detailed information for each shortcut,
so that I understand what it does and how to use it.

**Acceptance Criteria:**
1. Shortcut card using shadcn/ui Card with:
   - Shortcut name
   - Key combination display
   - Description of function
   - Category badge
2. Key combinations shown with proper symbols (⌘, ⌥, ⌃, ⇧)
3. Responsive layout for list of shortcuts
4. Filter/search functionality using shadcn/ui Input
5. Sort options (alphabetical, difficulty, most used)

### Story 2.3: Visual Keyboard Component
As a user,
I want to see a visual representation of the keyboard,
so that I can understand where the keys are located.

**Acceptance Criteria:**
1. SVG or CSS-based Mac keyboard layout
2. Keys highlight when showing a shortcut
3. Responsive sizing for different screens
4. Shows pressed keys for current shortcut
5. Distinguishes between left/right modifier keys
6. Tooltips on hover showing key names

## Epic 3: Practice Mode

**Epic Goal:** Create an interactive practice system where users can test their knowledge and track progress.

### Story 3.1: Practice Mode Interface
As a user,
I want to practice shortcuts interactively,
so that I can test and improve my knowledge.

**Acceptance Criteria:**
1. Practice mode screen with shortcut prompt
2. User can input keyboard shortcuts
3. Real-time detection of key combinations
4. Immediate feedback (correct/incorrect) using shadcn/ui Toast
5. Skip option if user doesn't know
6. Progress indicator for practice session

### Story 3.2: Practice Sessions & Difficulty
As a user,
I want structured practice sessions,
so that I can progressively learn shortcuts.

**Acceptance Criteria:**
1. Session options: by category, random, or failed shortcuts
2. Session length options (5, 10, 20 shortcuts)
3. Difficulty progression (start with common, advance to complex)
4. Review mode showing correct answer after attempts
5. Session summary with score and mistakes

### Story 3.3: Progress Tracking
As a user,
I want to track my learning progress,
so that I know which shortcuts I've mastered.

**Acceptance Criteria:**
1. LocalStorage persistence of user progress
2. Track: shortcuts learned, practice attempts, success rate
3. Mark shortcuts as "mastered" after consistent success
4. Progress visualization using shadcn/ui Progress components
5. Statistics dashboard with charts (optional: using Recharts)
6. Reset progress option in settings

## Epic 4: User Progress & Polish

**Epic Goal:** Add progress persistence, quick reference features, and polish the overall user experience.

### Story 4.1: Quick Reference Mode
As a user,
I want a quick reference view,
so that I can quickly look up shortcuts while working.

**Acceptance Criteria:**
1. Compact view of all shortcuts
2. Instant search/filter using shadcn/ui Command component
3. Grouped by category with collapsible sections
4. Copy shortcut to clipboard feature
5. Printable view option

### Story 4.2: User Preferences & Settings
As a user,
I want to customize my learning experience,
so that it fits my needs.

**Acceptance Criteria:**
1. Settings page using shadcn/ui Form components
2. Theme preference (light/dark/system)
3. Keyboard layout preference (if future international support)
4. Practice session defaults
5. Data export/import for progress backup

### Story 4.3: Polish & Performance
As a user,
I want a smooth and polished experience,
so that learning is enjoyable.

**Acceptance Criteria:**
1. Loading states for all data fetching
2. Error boundaries with friendly error messages
3. Smooth animations using Framer Motion or CSS
4. SEO optimization with Next.js metadata
5. Performance optimization (lazy loading, code splitting)
6. Analytics integration (optional - Vercel Analytics)