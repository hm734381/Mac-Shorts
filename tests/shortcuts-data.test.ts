import { describe, it, expect } from 'vitest';
import {
  getAllShortcuts,
  getShortcutsByCategory,
  getShortcutById,
  getAllCategories,
  getCategoryById,
  searchShortcuts,
  filterByDifficulty,
  filterByFrequency,
  getRandomShortcuts,
  validateShortcut,
  validateCategory,
  formatKeyCombination,
  getShortcutsGroupedByCategory,
  getCategoryWithShortcuts,
  getShortcutsByTag,
  getAllTags,
  getShortcutStatistics
} from '@/lib/shortcuts-data';
import { mockShortcut, mockInvalidShortcut } from './fixtures/shortcuts.fixture';

describe('Shortcuts Data Layer', () => {
  describe('getAllShortcuts', () => {
    it('should return an array of shortcuts', () => {
      const shortcuts = getAllShortcuts();
      expect(Array.isArray(shortcuts)).toBe(true);
      expect(shortcuts.length).toBeGreaterThan(100);
    });

    it('should return valid shortcut objects', () => {
      const shortcuts = getAllShortcuts();
      const firstShortcut = shortcuts[0];
      expect(firstShortcut).toHaveProperty('id');
      expect(firstShortcut).toHaveProperty('category');
      expect(firstShortcut).toHaveProperty('name');
      expect(firstShortcut).toHaveProperty('description');
      expect(firstShortcut).toHaveProperty('keys');
      expect(firstShortcut).toHaveProperty('difficulty');
      expect(firstShortcut).toHaveProperty('tags');
      expect(firstShortcut).toHaveProperty('frequency');
    });
  });

  describe('getShortcutsByCategory', () => {
    it('should return shortcuts for a valid category', () => {
      const generalShortcuts = getShortcutsByCategory('general');
      expect(Array.isArray(generalShortcuts)).toBe(true);
      expect(generalShortcuts.length).toBeGreaterThan(0);
      expect(generalShortcuts.every(s => s.category === 'general')).toBe(true);
    });

    it('should return empty array for invalid category', () => {
      const shortcuts = getShortcutsByCategory('non-existent');
      expect(shortcuts).toEqual([]);
    });
  });

  describe('getShortcutById', () => {
    it('should return a shortcut for valid id', () => {
      const shortcut = getShortcutById('general-copy');
      expect(shortcut).toBeDefined();
      expect(shortcut?.id).toBe('general-copy');
      expect(shortcut?.name).toBe('Copy');
    });

    it('should return undefined for invalid id', () => {
      const shortcut = getShortcutById('non-existent');
      expect(shortcut).toBeUndefined();
    });
  });

  describe('getAllCategories', () => {
    it('should return an array of categories', () => {
      const categories = getAllCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should return valid category objects', () => {
      const categories = getAllCategories();
      const firstCategory = categories[0];
      expect(firstCategory).toHaveProperty('id');
      expect(firstCategory).toHaveProperty('name');
      expect(firstCategory).toHaveProperty('icon');
      expect(firstCategory).toHaveProperty('description');
      expect(firstCategory).toHaveProperty('shortcutIds');
      expect(firstCategory).toHaveProperty('order');
    });
  });

  describe('getCategoryById', () => {
    it('should return a category for valid id', () => {
      const category = getCategoryById('general');
      expect(category).toBeDefined();
      expect(category?.id).toBe('general');
      expect(category?.name).toBe('General');
    });

    it('should return undefined for invalid id', () => {
      const category = getCategoryById('non-existent');
      expect(category).toBeUndefined();
    });
  });

  describe('searchShortcuts', () => {
    it('should find shortcuts by name', () => {
      const results = searchShortcuts('copy');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(s => s.name.toLowerCase().includes('copy'))).toBe(true);
    });

    it('should find shortcuts by description', () => {
      const results = searchShortcuts('clipboard');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(s => s.description.toLowerCase().includes('clipboard'))).toBe(true);
    });

    it('should find shortcuts by tag', () => {
      const results = searchShortcuts('essential');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(s => s.tags.includes('essential'))).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = searchShortcuts('xyznonexistent');
      expect(results).toEqual([]);
    });
  });

  describe('filterByDifficulty', () => {
    it('should filter shortcuts by beginner difficulty', () => {
      const beginnerShortcuts = filterByDifficulty('beginner');
      expect(beginnerShortcuts.length).toBeGreaterThan(0);
      expect(beginnerShortcuts.every(s => s.difficulty === 'beginner')).toBe(true);
    });

    it('should filter shortcuts by intermediate difficulty', () => {
      const intermediateShortcuts = filterByDifficulty('intermediate');
      expect(intermediateShortcuts.length).toBeGreaterThan(0);
      expect(intermediateShortcuts.every(s => s.difficulty === 'intermediate')).toBe(true);
    });

    it('should filter shortcuts by advanced difficulty', () => {
      const advancedShortcuts = filterByDifficulty('advanced');
      expect(advancedShortcuts.length).toBeGreaterThan(0);
      expect(advancedShortcuts.every(s => s.difficulty === 'advanced')).toBe(true);
    });
  });

  describe('filterByFrequency', () => {
    it('should filter shortcuts by common frequency', () => {
      const commonShortcuts = filterByFrequency('common');
      expect(commonShortcuts.length).toBeGreaterThan(0);
      expect(commonShortcuts.every(s => s.frequency === 'common')).toBe(true);
    });

    it('should filter shortcuts by occasional frequency', () => {
      const occasionalShortcuts = filterByFrequency('occasional');
      expect(occasionalShortcuts.length).toBeGreaterThan(0);
      expect(occasionalShortcuts.every(s => s.frequency === 'occasional')).toBe(true);
    });

    it('should filter shortcuts by rare frequency', () => {
      const rareShortcuts = filterByFrequency('rare');
      expect(rareShortcuts.length).toBeGreaterThan(0);
      expect(rareShortcuts.every(s => s.frequency === 'rare')).toBe(true);
    });
  });

  describe('getRandomShortcuts', () => {
    it('should return requested number of shortcuts', () => {
      const randomShortcuts = getRandomShortcuts(5);
      expect(randomShortcuts.length).toBe(5);
    });

    it('should return different shortcuts on multiple calls', () => {
      const first = getRandomShortcuts(5);
      const second = getRandomShortcuts(5);
      const firstIds = first.map(s => s.id).sort();
      const secondIds = second.map(s => s.id).sort();
      expect(firstIds.join()).not.toBe(secondIds.join());
    });

    it('should filter by category when specified', () => {
      const randomFinder = getRandomShortcuts(3, 'finder');
      expect(randomFinder.every(s => s.category === 'finder')).toBe(true);
    });

    it('should handle count larger than available shortcuts', () => {
      const allShortcuts = getAllShortcuts();
      const tooMany = getRandomShortcuts(1000);
      expect(tooMany.length).toBe(allShortcuts.length);
    });
  });

  describe('validateShortcut', () => {
    it('should validate a correct shortcut', () => {
      const validShortcut = {
        id: 'test',
        category: 'general',
        name: 'Test',
        description: 'Test description',
        keys: {
          modifiers: ['cmd'],
          key: 'T',
          displayFormat: '⌘T'
        },
        difficulty: 'beginner',
        tags: ['test'],
        frequency: 'common'
      };
      expect(validateShortcut(validShortcut)).toBe(true);
    });

    it('should reject invalid shortcut', () => {
      expect(validateShortcut(mockInvalidShortcut)).toBe(false);
    });

    it('should reject shortcut with invalid difficulty', () => {
      const invalidDifficulty = {
        ...mockShortcut,
        difficulty: 'expert'
      };
      expect(validateShortcut(invalidDifficulty)).toBe(false);
    });

    it('should reject shortcut with invalid frequency', () => {
      const invalidFrequency = {
        ...mockShortcut,
        frequency: 'always'
      };
      expect(validateShortcut(invalidFrequency)).toBe(false);
    });
  });

  describe('validateCategory', () => {
    it('should validate a correct category', () => {
      const validCategory = {
        id: 'test',
        name: 'Test Category',
        icon: 'TestIcon',
        description: 'Test category description',
        shortcutIds: ['shortcut1', 'shortcut2'],
        order: 1
      };
      expect(validateCategory(validCategory)).toBe(true);
    });

    it('should reject invalid category', () => {
      const invalidCategory = {
        id: 'test',
        name: 'Test',
        // Missing required fields
      };
      expect(validateCategory(invalidCategory)).toBe(false);
    });

    it('should reject category with invalid shortcutIds', () => {
      const invalidCategory = {
        id: 'test',
        name: 'Test Category',
        icon: 'TestIcon',
        description: 'Test description',
        shortcutIds: 'not-an-array',
        order: 1
      };
      expect(validateCategory(invalidCategory)).toBe(false);
    });
  });

  describe('formatKeyCombination', () => {
    it('should format single modifier correctly', () => {
      const keys = {
        modifiers: ['cmd'] as any,
        key: 'C',
        displayFormat: '⌘C'
      };
      expect(formatKeyCombination(keys)).toBe('⌘C');
    });

    it('should format multiple modifiers correctly', () => {
      const keys = {
        modifiers: ['cmd', 'shift'] as any,
        key: 'a',
        displayFormat: '⌘⇧A'
      };
      expect(formatKeyCombination(keys)).toBe('⌘⇧A');
    });

    it('should format all modifiers correctly', () => {
      const keys = {
        modifiers: ['cmd', 'option', 'ctrl', 'shift'] as any,
        key: 'x',
        displayFormat: '⌘⌥⌃⇧X'
      };
      expect(formatKeyCombination(keys)).toBe('⌘⌥⌃⇧X');
    });

    it('should uppercase the key', () => {
      const keys = {
        modifiers: ['cmd'] as any,
        key: 'z',
        displayFormat: '⌘Z'
      };
      expect(formatKeyCombination(keys)).toBe('⌘Z');
    });
  });

  describe('getShortcutsGroupedByCategory', () => {
    it('should return shortcuts grouped by category', () => {
      const grouped = getShortcutsGroupedByCategory();
      expect(typeof grouped).toBe('object');
      expect(grouped.general).toBeDefined();
      expect(Array.isArray(grouped.general)).toBe(true);
      expect(grouped.general.every(s => s.category === 'general')).toBe(true);
    });

    it('should include all categories', () => {
      const grouped = getShortcutsGroupedByCategory();
      const categories = getAllCategories();
      categories.forEach(cat => {
        expect(grouped[cat.id]).toBeDefined();
        expect(Array.isArray(grouped[cat.id])).toBe(true);
      });
    });
  });

  describe('getCategoryWithShortcuts', () => {
    it('should return category with its shortcuts', () => {
      const result = getCategoryWithShortcuts('general');
      expect(result).toBeDefined();
      expect(result?.category.id).toBe('general');
      expect(Array.isArray(result?.shortcuts)).toBe(true);
      expect(result?.shortcuts.every(s => s.category === 'general')).toBe(true);
    });

    it('should return undefined for invalid category', () => {
      const result = getCategoryWithShortcuts('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getShortcutsByTag', () => {
    it('should return shortcuts with specific tag', () => {
      const results = getShortcutsByTag('essential');
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(s => s.tags.includes('essential'))).toBe(true);
    });

    it('should be case insensitive', () => {
      const lower = getShortcutsByTag('essential');
      const upper = getShortcutsByTag('ESSENTIAL');
      expect(lower.length).toBe(upper.length);
    });

    it('should return empty array for non-existent tag', () => {
      const results = getShortcutsByTag('nonexistenttag');
      expect(results).toEqual([]);
    });
  });

  describe('getAllTags', () => {
    it('should return array of unique tags', () => {
      const tags = getAllTags();
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeGreaterThan(0);
      const uniqueTags = [...new Set(tags)];
      expect(tags.length).toBe(uniqueTags.length);
    });

    it('should return sorted tags', () => {
      const tags = getAllTags();
      const sorted = [...tags].sort();
      expect(tags).toEqual(sorted);
    });
  });

  describe('getShortcutStatistics', () => {
    it('should return correct statistics', () => {
      const stats = getShortcutStatistics();
      const allShortcuts = getAllShortcuts();
      const allCategories = getAllCategories();
      
      expect(stats.totalShortcuts).toBe(allShortcuts.length);
      expect(stats.totalCategories).toBe(allCategories.length);
    });

    it('should calculate difficulty distribution correctly', () => {
      const stats = getShortcutStatistics();
      const allShortcuts = getAllShortcuts();
      
      const beginnerCount = allShortcuts.filter(s => s.difficulty === 'beginner').length;
      const intermediateCount = allShortcuts.filter(s => s.difficulty === 'intermediate').length;
      const advancedCount = allShortcuts.filter(s => s.difficulty === 'advanced').length;
      
      expect(stats.byDifficulty.beginner).toBe(beginnerCount);
      expect(stats.byDifficulty.intermediate).toBe(intermediateCount);
      expect(stats.byDifficulty.advanced).toBe(advancedCount);
    });

    it('should calculate frequency distribution correctly', () => {
      const stats = getShortcutStatistics();
      const allShortcuts = getAllShortcuts();
      
      const commonCount = allShortcuts.filter(s => s.frequency === 'common').length;
      const occasionalCount = allShortcuts.filter(s => s.frequency === 'occasional').length;
      const rareCount = allShortcuts.filter(s => s.frequency === 'rare').length;
      
      expect(stats.byFrequency.common).toBe(commonCount);
      expect(stats.byFrequency.occasional).toBe(occasionalCount);
      expect(stats.byFrequency.rare).toBe(rareCount);
    });

    it('should calculate category distribution correctly', () => {
      const stats = getShortcutStatistics();
      const categories = getAllCategories();
      
      categories.forEach(cat => {
        const catShortcuts = getShortcutsByCategory(cat.id);
        expect(stats.byCategory[cat.id]).toBe(catShortcuts.length);
      });
    });
  });
});