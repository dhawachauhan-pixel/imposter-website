/**
 * Word Engine Data Structures & Interfaces
 */

export type WordDifficulty = 'easy' | 'medium' | 'hard';

export interface WordItem {
  id: string;
  word: string;
  category: string;
  difficulty: WordDifficulty;
  language: string;
  clueability: number; // 1-10 rating of how fun/clueable it is
  popularity: number; // 1-10 rating of universal recognizability
  hint?: string;
  relatedWords?: string[];
}

export interface CategoryMeta {
  id: string;
  nameKey: string;
  icon: string;
  descriptionKey: string;
  wordCount: number;
}

export interface WordPair {
  id: string;
  wordA: string;
  wordB: string;
  category: string;
  difficulty: WordDifficulty;
  language: string;
  context: string;
}

