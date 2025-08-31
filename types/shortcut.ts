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