import { Shortcut, Category, UserProgress, CategoryProgress, UserStats, UserPreferences } from '@/types/shortcut';

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

export const mockShortcutAdvanced: Shortcut = {
  id: 'test-shortcut-advanced',
  category: 'text-editing',
  name: 'Advanced Test Shortcut',
  description: 'An advanced test shortcut',
  keys: {
    modifiers: ['cmd', 'option', 'shift'],
    key: 'A',
    displayFormat: '⌘⌥⇧A'
  },
  difficulty: 'advanced',
  tags: ['test', 'advanced'],
  frequency: 'rare'
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
  },
  {
    ...mockShortcut,
    id: 'test-shortcut-3',
    name: 'Test Shortcut 3',
    difficulty: 'advanced',
    frequency: 'rare'
  }
];

export const mockUserProgress: UserProgress = {
  shortcutId: 'test-shortcut',
  attempts: 10,
  successes: 8,
  lastPracticed: new Date('2024-01-15'),
  mastered: false,
  notes: 'Getting better at this'
};

export const mockCategoryProgress: CategoryProgress = {
  categoryId: 'test-category',
  totalShortcuts: 10,
  learnedShortcuts: 5,
  masteredShortcuts: 2
};

export const mockUserStats: UserStats = {
  totalLearned: 25,
  totalMastered: 10,
  streakDays: 5,
  lastPracticeDate: new Date('2024-01-15'),
  categoryProgress: {
    'general': {
      categoryId: 'general',
      totalShortcuts: 20,
      learnedShortcuts: 15,
      masteredShortcuts: 10
    },
    'finder': {
      categoryId: 'finder',
      totalShortcuts: 15,
      learnedShortcuts: 8,
      masteredShortcuts: 5
    }
  }
};

export const mockUserPreferences: UserPreferences = {
  theme: 'dark',
  practiceSessionLength: 15,
  showKeyboardVisual: true,
  soundEnabled: false
};

export const mockInvalidShortcut = {
  id: 'invalid',
  category: 'general',
  name: 'Invalid',
  // Missing required fields: description, keys, difficulty, tags, frequency
};

export const mockSearchResults: Shortcut[] = [
  {
    id: 'search-result-1',
    category: 'general',
    name: 'Copy Text',
    description: 'Copy selected text to clipboard',
    keys: {
      modifiers: ['cmd'],
      key: 'C',
      displayFormat: '⌘C'
    },
    difficulty: 'beginner',
    tags: ['clipboard', 'text', 'copy'],
    frequency: 'common'
  },
  {
    id: 'search-result-2',
    category: 'text-editing',
    name: 'Select Text',
    description: 'Select all text in document',
    keys: {
      modifiers: ['cmd'],
      key: 'A',
      displayFormat: '⌘A'
    },
    difficulty: 'beginner',
    tags: ['selection', 'text'],
    frequency: 'common'
  }
];