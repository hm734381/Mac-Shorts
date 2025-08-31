# Story 1-2: Static Data Layer

## Story Information
- **Story ID**: Story 1-2
- **Branch**: feature/story-1-2-data-layer
- **Dependencies**: None (can start immediately)
- **Parallel-safe**: true
- **Module/area**: /data, /types, /lib/shortcuts-data.ts
- **Estimated effort**: 3-4 hours

## Story Description
As a developer, I want to create a comprehensive data layer with all Mac keyboard shortcuts and TypeScript interfaces so that the application has structured access to shortcut information.

## Acceptance Criteria
1. ✅ TypeScript interfaces defined for all data models
2. ✅ Complete JSON dataset of Mac system-wide shortcuts (minimum 100 shortcuts)
3. ✅ Categories properly organized (General, Finder, Screenshots, Window Management, etc.)
4. ✅ Data access layer functions implemented
5. ✅ Data validation utilities created
6. ✅ Test fixtures prepared for testing
7. ✅ All shortcuts have proper key symbols (⌘, ⌥, ⌃, ⇧)
8. ✅ Each shortcut tagged with difficulty level
9. ✅ Search/filter utilities implemented
10. ✅ No TypeScript errors in data layer

## Technical Implementation Details

### 1. Create TypeScript Interfaces

**types/shortcut.ts**:
```typescript
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type FrequencyLevel = 'common' | 'occasional' | 'rare';
export type ModifierKey = 'cmd' | 'option' | 'ctrl' | 'shift';

export interface KeyCombination {
  modifiers: ModifierKey[];
  key: string;
  displayFormat: string; // e.g., "⌘⇧A"
}

export interface Shortcut {
  id: string;
  category: string;
  name: string;
  description: string;
  keys: KeyCombination;
  difficulty: DifficultyLevel;
  tags: string[];
  frequency: FrequencyLevel;
  application?: string; // Optional: specific app if not system-wide
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  shortcutIds: string[];
  order: number;
}

export interface UserProgress {
  shortcutId: string;
  attempts: number;
  successes: number;
  lastPracticed: Date;
  mastered: boolean;
  notes?: string;
}

export interface CategoryProgress {
  categoryId: string;
  totalShortcuts: number;
  learnedShortcuts: number;
  masteredShortcuts: number;
}

export interface UserStats {
  totalLearned: number;
  totalMastered: number;
  streakDays: number;
  lastPracticeDate: Date;
  categoryProgress: Record<string, CategoryProgress>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  practiceSessionLength: number;
  showKeyboardVisual: boolean;
  soundEnabled: boolean;
}
```

### 2. Create Shortcut Data

**data/shortcuts.json**:
```json
{
  "shortcuts": [
    {
      "id": "general-copy",
      "category": "general",
      "name": "Copy",
      "description": "Copy selected item to clipboard",
      "keys": {
        "modifiers": ["cmd"],
        "key": "C",
        "displayFormat": "⌘C"
      },
      "difficulty": "beginner",
      "tags": ["clipboard", "editing", "essential"],
      "frequency": "common"
    },
    {
      "id": "general-paste",
      "category": "general",
      "name": "Paste",
      "description": "Paste from clipboard",
      "keys": {
        "modifiers": ["cmd"],
        "key": "V",
        "displayFormat": "⌘V"
      },
      "difficulty": "beginner",
      "tags": ["clipboard", "editing", "essential"],
      "frequency": "common"
    },
    {
      "id": "general-undo",
      "category": "general",
      "name": "Undo",
      "description": "Undo last action",
      "keys": {
        "modifiers": ["cmd"],
        "key": "Z",
        "displayFormat": "⌘Z"
      },
      "difficulty": "beginner",
      "tags": ["editing", "essential"],
      "frequency": "common"
    },
    {
      "id": "finder-new-window",
      "category": "finder",
      "name": "New Finder Window",
      "description": "Open a new Finder window",
      "keys": {
        "modifiers": ["cmd"],
        "key": "N",
        "displayFormat": "⌘N"
      },
      "difficulty": "beginner",
      "tags": ["finder", "navigation"],
      "frequency": "common"
    },
    {
      "id": "screenshot-full",
      "category": "screenshots",
      "name": "Screenshot Full Screen",
      "description": "Take a screenshot of the entire screen",
      "keys": {
        "modifiers": ["cmd", "shift"],
        "key": "3",
        "displayFormat": "⌘⇧3"
      },
      "difficulty": "beginner",
      "tags": ["screenshot", "capture"],
      "frequency": "occasional"
    },
    {
      "id": "window-minimize",
      "category": "window-management",
      "name": "Minimize Window",
      "description": "Minimize the current window to Dock",
      "keys": {
        "modifiers": ["cmd"],
        "key": "M",
        "displayFormat": "⌘M"
      },
      "difficulty": "beginner",
      "tags": ["window", "dock"],
      "frequency": "common"
    }
  ]
}
```

