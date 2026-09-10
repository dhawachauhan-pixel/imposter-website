/**
 * Safe normalized word matching utility
 * Strict rule: trim whitespace, case-insensitive comparison, and harmless punctuation/spacing normalization.
 * No arbitrary fuzzy matching.
 */

export function normalizeWordForMatching(word: string): string {
  if (!word) return '';
  return word
    .trim()
    .toLowerCase()
    .normalize('NFD') // decomposes accents
    .replace(/[\u0300-\u036f]/g, '') // strip accents (e.g. café -> cafe)
    .replace(/[\s\-_.,'"!?]/g, ''); // strip spaces, hyphens, and common punctuation
}

export function isWordGuessCorrect(guess: string, target: string): boolean {
  if (!guess || !target) return false;
  const normalizedGuess = normalizeWordForMatching(guess);
  const normalizedTarget = normalizeWordForMatching(target);
  if (normalizedGuess.length === 0) return false;
  return normalizedGuess === normalizedTarget;
}
