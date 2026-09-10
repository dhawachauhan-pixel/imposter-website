/**
 * Pure Game Logic and Calculation Utilities for Classic, Mr. White, and Undercover Modes
 * Deterministic, easily testable, free of side-effects
 */

import type { Player, CategoryId, GameMode, ResultsState, GameSettingsConfig } from '../types/gameState';
import { wordEngine } from '../words/wordEngine';

/**
 * Validates whether the requested imposter count is permitted for given player count.
 * Minimum players: 3.
 * Imposter count must be at least 1 and at most floor(playerCount / 2).
 */
export function isValidImposterCount(playerCount: number, impostersCount: number): boolean {
  if (playerCount < 3) return false;
  const maxAllowed = Math.max(1, Math.floor(playerCount / 2));
  return impostersCount >= 1 && impostersCount <= maxAllowed;
}

/**
 * Validates whether the requested undercover count is permitted for given player count.
 * Minimum players: 4.
 * Undercover count must be at least 1 and at most floor(playerCount / 2).
 */
export function isValidUndercoverCount(playerCount: number, undercoverCount: number): boolean {
  if (playerCount < 3) return false;
  const maxAllowed = Math.max(1, Math.floor(playerCount / 2));
  return undercoverCount >= 1 && undercoverCount <= maxAllowed;
}

/**
 * Randomly shuffles an array using Fisher-Yates shuffle.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface AssignRolesResult {
  players: Player[];
  selectedWord: string;
  selectedWordPair?: { wordA: string; wordB: string };
}

/**
 * Assigns secret roles and words according to selected game mode.
 */
export function assignRoles(
  players: Player[],
  impostersOrSettings: number | GameSettingsConfig,
  categoryParam?: CategoryId
): AssignRolesResult {
  let mode: GameMode = 'classic';
  let category: CategoryId = 'random';
  let impostersCount = 1;
  let undercoverCount = 1;

  if (typeof impostersOrSettings === 'object') {
    mode = impostersOrSettings.mode || 'classic';
    category = impostersOrSettings.category || 'random';
    impostersCount = impostersOrSettings.impostersCount || 1;
    undercoverCount = impostersOrSettings.undercoverCount || 1;
  } else {
    impostersCount = impostersOrSettings;
    category = categoryParam || 'random';
  }

  const indices = players.map((_, i) => i);
  const shuffled = shuffleArray(indices);

  // 1. UNDERCOVER MODE
  if (mode === 'undercover') {
    const maxAllowed = Math.max(1, Math.floor(players.length / 2));
    const clampedUndercover = Math.max(1, Math.min(undercoverCount, maxAllowed));

    const wordPair = wordEngine.getRandomWordPair(category);
    const undercoverIndices = new Set(shuffled.slice(0, clampedUndercover));

    const configuredPlayers: Player[] = players.map((player, index) => {
      const isUndercover = undercoverIndices.has(index);
      return {
        ...player,
        role: isUndercover ? ('undercover' as const) : ('innocent' as const),
        secretWord: isUndercover ? wordPair.wordB : wordPair.wordA,
      };
    });

    return {
      players: configuredPlayers,
      selectedWord: wordPair.wordA,
      selectedWordPair: { wordA: wordPair.wordA, wordB: wordPair.wordB },
    };
  }

  // 2. MR. WHITE MODE
  if (mode === 'mr_white') {
    const wordObj = wordEngine.getRandomWord(category);
    const selectedWord = wordObj.word;
    const mrWhiteIndex = shuffled[0];

    const configuredPlayers: Player[] = players.map((player, index) => {
      const isMrWhite = index === mrWhiteIndex;
      return {
        ...player,
        role: isMrWhite ? ('mr_white' as const) : ('innocent' as const),
        secretWord: isMrWhite ? undefined : selectedWord,
      };
    });

    return {
      players: configuredPlayers,
      selectedWord,
    };
  }

  // 3. CLASSIC MODE (Unchanged Classic Behavior)
  const maxAllowed = Math.max(1, Math.floor(players.length / 2));
  const clampedImposters = Math.max(1, Math.min(impostersCount, maxAllowed));

  const wordObj = wordEngine.getRandomWord(category);
  const selectedWord = wordObj.word;

  const imposterIndices = new Set(shuffled.slice(0, clampedImposters));

  const configuredPlayers: Player[] = players.map((player, index) => {
    const isImposter = imposterIndices.has(index);
    return {
      ...player,
      role: isImposter ? ('imposter' as const) : ('innocent' as const),
      secretWord: isImposter ? undefined : selectedWord,
    };
  });

  return {
    players: configuredPlayers,
    selectedWord,
  };
}

