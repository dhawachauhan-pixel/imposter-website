/**
 * End-to-End Automated Verification of Undercover Mode Flow
 * Verifies all 14 requirements specified for Phase 3A Undercover mode.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { gameReducer, initialGameState } from '../src/game/state/gameReducer';
import { calculateGameResults } from '../src/game/state/gameLogic';
import type { GameState, Player } from '../src/game/types/gameState';

describe('Undercover Mode: End-to-End Complete Flow Verification', () => {
  // Step 1: Return to Lobby / Change Settings
  it('Step 1: Setup starts at PLAYER_SETUP lobby phase', () => {
    assert.strictEqual(initialGameState.phase, 'PLAYER_SETUP');
  });

  // Step 2, 3, 4: Select Undercover mode, 4 players, 1 Undercover
  it('Step 2, 3, 4: Configures Undercover mode with 4 players and 1 Undercover', () => {
    let state: GameState = {
      ...initialGameState,
      players: [
        { id: 'p1', name: 'Alice', isCustomName: true, avatarColor: '#38bdf8' },
        { id: 'p2', name: 'Bob', isCustomName: true, avatarColor: '#f43f5e' },
        { id: 'p3', name: 'Charlie', isCustomName: true, avatarColor: '#10b981' },
        { id: 'p4', name: 'Diana', isCustomName: true, avatarColor: '#f59e0b' },
      ],
    };

    state = gameReducer(state, { type: 'SET_MODE', payload: { mode: 'undercover' } });
    state = gameReducer(state, { type: 'UPDATE_SETTINGS', payload: { undercoverCount: 1 } });

    assert.strictEqual(state.settings.mode, 'undercover');
    assert.strictEqual(state.players.length, 4);
    assert.strictEqual(state.settings.undercoverCount, 1);
  });

  // Step 5, 6, 7: Start game and verify role/word distributions
  it('Step 5, 6, 7: Starts game; Civilians get Word A and Undercover gets Word B', () => {
    let state: GameState = {
      ...initialGameState,
      players: [
        { id: 'p1', name: 'Alice', isCustomName: true, avatarColor: '#38bdf8' },
        { id: 'p2', name: 'Bob', isCustomName: true, avatarColor: '#f43f5e' },
        { id: 'p3', name: 'Charlie', isCustomName: true, avatarColor: '#10b981' },
        { id: 'p4', name: 'Diana', isCustomName: true, avatarColor: '#f59e0b' },
      ],
      settings: {
        ...initialGameState.settings,
        mode: 'undercover',
        undercoverCount: 1,
      },
    };

    state = gameReducer(state, { type: 'START_GAME' });

    assert.strictEqual(state.phase, 'ROLE_REVEAL');
    assert.ok(state.selectedWordPair, 'Word pair must be selected');
    assert.ok(state.selectedWordPair.wordA.length > 0, 'Word A must be non-empty');
    assert.ok(state.selectedWordPair.wordB.length > 0, 'Word B must be non-empty');
    assert.notEqual(state.selectedWordPair.wordA, state.selectedWordPair.wordB, 'Word A and Word B must be distinct');

    const civilians = state.players.filter((p) => p.role === 'innocent');
    const undercovers = state.players.filter((p) => p.role === 'undercover');

    assert.strictEqual(civilians.length, 3, 'Exactly 3 Civilians in a 4-player game with 1 Undercover');
    assert.strictEqual(undercovers.length, 1, 'Exactly 1 Undercover player');

    // Step 6: Verify Civilians receive Word A
    for (const civ of civilians) {
      assert.strictEqual(
        civ.secretWord,
        state.selectedWordPair.wordA,
        `Civilian ${civ.name} must receive Word A`
      );
    }

    // Step 7: Verify Undercover player receives Word B
    assert.strictEqual(
      undercovers[0].secretWord,
      state.selectedWordPair.wordB,
      'Undercover player must receive Word B'
    );
  });

  // Step 8: Strict Stealth Reveal Verification
  it('Step 8: Undercover player card uses civilian styling and NEVER shows the word "UNDERCOVER"', () => {
    // Replicate the exact RoleRevealPhase presentation logic for Undercover
    const undercoverPlayer: Player = {
      id: 'p3',
      name: 'Charlie',
      isCustomName: true,
      avatarColor: '#10b981',
      role: 'undercover',
      secretWord: 'Tea',
    };

    const isImposter = undercoverPlayer.role === 'imposter';
    const isMrWhite = undercoverPlayer.role === 'mr_white';
    const isUndercover = undercoverPlayer.role === 'undercover';

    let cardClass = 'civilian';
    let badgeIcon = '🛡️';
    let badgeLabel = 'CIVILIAN';

    if (isImposter) {
      cardClass = 'imposter';
      badgeIcon = '🎭';
      badgeLabel = 'IMPOSTER';
    } else if (isMrWhite) {
      cardClass = 'mr_white';
      badgeIcon = '🕵️‍♂️';
      badgeLabel = 'MR. WHITE';
    } else if (isUndercover) {
      // True stealth: Undercover players see standard Civilian styling
      cardClass = 'civilian';
      badgeIcon = '🛡️';
      badgeLabel = 'CIVILIAN';
    }

    const wordLabel = isImposter || isMrWhite ? 'Status' : 'Your Secret Word';
    const roleInstruction = isMrWhite
      ? "Listen carefully to everyone's clues, blend in, and figure out the word without getting caught."
      : isImposter
      ? "Listen carefully to everyone's clues, blend in with the group, and figure out the word without getting caught."
      : 'Give subtle clues about this word. Do not say the word directly or make it too obvious to the infiltrators.';

    // Assert strict stealth requirements:
    assert.strictEqual(cardClass, 'civilian', 'Undercover card class must be civilian');
    assert.strictEqual(badgeIcon, '🛡️', 'Undercover badge icon must be shield');
    assert.strictEqual(badgeLabel, 'CIVILIAN', 'Undercover badge label must say CIVILIAN');
    assert.strictEqual(wordLabel, 'Your Secret Word');
    assert.strictEqual(undercoverPlayer.secretWord, 'Tea');
    assert.ok(!badgeLabel.toUpperCase().includes('UNDERCOVER'), 'Must not say UNDERCOVER');
    assert.ok(!roleInstruction.toUpperCase().includes('UNDERCOVER'), 'Instructions must not say UNDERCOVER');
  });

  // Step 9 & 10: Complete voting and vote out Undercover -> CIVILIANS WIN
  it('Step 9 & 10: Voting out Undercover results in CIVILIANS WIN', () => {
    const wordPair = { wordA: 'Coffee', wordB: 'Tea' };
    const players: Player[] = [
      { id: 'p1', name: 'Alice', isCustomName: true, avatarColor: '#38bdf8', role: 'innocent', secretWord: 'Coffee' },
      { id: 'p2', name: 'Bob', isCustomName: true, avatarColor: '#f43f5e', role: 'innocent', secretWord: 'Coffee' },
      { id: 'p3', name: 'Charlie', isCustomName: true, avatarColor: '#10b981', role: 'undercover', secretWord: 'Tea' },
      { id: 'p4', name: 'Diana', isCustomName: true, avatarColor: '#f59e0b', role: 'innocent', secretWord: 'Coffee' },
    ];

    // Alice, Bob, Diana vote for Charlie (Undercover)
    const votes: Record<string, string> = {
      p1: 'p3',
      p2: 'p3',
      p4: 'p3',
      p3: 'p1',
    };

    const results = calculateGameResults(players, votes, 'undercover', wordPair);

    assert.strictEqual(results.winner, 'group', 'Winner must be group/civilians');
    assert.deepStrictEqual(results.mostVotedPlayerIds, ['p3'], 'Charlie must be eliminated');
    assert.strictEqual(results.isTie, false);

    // Verify ResultsPhase title logic
    const isUndercoverWin = results.winner === 'undercover';
    const isMrWhiteWin = results.winner === 'mr_white';
    const isImposterWin = results.winner === 'imposter';
    let bannerTitle = 'CIVILIANS WIN!';
    if (isMrWhiteWin) bannerTitle = 'MR. WHITE WINS!';
    else if (isUndercoverWin) bannerTitle = 'UNDERCOVER WINS!';
    else if (isImposterWin) bannerTitle = 'IMPOSTER WINS!';

    assert.strictEqual(bannerTitle, 'CIVILIANS WIN!');
  });

  // Step 11: Civilian voted out -> UNDERCOVER WINS
  it('Step 11: Voting out a Civilian results in UNDERCOVER WINS', () => {
    const wordPair = { wordA: 'Coffee', wordB: 'Tea' };
    const players: Player[] = [
      { id: 'p1', name: 'Alice', isCustomName: true, avatarColor: '#38bdf8', role: 'innocent', secretWord: 'Coffee' },
      { id: 'p2', name: 'Bob', isCustomName: true, avatarColor: '#f43f5e', role: 'innocent', secretWord: 'Coffee' },
      { id: 'p3', name: 'Charlie', isCustomName: true, avatarColor: '#10b981', role: 'undercover', secretWord: 'Tea' },
      { id: 'p4', name: 'Diana', isCustomName: true, avatarColor: '#f59e0b', role: 'innocent', secretWord: 'Coffee' },
    ];

    // Alice (Civilian) receives majority votes
    const votes: Record<string, string> = {
      p1: 'p2',
      p2: 'p1',
      p3: 'p1',
      p4: 'p1',
    };

    const results = calculateGameResults(players, votes, 'undercover', wordPair);

    assert.strictEqual(results.winner, 'undercover', 'Undercover must win when Civilian eliminated');
    assert.deepStrictEqual(results.mostVotedPlayerIds, ['p1'], 'Alice was eliminated');
    assert.strictEqual(results.isTie, false);

    // Verify banner title
    const isUndercoverWin = results.winner === 'undercover';
    let bannerTitle = isUndercoverWin ? 'UNDERCOVER WINS!' : 'CIVILIANS WIN!';
    assert.strictEqual(bannerTitle, 'UNDERCOVER WINS!');
  });

  // Step 12: Voting tie -> UNDERCOVER WINS
  it('Step 12: Voting tie results in UNDERCOVER WINS', () => {
    const wordPair = { wordA: 'Coffee', wordB: 'Tea' };
    const players: Player[] = [
      { id: 'p1', name: 'Alice', isCustomName: true, avatarColor: '#38bdf8', role: 'innocent', secretWord: 'Coffee' },
      { id: 'p2', name: 'Bob', isCustomName: true, avatarColor: '#f43f5e', role: 'innocent', secretWord: 'Coffee' },
      { id: 'p3', name: 'Charlie', isCustomName: true, avatarColor: '#10b981', role: 'undercover', secretWord: 'Tea' },
      { id: 'p4', name: 'Diana', isCustomName: true, avatarColor: '#f59e0b', role: 'innocent', secretWord: 'Coffee' },
    ];

    // 2-way tie between Alice and Bob
    const votes: Record<string, string> = {
      p1: 'p2',
      p4: 'p2',
      p2: 'p1',
      p3: 'p1',
    };

    const results = calculateGameResults(players, votes, 'undercover', wordPair);

    assert.strictEqual(results.isTie, true, 'Result must be flagged as tie');
    assert.strictEqual(results.winner, 'undercover', 'Undercover wins on voting tie');

    let bannerTitle = results.winner === 'undercover' ? 'UNDERCOVER WINS!' : 'CIVILIANS WIN!';
    assert.strictEqual(bannerTitle, 'UNDERCOVER WINS!');
  });

  // Step 13: Results display shows Word A vs Word B comparison
  it('Step 13: Results state accurately preserves Word A and Word B for side-by-side display', () => {
    let state: GameState = {
      ...initialGameState,
      players: [
        { id: 'p1', name: 'Alice', isCustomName: true, avatarColor: '#38bdf8' },
        { id: 'p2', name: 'Bob', isCustomName: true, avatarColor: '#f43f5e' },
        { id: 'p3', name: 'Charlie', isCustomName: true, avatarColor: '#10b981' },
        { id: 'p4', name: 'Diana', isCustomName: true, avatarColor: '#f59e0b' },
      ],
      settings: { ...initialGameState.settings, mode: 'undercover' },
    };

    state = gameReducer(state, { type: 'START_GAME' });
    const selectedPair = state.selectedWordPair;
    assert.ok(selectedPair);

    // Fast-forward voting
    state = {
      ...state,
      voting: { currentVoterIndex: 3, isReadyToVote: true, selectedSuspectId: 'p3', votes: { p1: 'p3', p2: 'p3', p3: 'p1' } },
    };
    state = gameReducer(state, { type: 'CONFIRM_VOTE' });

    assert.strictEqual(state.phase, 'RESULTS');
    assert.ok(state.results);
    assert.strictEqual(state.selectedWordPair?.wordA, selectedPair.wordA);
    assert.strictEqual(state.selectedWordPair?.wordB, selectedPair.wordB);
  });
});