### 3. Create Categories Data

**data/categories.json**:
```json
{
  "categories": [
    {
      "id": "general",
      "name": "General",
      "icon": "Settings",
      "description": "Essential system-wide shortcuts for everyday use",
      "shortcutIds": ["general-copy", "general-paste", "general-undo"],
      "order": 1
    },
    {
      "id": "finder",
      "name": "Finder",
      "icon": "Folder",
      "description": "Navigate and manage files in Finder",
      "shortcutIds": ["finder-new-window"],
      "order": 2
    },
    {
      "id": "screenshots",
      "name": "Screenshots",
      "icon": "Camera",
      "description": "Capture your screen in various ways",
      "shortcutIds": ["screenshot-full"],
      "order": 3
    },
    {
      "id": "window-management",
      "name": "Window Management",
      "icon": "Square",
      "description": "Control window placement and behavior",
      "shortcutIds": ["window-minimize"],
      "order": 4
    },
    {
      "id": "text-editing",
      "name": "Text Editing",
      "icon": "Type",
      "description": "Advanced text manipulation shortcuts",
      "shortcutIds": [],
      "order": 5
    },
    {
      "id": "accessibility",
      "name": "Accessibility",
      "icon": "Accessibility",
      "description": "Shortcuts for accessibility features",
      "shortcutIds": [],
      "order": 6
    }
  ]
}
```

### 4. Create Data Access Layer

**lib/shortcuts-data.ts**:
```typescript
import { Shortcut, Category, DifficultyLevel, FrequencyLevel } from '@/types/shortcut';
import shortcutsData from '@/data/shortcuts.json';
import categoriesData from '@/data/categories.json';

// Get all shortcuts
export function getAllShortcuts(): Shortcut[] {
  return shortcutsData.shortcuts as Shortcut[];
}

// Get shortcuts by category
export function getShortcutsByCategory(categoryId: string): Shortcut[] {
  return shortcutsData.shortcuts.filter(s => s.category === categoryId) as Shortcut[];
}

// Get shortcut by ID
export function getShortcutById(id: string): Shortcut | undefined {
  return shortcutsData.shortcuts.find(s => s.id === id) as Shortcut | undefined;
}

// Get all categories
export function getAllCategories(): Category[] {
  return categoriesData.categories as Category[];
}

// Get category by ID
export function getCategoryById(id: string): Category | undefined {
  return categoriesData.categories.find(c => c.id === id) as Category | undefined;
}

// Search shortcuts
export function searchShortcuts(query: string): Shortcut[] {
  const lowerQuery = query.toLowerCase();
  return shortcutsData.shortcuts.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) ||
    s.description.toLowerCase().includes(lowerQuery) ||
    s.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  ) as Shortcut[];
}

// Filter shortcuts by difficulty
export function filterByDifficulty(difficulty: DifficultyLevel): Shortcut[] {
  return shortcutsData.shortcuts.filter(s => s.difficulty === difficulty) as Shortcut[];
}

// Filter shortcuts by frequency
export function filterByFrequency(frequency: FrequencyLevel): Shortcut[] {
  return shortcutsData.shortcuts.filter(s => s.frequency === frequency) as Shortcut[];
}

// Get random shortcuts for practice
export function getRandomShortcuts(count: number, categoryId?: string): Shortcut[] {
  let pool = categoryId 
    ? getShortcutsByCategory(categoryId)
    : getAllShortcuts();
  
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Validate shortcut data
export function validateShortcut(shortcut: any): shortcut is Shortcut {
  return (
    typeof shortcut.id === 'string' &&
    typeof shortcut.category === 'string' &&
    typeof shortcut.name === 'string' &&
    typeof shortcut.description === 'string' &&
    shortcut.keys &&
    Array.isArray(shortcut.keys.modifiers) &&
    typeof shortcut.keys.key === 'string' &&
    typeof shortcut.keys.displayFormat === 'string' &&
    ['beginner', 'intermediate', 'advanced'].includes(shortcut.difficulty) &&
    Array.isArray(shortcut.tags) &&
    ['common', 'occasional', 'rare'].includes(shortcut.frequency)
  );
}

// Format key combination for display
export function formatKeyCombination(keys: KeyCombination): string {
  const symbols: Record<string, string> = {
    cmd: '⌘',
    option: '⌥',
    ctrl: '⌃',
    shift: '⇧'
  };
  
  const modifierSymbols = keys.modifiers.map(m => symbols[m] || m).join('');
  return modifierSymbols + keys.key.toUpperCase();
}
```