/**
 * Calculates results from votes based on the active GameMode.
 */
export function calculateGameResults(
  players: Player[],
  votes: Record<string, string>,
  mode: GameMode = 'classic',
  wordPair?: { wordA: string; wordB: string }
): ResultsState {
  const voteCounts: Record<string, number> = {};
  players.forEach((p) => {
    voteCounts[p.id] = 0;
  });

  Object.values(votes).forEach((suspectId) => {
    if (voteCounts[suspectId] !== undefined) {
      voteCounts[suspectId] += 1;
    } else {
      voteCounts[suspectId] = 1;
    }
  });

  const countsArray = Object.values(voteCounts);
  const maxVotes = countsArray.length > 0 ? Math.max(...countsArray) : 0;

  const mostVotedPlayerIds =
    maxVotes > 0
      ? Object.keys(voteCounts).filter((id) => voteCounts[id] === maxVotes)
      : [];

  const actualImposterIds = players
    .filter((p) => p.role === 'imposter')
    .map((p) => p.id);

  const actualUndercoverIds = players
    .filter((p) => p.role === 'undercover')
    .map((p) => p.id);

  const mrWhitePlayer = players.find((p) => p.role === 'mr_white');
  const mrWhiteId = mrWhitePlayer?.id;

  const isTie = mostVotedPlayerIds.length !== 1;

  let winner: 'group' | 'imposter' | 'mr_white' | 'undercover';

  // --- MR. WHITE MODE ---
  if (mode === 'mr_white') {
    if (isTie) {
      // Voting tie -> IMPOSTER WINS
      winner = 'imposter';
    } else {
      const eliminatedId = mostVotedPlayerIds[0];
      const eliminatedPlayer = players.find((p) => p.id === eliminatedId);

      if (eliminatedPlayer?.role === 'mr_white') {
        // Mr. White is single eliminated player -> Group wins unless guess is correct
        winner = 'group';
      } else if (eliminatedPlayer?.role === 'imposter') {
        // Mr. White survives + Imposter eliminated -> Group wins
        winner = 'group';
      } else {
        // Mr. White survives + Civilian eliminated -> Imposter wins
        winner = 'imposter';
      }
    }

    return {
      winner,
      voteCounts,
      mostVotedPlayerIds,
      isTie,
      actualImposterIds,
      mrWhiteId,
      wordPair,
    };
  }

  // --- UNDERCOVER MODE ---
  if (mode === 'undercover') {
    if (isTie) {
      // Voting tie -> UNDERCOVER WINS
      winner = 'undercover';
    } else {
      const eliminatedId = mostVotedPlayerIds[0];
      const eliminatedPlayer = players.find((p) => p.id === eliminatedId);

      if (eliminatedPlayer?.role === 'undercover') {
        // Undercover player eliminated -> CIVILIANS WIN
        winner = 'group';
      } else {
        // Civilian eliminated -> UNDERCOVER WINS
        winner = 'undercover';
      }
    }

    return {
      winner,
      voteCounts,
      mostVotedPlayerIds,
      isTie,
      actualImposterIds,
      actualUndercoverIds,
      wordPair,
    };
  }

  // --- CLASSIC MODE ---
  if (isTie) {
    winner = 'imposter';
  } else {
    const eliminatedId = mostVotedPlayerIds[0];
    const eliminatedPlayer = players.find((p) => p.id === eliminatedId);

    if (eliminatedPlayer && eliminatedPlayer.role === 'imposter') {
      winner = 'group';
    } else {
      winner = 'imposter';
    }
  }

  return {
    winner,
    voteCounts,
    mostVotedPlayerIds,
    isTie,
    actualImposterIds,
    actualUndercoverIds,
    wordPair,
  };
}

/**
 * Formats seconds into MM:SS display string.
 */
export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(Math.max(0, totalSeconds) / 60);
  const secs = Math.max(0, totalSeconds) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
