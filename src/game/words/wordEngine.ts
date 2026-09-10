/**
 * Word Engine Service
 * Provides word generation, word pairs, category filtering, and duplicate prevention
 */

import type { WordItem, WordPair, WordDifficulty } from '../types/word';
import { SEED_WORDS } from './wordDatabase';
import { SEED_WORD_PAIRS } from './wordPairsDatabase';

class WordEngineService {
  private words: WordItem[] = [...SEED_WORDS];
  private wordPairs: WordPair[] = [...SEED_WORD_PAIRS];
  private recentlyUsedIds: Set<string> = new Set();
  private recentlyUsedPairIds: Set<string> = new Set();
  private maxHistorySize = 25;

  /**
   * Retrieves all available categories
   */
  getCategories(): string[] {
    const categories = new Set(this.words.map((w) => w.category));
    return Array.from(categories);
  }

  /**
   * Filters words by category and optional difficulty
   */
  filterWords(category?: string, difficulty?: WordDifficulty): WordItem[] {
    return this.words.filter((item) => {
      if (category && category !== 'random' && item.category !== category) {
        return false;
      }
      if (difficulty && item.difficulty !== difficulty) {
        return false;
      }
      return true;
    });
  }

  /**
   * Selects a random word matching criteria, with duplicate prevention
   */
  getRandomWord(category?: string, difficulty?: WordDifficulty): WordItem {
    let pool = this.filterWords(category, difficulty);

    if (pool.length === 0) {
      pool = this.words; // Fallback to all words if filter is too strict
    }

    // Filter out recently used words to prevent repetition
    const freshPool = pool.filter((w) => !this.recentlyUsedIds.has(w.id));
    const activeSelectionPool = freshPool.length > 0 ? freshPool : pool;

    const randomIndex = Math.floor(Math.random() * activeSelectionPool.length);
    const selected = activeSelectionPool[randomIndex];

    // Track recently used word
    this.recordUsedWord(selected.id);

    return selected;
  }

  /**
   * Filters word pairs by category and optional difficulty
   */
  filterWordPairs(category?: string, difficulty?: WordDifficulty): WordPair[] {
    return this.wordPairs.filter((item) => {
      if (category && category !== 'random' && item.category !== category) {
        return false;
      }
      if (difficulty && item.difficulty !== difficulty) {
        return false;
      }
      return true;
    });
  }

  /**
   * Selects a random validated word pair matching criteria
   */
  getRandomWordPair(category?: string, difficulty?: WordDifficulty): WordPair {
    let pool = this.filterWordPairs(category, difficulty);

    if (pool.length === 0) {
      pool = this.wordPairs; // Fallback to all word pairs
    }

    const freshPool = pool.filter((p) => !this.recentlyUsedPairIds.has(p.id));
    const activePool = freshPool.length > 0 ? freshPool : pool;

    const randomIndex = Math.floor(Math.random() * activePool.length);
    const selected = activePool[randomIndex];

    this.recordUsedPair(selected.id);

    return selected;
  }

  /**
   * Returns all word pairs
   */
  getAllWordPairs(): WordPair[] {
    return this.wordPairs;
  }

  /**
   * Records used word and maintains recent history buffer
   */
  private recordUsedWord(id: string): void {
    this.recentlyUsedIds.add(id);
    if (this.recentlyUsedIds.size > this.maxHistorySize) {
      const firstAdded = this.recentlyUsedIds.values().next().value;
      if (firstAdded) {
        this.recentlyUsedIds.delete(firstAdded);
      }
    }
  }

  /**
   * Records used word pair and maintains recent history buffer
   */
  private recordUsedPair(id: string): void {
    this.recentlyUsedPairIds.add(id);
    if (this.recentlyUsedPairIds.size > this.maxHistorySize) {
      const firstAdded = this.recentlyUsedPairIds.values().next().value;
      if (firstAdded) {
        this.recentlyUsedPairIds.delete(firstAdded);
      }
    }
  }

  /**
   * Clears recently used history
   */
  resetHistory(): void {
    this.recentlyUsedIds.clear();
    this.recentlyUsedPairIds.clear();
  }
}

export const wordEngine = new WordEngineService();