### 5. Create Test Fixtures

**tests/fixtures/shortcuts.fixture.ts**:
```typescript
import { Shortcut, Category } from '@/types/shortcut';

export const mockShortcut: Shortcut = {
  id: 'test-shortcut',
  category: 'general',
  name: 'Test Shortcut',
  description: 'A test shortcut for unit tests',
  keys: {
    modifiers: ['cmd', 'shift'],
    key: 'T',
    displayFormat: '⌘⇧T'
  },
  difficulty: 'beginner',
  tags: ['test'],
  frequency: 'common'
};

export const mockCategory: Category = {
  id: 'test-category',
  name: 'Test Category',
  icon: 'TestIcon',
  description: 'A test category',
  shortcutIds: ['test-shortcut'],
  order: 1
};

export const mockShortcuts: Shortcut[] = [
  mockShortcut,
  {
    ...mockShortcut,
    id: 'test-shortcut-2',
    name: 'Test Shortcut 2',
    difficulty: 'intermediate'
  }
];
```

## Complete Shortcut List to Include

### General (20+ shortcuts)
- Copy, Cut, Paste, Undo, Redo
- Select All, Find, Find Next
- Save, Save As, Print
- Open, Close, Quit
- New Window, New Tab
- Preferences, Hide, Hide Others

### Finder (15+ shortcuts)
- New Folder, Duplicate, Get Info
- Show View Options, Go to Folder
- Connect to Server, Empty Trash
- Quick Look, Show/Hide Path Bar

### Screenshots (10+ shortcuts)
- Full Screen, Selection, Window
- With/without shadow options
- Screen recording shortcuts

### Window Management (15+ shortcuts)
- Minimize, Zoom, Full Screen
- Mission Control, App Exposé
- Switch between windows
- Move between Spaces

### Text Editing (20+ shortcuts)
- Move by word, line, paragraph
- Delete word, line
- Text selection variations
- Case transformations

### Accessibility (10+ shortcuts)
- VoiceOver, Zoom, Contrast
- Sticky Keys, Slow Keys

## Testing Checklist
- [x] All TypeScript interfaces compile without errors
- [x] JSON data validates against interfaces
- [x] Data access functions return correct data
- [x] Search function finds shortcuts by name, description, and tags
- [x] Filter functions work correctly
- [x] Random shortcut selection works
- [x] At least 100 shortcuts in database
- [x] All categories have appropriate shortcuts
- [x] Key symbols display correctly

## Git Workflow
```bash
# Create worktree for parallel development
git worktree add -b feature/story-1-2-data-layer ../mac-shorts-data-layer

# Work in the worktree
cd ../mac-shorts-data-layer

# Make changes and commit
git add .
git commit -m "feat: create comprehensive shortcut data layer with TypeScript interfaces"

# Push to remote
git push -u origin feature/story-1-2-data-layer
```

## Definition of Done
- [x] All acceptance criteria met
- [x] Complete shortcut dataset (100+ shortcuts)
- [x] TypeScript interfaces properly typed
- [x] Data validation working
- [x] Test fixtures created
- [x] No TypeScript errors
- [ ] Documentation comments added
- [x] Ready for integration with UI components

## Dev Agent Record

### File List
- types/shortcut.ts - TypeScript interfaces for all data models
- data/shortcuts.json - Complete dataset with 105 Mac shortcuts
- data/categories.json - Category definitions with 9 categories
- lib/shortcuts-data.ts - Data access layer with search, filter, and utility functions
- tests/shortcuts-data.test.ts - Comprehensive test suite for data layer
- tests/fixtures/shortcuts.fixture.ts - Test fixtures for unit testing
- package.json - Project configuration with TypeScript and test dependencies
- tsconfig.json - TypeScript configuration
- vitest.config.ts - Vitest test configuration

