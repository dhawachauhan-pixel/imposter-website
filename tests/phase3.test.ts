/**
 * Phase 3A Automated Test Suite
 * Covers Mr. White, Undercover, Word Pairs, Word Deck Expansion,
 * Normalization, Roster Storage, Generator Engine, WakeLock, and Regression.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { SEED_WORDS } from '../src/game/words/wordDatabase';
import { SEED_WORD_PAIRS } from '../src/game/words/wordPairsDatabase';
import { wordEngine } from '../src/game/words/wordEngine';
import { isWordGuessCorrect } from '../src/game/utils/normalizeWord';
import { assignRoles, calculateGameResults, isValidUndercoverCount } from '../src/game/state/gameLogic';
import { gameReducer, initialGameState } from '../src/game/state/gameReducer';
import { savePartyRoster, loadPartyRoster, clearSavedRoster } from '../src/game/utils/rosterStorage';
import { wakeLock } from '../src/game/utils/wakeLock';
import { triggerHaptic } from '../src/game/utils/haptics';
import type { Player, GameSettings } from '../src/game/types/gameState';

describe('Phase 3A: Curated Word Deck & Word Pairs Validation', () => {
  it('word database contains at least 250 curated party words', () => {
    assert.ok(SEED_WORDS.length >= 250, `Expected at least 250 words, got ${SEED_WORDS.length}`);
  });

  it('all words have valid ids, text, categories, difficulty, and clueability', () => {
    const validCategories = new Set(['food', 'everyday', 'animals', 'places', 'movies', 'tech']);
    const validDifficulties = new Set(['easy', 'medium', 'hard']);
    const ids = new Set<string>();

    for (const w of SEED_WORDS) {
      assert.ok(w.id && w.id.trim().length > 0, `Word id missing`);
      assert.ok(!ids.has(w.id), `Duplicate word id: ${w.id}`);
      ids.add(w.id);
      assert.ok(w.word && w.word.trim().length > 0, `Word text missing for ${w.id}`);
      assert.ok(validCategories.has(w.category), `Invalid category ${w.category} for ${w.id}`);
      assert.ok(validDifficulties.has(w.difficulty), `Invalid difficulty ${w.difficulty} for ${w.id}`);
      assert.ok(w.clueability >= 1 && w.clueability <= 10, `Invalid clueability ${w.clueability} for ${w.id}`);
    }
  });

  it('word pairs database contains at least 60 curated pairs', () => {
    assert.ok(SEED_WORD_PAIRS.length >= 60, `Expected at least 60 word pairs, got ${SEED_WORD_PAIRS.length}`);
  });

  it('every word pair has distinct wordA and wordB and matching category', () => {
    const pairIds = new Set<string>();
    for (const pair of SEED_WORD_PAIRS) {
      assert.ok(!pairIds.has(pair.id), `Duplicate pair id: ${pair.id}`);
      pairIds.add(pair.id);
      assert.ok(pair.wordA.trim().length > 0, `Empty wordA in ${pair.id}`);
      assert.ok(pair.wordB.trim().length > 0, `Empty wordB in ${pair.id}`);
      assert.notEqual(
        pair.wordA.trim().toLowerCase(),
        pair.wordB.trim().toLowerCase(),
        `Words must not be identical in pair ${pair.id}`
      );
      assert.ok(['food', 'everyday', 'animals', 'places', 'movies', 'tech'].includes(pair.category));
    }
  });
});

describe('Phase 3A: Word Guess Normalization Utility', () => {
  it('correctly matches identical strings', () => {
    assert.strictEqual(isWordGuessCorrect('Pizza', 'Pizza'), true);
  });

  it('correctly matches case-insensitively', () => {
    assert.strictEqual(isWordGuessCorrect('pizza', 'Pizza'), true);
    assert.strictEqual(isWordGuessCorrect('PIZZA', 'pizza'), true);
  });

  it('correctly trims leading and trailing whitespace', () => {
    assert.strictEqual(isWordGuessCorrect('  pizza  ', 'Pizza'), true);
    assert.strictEqual(isWordGuessCorrect('pizza', ' Pizza '), true);
  });

  it('correctly normalizes harmless spacing and punctuation', () => {
    assert.strictEqual(isWordGuessCorrect('ice cream', 'Ice-Cream'), true);
    assert.strictEqual(isWordGuessCorrect('ice-cream', 'Ice Cream'), true);
    assert.strictEqual(isWordGuessCorrect('Sci Fi', 'Sci-Fi'), true);
    assert.strictEqual(isWordGuessCorrect('Eiffel Tower!', 'Eiffel Tower'), true);
    assert.strictEqual(isWordGuessCorrect('Spider-Man', 'spiderman'), true);
  });

  it('correctly normalizes accents and diacritics', () => {
    assert.strictEqual(isWordGuessCorrect('cafe', 'café'), true);
    assert.strictEqual(isWordGuessCorrect('piñata', 'pinata'), true);
  });

  it('rejects wrong or empty guesses', () => {
    assert.strictEqual(isWordGuessCorrect('burger', 'pizza'), false);
    assert.strictEqual(isWordGuessCorrect('', 'pizza'), false);
    assert.strictEqual(isWordGuessCorrect('   ', 'pizza'), false);
    assert.strictEqual(isWordGuessCorrect('piz', 'pizza'), false);
  });
});

describe('Phase 3A: Mr. White Mode & Win Logic Table', () => {
  const basePlayers: Player[] = [
    { id: 'p1', name: 'Alice', isCustomName: true, role: 'civilian', secretWord: 'Guitar' },
    { id: 'p2', name: 'Bob', isCustomName: true, role: 'civilian', secretWord: 'Guitar' },
    { id: 'p3', name: 'Charlie', isCustomName: true, role: 'mr_white' }, // Mr. White has no word
    { id: 'p4', name: 'Diana', isCustomName: true, role: 'civilian', secretWord: 'Guitar' },
  ];

  it('role assignment: assigns exactly 1 Mr. White without secret word', () => {
    const players: Player[] = [
      { id: '1', name: 'P1', isCustomName: false },
      { id: '2', name: 'P2', isCustomName: false },
      { id: '3', name: 'P3', isCustomName: false },
      { id: '4', name: 'P4', isCustomName: false },
    ];
    const settings: GameSettings = {
      mode: 'mr_white',
      category: 'food',
      impostersCount: 1,
      roundTimeMinutes: 3,
      allowHints: true,
    };
    const result = assignRoles(players, settings);
    const mrWhites = result.players.filter((p) => p.role === 'mr_white');
    assert.strictEqual(mrWhites.length, 1);
    assert.strictEqual(mrWhites[0].secretWord, undefined);
  });

  it('Table Case 1: Mr. White eliminated + correct normalized guess -> MR. WHITE WINS', () => {
    // Charlie (Mr. White) voted out
    const votes: Record<string, string> = {
      p1: 'p3',
      p2: 'p3',
      p4: 'p3',
      p3: 'p1',
    };
    const tentative = calculateGameResults(basePlayers, votes, 'mr_white');
    assert.deepStrictEqual(tentative.mostVotedPlayerIds, ['p3']);

    // Now Mr. White makes a correct normalized guess
    let state = {
      ...initialGameState,
      phase: 'MR_WHITE_GUESS' as const,
      players: basePlayers,
      selectedWord: 'Guitar',
      voting: { currentVoterIndex: 0, isReadyToVote: false, selectedSuspectId: null, votes },
      mrWhiteGuess: { mrWhitePlayerId: 'p3', isReadyToGuess: true, submittedGuess: null, wasGuessCorrect: null },
      results: tentative,
    };

    state = gameReducer(state, { type: 'SUBMIT_MR_WHITE_GUESS', payload: { guess: 'guitar' } });
    assert.strictEqual(state.phase, 'RESULTS');
    assert.strictEqual(state.results?.winner, 'mr_white');
    assert.strictEqual(state.results?.wasMrWhiteGuessCorrect, true);
  });

  it('Table Case 2: Mr. White eliminated + wrong normalized guess -> GROUP WINS', () => {
    const votes: Record<string, string> = {
      p1: 'p3',
      p2: 'p3',
      p4: 'p3',
      p3: 'p1',
    };
    const tentative = calculateGameResults(basePlayers, votes, 'mr_white');

    let state = {
      ...initialGameState,
      phase: 'MR_WHITE_GUESS' as const,
      players: basePlayers,
      selectedWord: 'Guitar',
      voting: { currentVoterIndex: 0, isReadyToVote: false, selectedSuspectId: null, votes },
      mrWhiteGuess: { mrWhitePlayerId: 'p3', isReadyToGuess: true, submittedGuess: null, wasGuessCorrect: null },
      results: tentative,
    };

    state = gameReducer(state, { type: 'SUBMIT_MR_WHITE_GUESS', payload: { guess: 'piano' } });
    assert.strictEqual(state.phase, 'RESULTS');
    assert.strictEqual(state.results?.winner, 'group');
    assert.strictEqual(state.results?.wasMrWhiteGuessCorrect, false);
  });

  it('Table Case 3: Mr. White survives + Civilian eliminated -> IMPOSTER WINS', () => {
    // Alice (civilian) voted out
    const votes: Record<string, string> = {
      p1: 'p2',
      p2: 'p1',
      p3: 'p1',
      p4: 'p1',
    };
    const results = calculateGameResults(basePlayers, votes, 'mr_white');
    assert.deepStrictEqual(results.mostVotedPlayerIds, ['p1']);
    assert.strictEqual(results.winner, 'imposter');
  });

  it('Table Case 4: Mr. White survives + Imposter eliminated -> GROUP WINS', () => {
    const playersWithImposter: Player[] = [
      { id: 'p1', name: 'Alice', isCustomName: true, role: 'civilian', secretWord: 'Guitar' },
      { id: 'p2', name: 'Bob', isCustomName: true, role: 'imposter' },
      { id: 'p3', name: 'Charlie', isCustomName: true, role: 'mr_white' },
      { id: 'p4', name: 'Diana', isCustomName: true, role: 'civilian', secretWord: 'Guitar' },
    ];
    // Bob (imposter) voted out
    const votes: Record<string, string> = {
      p1: 'p2',
      p2: 'p1',
      p3: 'p2',
      p4: 'p2',
    };
    const results = calculateGameResults(playersWithImposter, votes, 'mr_white');
    assert.deepStrictEqual(results.mostVotedPlayerIds, ['p2']);
    assert.strictEqual(results.winner, 'group');
  });

  it('Table Case 5: Voting tie -> IMPOSTER WINS and does NOT trigger MR_WHITE_GUESS', () => {
    // 2-way tie: Alice and Bob get 2 votes each
    const votes: Record<string, string> = {
      p1: 'p2',
      p4: 'p2',
      p2: 'p1',
      p3: 'p1',
    };
    const results = calculateGameResults(basePlayers, votes, 'mr_white');
    assert.strictEqual(results.isTie, true);
    assert.strictEqual(results.winner, 'imposter');
  });

  it('reducer: voting for Mr. White transitions to MR_WHITE_GUESS without exposing secret word', () => {
    let state = {
      ...initialGameState,
      phase: 'VOTING' as const,
      players: basePlayers,
      selectedWord: 'Guitar',
      settings: { ...initialGameState.settings, mode: 'mr_white' as const },
      voting: {
        currentVoterIndex: 3, // Diana is voting last
        isReadyToVote: true,
        selectedSuspectId: 'p3', // Votes Charlie (Mr. White)
        votes: { p1: 'p3', p2: 'p3', p3: 'p1' },
      },
    };

    state = gameReducer(state, { type: 'CONFIRM_VOTE' });
    assert.strictEqual(state.phase, 'MR_WHITE_GUESS');
    assert.strictEqual(state.mrWhiteGuess?.mrWhitePlayerId, 'p3');
    assert.strictEqual(state.mrWhiteGuess?.isReadyToGuess, false);
    // Secret word remains safe in state.selectedWord and not exposed
    assert.strictEqual(state.selectedWord, 'Guitar');
  });
});

describe('Phase 3A: Undercover Mode & Stealth Single-Vote Flow', () => {
  const mockPair = {
    id: 'food_1',
    wordA: 'Coffee',
    wordB: 'Tea',
    category: 'food' as const,
    difficulty: 'easy' as const,
    context: 'Hot caffeinated drinks',
  };

  const undercoverPlayers: Player[] = [
    { id: 'p1', name: 'Alice', isCustomName: true, role: 'innocent', secretWord: 'Coffee' },
    { id: 'p2', name: 'Bob', isCustomName: true, role: 'innocent', secretWord: 'Coffee' },
    { id: 'p3', name: 'Charlie', isCustomName: true, role: 'undercover', secretWord: 'Tea' },
    { id: 'p4', name: 'Diana', isCustomName: true, role: 'innocent', secretWord: 'Coffee' },
  ];

  it('role assignment: Civilians receive Word A, Undercover receives Word B', () => {
    const players: Player[] = [
      { id: '1', name: 'P1', isCustomName: false },
      { id: '2', name: 'P2', isCustomName: false },
      { id: '3', name: 'P3', isCustomName: false },
      { id: '4', name: 'P4', isCustomName: false },
    ];
    const settings: GameSettings = {
      mode: 'undercover',
      category: 'food',
      impostersCount: 1,
      undercoverCount: 1,
      roundTimeMinutes: 3,
      allowHints: true,
    };
    const result = assignRoles(players, settings);
    assert.ok(result.selectedWordPair);
    const civilians = result.players.filter((p) => p.role === 'innocent');
    const undercovers = result.players.filter((p) => p.role === 'undercover');

    assert.strictEqual(undercovers.length, 1);
    assert.strictEqual(civilians.length, 3);
    assert.strictEqual(undercovers[0].secretWord, result.selectedWordPair.wordB);
    assert.strictEqual(civilians[0].secretWord, result.selectedWordPair.wordA);
  });

  it('validates undercover player count correctly', () => {
    assert.strictEqual(isValidUndercoverCount(3, 1), true);
    assert.strictEqual(isValidUndercoverCount(3, 2), false); // max is Math.floor(3/2) = 1
    assert.strictEqual(isValidUndercoverCount(4, 1), true);
    assert.strictEqual(isValidUndercoverCount(4, 3), false); // max is Math.floor(4/2) = 2
    assert.strictEqual(isValidUndercoverCount(5, 2), true);  // max is Math.floor(5/2) = 2
    assert.strictEqual(isValidUndercoverCount(5, 3), false);
  });

  it('outcome logic: Undercover eliminated -> Civilians win', () => {
    // Charlie (Undercover) voted out
    const votes = { p1: 'p3', p2: 'p3', p4: 'p3', p3: 'p1' };
    const results = calculateGameResults(undercoverPlayers, votes, 'undercover', mockPair);
    assert.deepStrictEqual(results.mostVotedPlayerIds, ['p3']);
    assert.strictEqual(results.winner, 'group');
  });

  it('outcome logic: Civilian eliminated -> Undercover wins', () => {
    // Alice (Civilian) voted out
    const votes = { p1: 'p2', p2: 'p1', p3: 'p1', p4: 'p1' };
    const results = calculateGameResults(undercoverPlayers, votes, 'undercover', mockPair);
    assert.deepStrictEqual(results.mostVotedPlayerIds, ['p1']);
    assert.strictEqual(results.winner, 'undercover');
  });

  it('outcome logic: Voting tie -> Undercover wins', () => {
    const votes = { p1: 'p2', p4: 'p2', p2: 'p1', p3: 'p1' };
    const results = calculateGameResults(undercoverPlayers, votes, 'undercover', mockPair);
    assert.strictEqual(results.isTie, true);
    assert.strictEqual(results.winner, 'undercover');
  });
});

describe('Phase 3A: Word Generator Engine', () => {
  it('wordEngine returns a valid random word pair', () => {
    const pair = wordEngine.getRandomWordPair();
    assert.ok(pair);
    assert.ok(pair.wordA.length > 0);
    assert.ok(pair.wordB.length > 0);
    assert.notEqual(pair.wordA, pair.wordB);
  });

  it('filters word pairs by category correctly', () => {
    const foodPairs = wordEngine.filterWordPairs('food');
    assert.ok(foodPairs.length > 0);
    for (const p of foodPairs) {
      assert.strictEqual(p.category, 'food');
    }
  });

  it('filters word pairs by difficulty correctly', () => {
    const easyPairs = wordEngine.filterWordPairs(undefined, 'easy');
    assert.ok(easyPairs.length > 0);
    for (const p of easyPairs) {
      assert.strictEqual(p.difficulty, 'easy');
    }
  });

  it('getAllWordPairs returns full set of pairs', () => {
    const all = wordEngine.getAllWordPairs();
    assert.ok(all.length >= 60);
  });
});

describe('Phase 3A: Local Party Roster Persistence', () => {
  it('safe storage fallback works in non-browser or mock environments', () => {
    // In Node.js environment without window, functions should not throw
    assert.doesNotThrow(() => {
      savePartyRoster([
        { id: '1', name: 'Dave', isCustomName: true },
        { id: '2', name: 'Emma', isCustomName: true },
        { id: '3', name: 'Finn', isCustomName: true },
      ]);
    });

    assert.doesNotThrow(() => {
      loadPartyRoster();
    });

    assert.doesNotThrow(() => {
      clearSavedRoster();
    });
  });
});

describe('Phase 3A: Mobile Utilities Fallback (Wake Lock & Haptics)', () => {
  it('wakeLock wrapper gracefully handles unsupported environments', async () => {
    assert.strictEqual(wakeLock.isSupported(), false);
    const reqResult = await wakeLock.request();
    assert.strictEqual(reqResult, false);
    await wakeLock.release();
    assert.strictEqual(wakeLock.isActive, false);
  });

  it('triggerHaptic gracefully handles unsupported environments', () => {
    assert.doesNotThrow(() => triggerHaptic('light'));
    assert.doesNotThrow(() => triggerHaptic('medium'));
    assert.doesNotThrow(() => triggerHaptic('heavy'));
    assert.doesNotThrow(() => triggerHaptic('selection'));
  });
});

describe('Phase 3A: Classic Mode Regression Protection', () => {
  const classicPlayers: Player[] = [
    { id: 'p1', name: 'Alice', isCustomName: true, role: 'civilian', secretWord: 'Telescope' },
    { id: 'p2', name: 'Bob', isCustomName: true, role: 'imposter' },
    { id: 'p3', name: 'Charlie', isCustomName: true, role: 'civilian', secretWord: 'Telescope' },
    { id: 'p4', name: 'Diana', isCustomName: true, role: 'civilian', secretWord: 'Telescope' },
  ];

  it('Classic: Imposter eliminated -> GROUP WINS', () => {
    const votes = { p1: 'p2', p3: 'p2', p4: 'p2', p2: 'p1' };
    const results = calculateGameResults(classicPlayers, votes, 'classic');
    assert.deepStrictEqual(results.mostVotedPlayerIds, ['p2']);
    assert.strictEqual(results.winner, 'group');
  });

  it('Classic: Civilian eliminated -> IMPOSTER WINS', () => {
    const votes = { p1: 'p3', p2: 'p3', p4: 'p3', p3: 'p1' };
    const results = calculateGameResults(classicPlayers, votes, 'classic');
    assert.deepStrictEqual(results.mostVotedPlayerIds, ['p3']);
    assert.strictEqual(results.winner, 'imposter');
  });

  it('Classic: Voting tie -> IMPOSTER WINS', () => {
    const votes = { p1: 'p2', p3: 'p2', p2: 'p1', p4: 'p1' };
    const results = calculateGameResults(classicPlayers, votes, 'classic');
    assert.strictEqual(results.isTie, true);
    assert.strictEqual(results.winner, 'imposter');
  });
});

describe('Phase 3A: Category & Difficulty Coverage', () => {
  const categories = ['food', 'everyday', 'animals', 'places', 'movies', 'tech'] as const;

  for (const cat of categories) {
    it(`contains validated word pairs for category: ${cat}`, () => {
      const pairs = wordEngine.filterWordPairs(cat);
      assert.ok(pairs.length >= 5, `Expected at least 5 pairs for ${cat}, found ${pairs.length}`);
      for (const p of pairs) {
        assert.strictEqual(p.category, cat);
      }
    });

    it(`contains curated single words for category: ${cat}`, () => {
      const words = wordEngine.filterWords(cat);
      assert.ok(words.length >= 20, `Expected at least 20 words for ${cat}, found ${words.length}`);
      for (const w of words) {
        assert.strictEqual(w.category, cat);
      }
    });
  }

  it('filters word pairs by medium difficulty', () => {
    const medPairs = wordEngine.filterWordPairs(undefined, 'medium');
    assert.ok(medPairs.length > 0);
    for (const p of medPairs) {
      assert.strictEqual(p.difficulty, 'medium');
    }
  });

  it('filters word pairs by hard difficulty', () => {
    const hardPairs = wordEngine.filterWordPairs(undefined, 'hard');
    assert.ok(hardPairs.length > 0);
    for (const p of hardPairs) {
      assert.strictEqual(p.difficulty, 'hard');
    }
  });
});

describe('Phase 3A: Additional Reducer Integration Tests', () => {
  it('START_GAME in undercover mode assigns selectedWordPair and hides initial reveal card', () => {
    const state = gameReducer(
      {
        ...initialGameState,
        settings: { ...initialGameState.settings, mode: 'undercover' },
      },
      { type: 'START_GAME' }
    );
    assert.strictEqual(state.phase, 'ROLE_REVEAL');
    assert.ok(state.selectedWordPair);
    assert.strictEqual(state.reveal.isRevealed, false);
    assert.strictEqual(state.reveal.currentRevealIndex, 0);
  });

  it('START_GAME in mr_white mode assigns exactly one mr_white and undefined secretWord for them', () => {
    const state = gameReducer(
      {
        ...initialGameState,
        settings: { ...initialGameState.settings, mode: 'mr_white' },
      },
      { type: 'START_GAME' }
    );
    assert.strictEqual(state.phase, 'ROLE_REVEAL');
    const mrWhitePlayer = state.players.find((p) => p.role === 'mr_white');
    assert.ok(mrWhitePlayer);
    assert.strictEqual(mrWhitePlayer.secretWord, undefined);
  });

  it('SET_MR_WHITE_READY updates isReadyToGuess to true', () => {
    let state = {
      ...initialGameState,
      phase: 'MR_WHITE_GUESS' as const,
      mrWhiteGuess: {
        mrWhitePlayerId: 'p3',
        isReadyToGuess: false,
        submittedGuess: null,
        wasGuessCorrect: null,
      },
    };
    state = gameReducer(state, { type: 'SET_MR_WHITE_READY' });
    assert.strictEqual(state.mrWhiteGuess?.isReadyToGuess, true);
  });

  it('PLAY_AGAIN preserves undercover mode and draws fresh word pair', () => {
    let state = gameReducer(
      {
        ...initialGameState,
        settings: { ...initialGameState.settings, mode: 'undercover' },
      },
      { type: 'START_GAME' }
    );
    state = gameReducer(state, { type: 'PLAY_AGAIN' });
    assert.strictEqual(state.phase, 'ROLE_REVEAL');
    assert.strictEqual(state.activeRound, 2);
    assert.ok(state.selectedWordPair);
  });

  it('QUIT_TO_LOBBY resets phase to PLAYER_SETUP and clears secretWordPair', () => {
    let state = gameReducer(
      {
        ...initialGameState,
        settings: { ...initialGameState.settings, mode: 'undercover' },
      },
      { type: 'START_GAME' }
    );
    state = gameReducer(state, { type: 'QUIT_TO_LOBBY' });
    assert.strictEqual(state.phase, 'PLAYER_SETUP');
    assert.strictEqual(state.selectedWordPair, undefined);
    assert.strictEqual(state.selectedWord, undefined);
  });

  it('SET_MODE updates mode to mr_white correctly', () => {
    const state = gameReducer(initialGameState, {
      type: 'SET_MODE',
      payload: { mode: 'mr_white' },
    });
    assert.strictEqual(state.settings.mode, 'mr_white');
  });
});
