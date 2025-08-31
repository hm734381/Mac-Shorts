import { Shortcut, Category, DifficultyLevel, FrequencyLevel, KeyCombination } from '@/types/shortcut';
import shortcutsData from '@/data/shortcuts.json';
import categoriesData from '@/data/categories.json';

// Error logging utility
function logError(context: string, error: any): void {
  console.error(`[shortcuts-data] ${context}:`, error);
}

// Input sanitization utility
function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters and limit length
  return input
    .replace(/[<>'"]/g, '')
    .slice(0, 100)
    .trim();
}

// Get all shortcuts
export function getAllShortcuts(): Shortcut[] {
  try {
    return shortcutsData.shortcuts as Shortcut[];
  } catch (error) {
    logError('getAllShortcuts', error);
    return [];
  }
}

// Get shortcuts by category
export function getShortcutsByCategory(categoryId: string): Shortcut[] {
  try {
    const sanitizedId = sanitizeInput(categoryId);
    return shortcutsData.shortcuts.filter(s => s.category === sanitizedId) as Shortcut[];
  } catch (error) {
    logError('getShortcutsByCategory', error);
    return [];
  }
}

// Get shortcut by ID
export function getShortcutById(id: string): Shortcut | undefined {
  try {
    const sanitizedId = sanitizeInput(id);
    return shortcutsData.shortcuts.find(s => s.id === sanitizedId) as Shortcut | undefined;
  } catch (error) {
    logError('getShortcutById', error);
    return undefined;
  }
}

// Get all categories
export function getAllCategories(): Category[] {
  try {
    return categoriesData.categories as Category[];
  } catch (error) {
    logError('getAllCategories', error);
    return [];
  }
}

// Get category by ID
export function getCategoryById(id: string): Category | undefined {
  try {
    const sanitizedId = sanitizeInput(id);
    return categoriesData.categories.find(c => c.id === sanitizedId) as Category | undefined;
  } catch (error) {
    logError('getCategoryById', error);
    return undefined;
  }
}

// Search shortcuts
export function searchShortcuts(query: string): Shortcut[] {
  try {
    const sanitizedQuery = sanitizeInput(query);
    if (!sanitizedQuery) return [];
    
    const lowerQuery = sanitizedQuery.toLowerCase();
    return shortcutsData.shortcuts.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery) ||
      s.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ) as Shortcut[];
  } catch (error) {
    logError('searchShortcuts', error);
    return [];
  }
}

// Filter shortcuts by difficulty
export function filterByDifficulty(difficulty: DifficultyLevel): Shortcut[] {
  try {
    return shortcutsData.shortcuts.filter(s => s.difficulty === difficulty) as Shortcut[];
  } catch (error) {
    logError('filterByDifficulty', error);
    return [];
  }
}

// Filter shortcuts by frequency
export function filterByFrequency(frequency: FrequencyLevel): Shortcut[] {
  try {
    return shortcutsData.shortcuts.filter(s => s.frequency === frequency) as Shortcut[];
  } catch (error) {
    logError('filterByFrequency', error);
    return [];
  }
}

// Get random shortcuts for practice (improved Fisher-Yates shuffle)
export function getRandomShortcuts(count: number, categoryId?: string): Shortcut[] {
  try {
    if (count <= 0) return [];
    
    let pool = categoryId 
      ? getShortcutsByCategory(categoryId)
      : getAllShortcuts();
    
    // Fisher-Yates shuffle for better randomization
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, Math.min(count, shuffled.length));
  } catch (error) {
    logError('getRandomShortcuts', error);
    return [];
  }
}

// Validate shortcut data
export function validateShortcut(shortcut: any): shortcut is Shortcut {
  try {
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
  } catch (error) {
    logError('validateShortcut', error);
    return false;
  }
}

// Validate category data
export function validateCategory(category: any): category is Category {
  try {
    return (
      typeof category.id === 'string' &&
      typeof category.name === 'string' &&
      typeof category.icon === 'string' &&
      typeof category.description === 'string' &&
      Array.isArray(category.shortcutIds) &&
      category.shortcutIds.every((id: any) => typeof id === 'string') &&
      typeof category.order === 'number'
    );
  } catch (error) {
    logError('validateCategory', error);
    return false;
  }
}

// Format key combination for display
export function formatKeyCombination(keys: KeyCombination): string {
  try {
    const symbols: Record<string, string> = {
      cmd: '⌘',
      option: '⌥',
      ctrl: '⌃',
      shift: '⇧'
    };
    
    const modifierSymbols = keys.modifiers.map(m => symbols[m] || m).join('');
    return modifierSymbols + keys.key.toUpperCase();
  } catch (error) {
    logError('formatKeyCombination', error);
    return keys.displayFormat || '';
  }
}

// Get shortcuts grouped by category
export function getShortcutsGroupedByCategory(): Record<string, Shortcut[]> {
  try {
    const grouped: Record<string, Shortcut[]> = {};
    const categories = getAllCategories();
    
    categories.forEach(category => {
      grouped[category.id] = getShortcutsByCategory(category.id);
    });
    
    return grouped;
  } catch (error) {
    logError('getShortcutsGroupedByCategory', error);
    return {};
  }
}

// Get category with its shortcuts
export function getCategoryWithShortcuts(categoryId: string): { category: Category, shortcuts: Shortcut[] } | undefined {
  try {
    const category = getCategoryById(categoryId);
    if (!category) return undefined;
    
    const shortcuts = getShortcutsByCategory(categoryId);
    return { category, shortcuts };
  } catch (error) {
    logError('getCategoryWithShortcuts', error);
    return undefined;
  }
}

// Get shortcuts by tags
export function getShortcutsByTag(tag: string): Shortcut[] {
  try {
    const sanitizedTag = sanitizeInput(tag);
    if (!sanitizedTag) return [];
    
    const lowerTag = sanitizedTag.toLowerCase();
    return shortcutsData.shortcuts.filter(s => 
      s.tags.some(t => t.toLowerCase() === lowerTag)
    ) as Shortcut[];
  } catch (error) {
    logError('getShortcutsByTag', error);
    return [];
  }
}

// Get all unique tags
export function getAllTags(): string[] {
  try {
    const tagsSet = new Set<string>();
    shortcutsData.shortcuts.forEach(shortcut => {
      shortcut.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  } catch (error) {
    logError('getAllTags', error);
    return [];
  }
}

// Get shortcut statistics
export function getShortcutStatistics() {
  try {
    const shortcuts = getAllShortcuts();
    const categories = getAllCategories();
    
    return {
      totalShortcuts: shortcuts.length,
      totalCategories: categories.length,
      byDifficulty: {
        beginner: shortcuts.filter(s => s.difficulty === 'beginner').length,
        intermediate: shortcuts.filter(s => s.difficulty === 'intermediate').length,
        advanced: shortcuts.filter(s => s.difficulty === 'advanced').length
      },
      byFrequency: {
        common: shortcuts.filter(s => s.frequency === 'common').length,
        occasional: shortcuts.filter(s => s.frequency === 'occasional').length,
        rare: shortcuts.filter(s => s.frequency === 'rare').length
      },
      byCategory: categories.reduce((acc, cat) => {
        acc[cat.id] = getShortcutsByCategory(cat.id).length;
        return acc;
      }, {} as Record<string, number>)
    };
  } catch (error) {
    logError('getShortcutStatistics', error);
    return {
      totalShortcuts: 0,
      totalCategories: 0,
      byDifficulty: { beginner: 0, intermediate: 0, advanced: 0 },
      byFrequency: { common: 0, occasional: 0, rare: 0 },
      byCategory: {}
    };
  }
}