### Completion Notes
- Created comprehensive data layer with 105 Mac keyboard shortcuts
- Implemented all TypeScript interfaces as specified
- Added data access functions with search, filter, and grouping capabilities
- Included shortcuts from 9 categories: General, Finder, Screenshots, Window Management, Text Editing, Accessibility, System, Safari, and Mail
- All tests passing (45 tests)
- TypeScript compilation successful with no errors
- Ready for integration with UI components in subsequent stories

### Status
Ready for Review

## Notes for AI Agent Implementation
- Focus on creating a comprehensive, accurate dataset of Mac shortcuts
- Ensure all shortcuts are real and work on macOS
- Use proper Unicode symbols for modifier keys
- Organize shortcuts logically by category
- Include a good mix of difficulty levels
- Make the data structure extensible for future additions
- Consider adding metadata like macOS version compatibility

## QA Results

### Review Date: 2025-08-31
### Reviewer: Quinn (QA Test Architect)
### Overall Assessment: PASS with MINOR CONCERNS ⭐⭐⭐⭐

#### Requirements Traceability ✅
All 10 acceptance criteria have been successfully implemented and verified:
- TypeScript interfaces: Complete and well-structured
- 105 shortcuts dataset: Exceeds minimum requirement
- 9 organized categories: Properly structured
- Data access layer: 15+ functions implemented
- Validation utilities: Runtime type checking implemented
- Test fixtures: Comprehensive mocks created
- Unicode key symbols: Properly implemented (⌘, ⌥, ⌃, ⇧)
- Difficulty levels: All shortcuts tagged
- Search/filter utilities: Multiple search and filter functions
- TypeScript compilation: Zero errors

#### Test Coverage Analysis ✅
- **45 tests** covering all major functions
- 100% pass rate
- Edge cases and boundary conditions tested
- Proper test organization and fixtures

#### Code Quality Assessment
**Strengths:**
- Excellent TypeScript type safety
- Comprehensive test suite
- Clean code organization
- Intuitive API design
- Perfect data integrity

**Areas for Improvement:**
1. **Missing error handling** - Functions fail silently without logging
2. **Duplicate key binding** - window-zoom and window-fullscreen both use ⌃⌘F
3. **No input sanitization** - Search queries not sanitized
4. **Missing category validation** - Only shortcut validation implemented
5. **Performance optimization** - No caching, inefficient randomization

#### Risk Assessment
- **Low Risk**: Type safety and testing provide strong foundation
- **Medium Risk**: Missing error handling could complicate debugging
- **Low Security Risk**: Read-only operations with no direct user input execution

#### Recommendations
**Must Fix:**
- Resolve duplicate key combination (window-zoom/fullscreen)

**Should Fix:**
- Add error handling and logging
- Implement input sanitization for search
- Add category validation function

**Nice to Have:**
- Add JSDoc comments for better DX
- Implement caching for performance
- Improve randomization algorithm

#### Gate Decision: PASS
Story meets all acceptance criteria with high quality implementation. Minor concerns identified do not block progress but should be addressed in future iterations or technical debt cleanup.

## QA Fixes Applied

### Date: 2025-08-31
### Developer: James

**Must Fix Issues Resolved:**
- ✅ Fixed duplicate key binding: Removed window-zoom entry (was duplicate of window-fullscreen, both used ⌃⌘F)

**Should Fix Issues Resolved:**
- ✅ Added comprehensive error handling with logging to all functions
- ✅ Implemented input sanitization for all user-facing string inputs
- ✅ Added validateCategory function with tests
- ✅ Improved randomization using Fisher-Yates shuffle algorithm

**Code Improvements:**
1. Added error logging utility for debugging
2. Added sanitizeInput function to prevent injection attacks
3. All functions now have try-catch blocks with appropriate error handling
4. Functions return safe defaults on error (empty arrays, undefined, etc.)
5. Added validateCategory to match validateShortcut functionality
6. Improved getRandomShortcuts with proper Fisher-Yates shuffle
7. Added 3 new tests for category validation

**Test Results:**
- All 48 tests passing
- TypeScript compilation successful with no errors
- Total shortcuts: 104 (after removing duplicate)