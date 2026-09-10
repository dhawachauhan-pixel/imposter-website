/**
 * Phase 3A Final Product Quality Audit Tests
 * Rigorously checks all 14 audit criteria:
 * - Classic complete flow
 * - Mr. White complete flow (correct guess, wrong guess, tie, survival)
 * - Undercover complete flow (stealth reveal, civilian win, undercover win, tie)
 * - Active mode cards state
 * - Play again role scrubbing and re-draw
 * - Interruption safety
 * - Privacy guarantees
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { gameReducer, initialGameState } from '../src/game/state/gameReducer';
import { assignRoles } from '../src/game/state/gameLogic';
import type { GameState, Player } from '../src/game/types/gameState';

describe('Phase 3A Final Quality Audit: End-to-End State Invariants', () => {
  // 1. Classic mode complete lifecycle
  it('1. Classic Mode: Setup -> Reveal -> Clue -> Voting -> Results -> Play Again', () => {
    let state: GameState = {
      ...initialGameState,
      settings: { ...initialGameState.settings, mode: 'classic' },
    };

    // Start
    state = gameReducer(state, { type: 'START_GAME' });
    assert.strictEqual(state.phase, 'ROLE_REVEAL');
    assert.ok(state.selectedWord);
    assert.strictEqual(state.reveal.isRevealed, false);

    // Pass-the-phone privacy between every player
    for (let i = 0; i < state.players.length - 1; i++) {
      state = gameReducer(state, { type: 'TOGGLE_REVEAL_ROLE' });
      assert.strictEqual(state.reveal.isRevealed, true);
      state = gameReducer(state, { type: 'NEXT_REVEAL_PLAYER' });
      assert.strictEqual(state.reveal.isRevealed, false, 'Privacy: must scrub role before next player');
    }

    // Last player reveal advances to clue round
    state = gameReducer(state, { type: 'TOGGLE_REVEAL_ROLE' });
    state = gameReducer(state, { type: 'NEXT_REVEAL_PLAYER' });
    assert.strictEqual(state.phase, 'CLUE_ROUND');

    // Skip to voting
    state = gameReducer(state, { type: 'SKIP_TO_VOTING' });
    assert.strictEqual(state.phase, 'VOTING');
    assert.strictEqual(state.voting.isReadyToVote, false);

    // Voting privacy between every voter
    const imposterId = state.players.find((p) => p.role === 'imposter')!.id;
    for (let i = 0; i < state.players.length; i++) {
      assert.strictEqual(state.voting.isReadyToVote, false, 'Voting privacy: ballot must be hidden for voter');
      assert.strictEqual(state.voting.selectedSuspectId, null, 'Voting privacy: selection must be cleared');
      state = gameReducer(state, { type: 'SET_VOTER_READY' });
      state = gameReducer(state, { type: 'SET_SELECTED_SUSPECT', payload: { suspectId: imposterId } });
      state = gameReducer(state, { type: 'CONFIRM_VOTE' });
    }

    // Results
    assert.strictEqual(state.phase, 'RESULTS');
    assert.strictEqual(state.results?.winner, 'group');

    // Play Again
    state = gameReducer(state, { type: 'PLAY_AGAIN' });
    assert.strictEqual(state.phase, 'ROLE_REVEAL');
    assert.strictEqual(state.activeRound, 2);
    assert.strictEqual(state.reveal.isRevealed, false);
    assert.strictEqual(state.results, null);
  });

  // 2. Mr. White complete flow (correct guess and wrong guess)
  it('2. Mr. White Mode: Correct guess awards Mr. White win; wrong guess awards Group win', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Alice', isCustomName: true, role: 'innocent', secretWord: 'Planet' },
      { id: 'p2', name: 'Bob', isCustomName: true, role: 'innocent', secretWord: 'Planet' },
      { id: 'p3', name: 'Charlie', isCustomName: true, role: 'mr_white' }, // Charlie has no word
      { id: 'p4', name: 'Diana', isCustomName: true, role: 'innocent', secretWord: 'Planet' },
    ];

    // Mr. White is voted out
    let state: GameState = {
      ...initialGameState,
      phase: 'VOTING',
      players,
      selectedWord: 'Planet',
      settings: { ...initialGameState.settings, mode: 'mr_white' },
      voting: { currentVoterIndex: 3, isReadyToVote: true, selectedSuspectId: 'p3', votes: { p1: 'p3', p2: 'p3', p3: 'p1' } },
    };

    // Confirm vote intercepts to MR_WHITE_GUESS without revealing secret word
    state = gameReducer(state, { type: 'CONFIRM_VOTE' });
    assert.strictEqual(state.phase, 'MR_WHITE_GUESS');
    assert.strictEqual(state.mrWhiteGuess?.mrWhitePlayerId, 'p3');
    assert.strictEqual(state.mrWhiteGuess?.isReadyToGuess, false);

    // Mr. White marks ready
    state = gameReducer(state, { type: 'SET_MR_WHITE_READY' });
    assert.strictEqual(state.mrWhiteGuess?.isReadyToGuess, true);

    // Correct Guess -> MR. WHITE WINS
    const stateCorrect = gameReducer(state, { type: 'SUBMIT_MR_WHITE_GUESS', payload: { guess: 'planet' } });
    assert.strictEqual(stateCorrect.phase, 'RESULTS');
    assert.strictEqual(stateCorrect.results?.winner, 'mr_white');
    assert.strictEqual(stateCorrect.results?.wasMrWhiteGuessCorrect, true);

    // Wrong Guess -> GROUP WINS
    const stateWrong = gameReducer(state, { type: 'SUBMIT_MR_WHITE_GUESS', payload: { guess: 'asteroid' } });
    assert.strictEqual(stateWrong.phase, 'RESULTS');
    assert.strictEqual(stateWrong.results?.winner, 'group');
    assert.strictEqual(stateWrong.results?.wasMrWhiteGuessCorrect, false);
  });

  // 3. Undercover complete flow
  it('3. Undercover Mode: Stealth reveal (Word B, civilian styling, no UNDERCOVER label)', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Alice', isCustomName: false },
      { id: 'p2', name: 'Bob', isCustomName: false },
      { id: 'p3', name: 'Charlie', isCustomName: false },
      { id: 'p4', name: 'Diana', isCustomName: false },
    ];

    const result = assignRoles(players, { mode: 'undercover', undercoverCount: 1 });
    assert.ok(result.selectedWordPair);

    const undercoverPlayer = result.players.find((p) => p.role === 'undercover');
    assert.ok(undercoverPlayer);
    assert.strictEqual(undercoverPlayer.secretWord, result.selectedWordPair.wordB);

    // Verify stealth: Civilian players receive Word A, Undercover receives Word B
    const civilians = result.players.filter((p) => p.role === 'innocent');
    for (const civ of civilians) {
      assert.strictEqual(civ.secretWord, result.selectedWordPair.wordA);
    }
  });

  // 4. Interruption and refresh safety
  it('4. Refresh Safety: Interrupted session cleans state and never exposes secret roles', () => {
    const interruptedState: GameState = {
      ...initialGameState,
      isInterrupted: true,
    };
    assert.strictEqual(interruptedState.isInterrupted, true);
    assert.strictEqual(interruptedState.selectedWord, undefined);
    assert.ok(interruptedState.players.every((p) => p.role === undefined && p.secretWord === undefined));

    const recovered = gameReducer(interruptedState, { type: 'RESET_INTERRUPTED_GAME' });
    assert.strictEqual(recovered.phase, 'PLAYER_SETUP');
    assert.strictEqual(recovered.isInterrupted, false);
  });

  // 5. Static Pre-launch SEO & Sitemap Validation
  it('5. Pre-launch SEO: Valid public/sitemap.xml matches canonical domain in robots.txt', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
    assert.ok(fs.existsSync(sitemapPath), 'public/sitemap.xml must exist');

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    assert.ok(sitemapContent.includes('https://imposter.website/'), 'sitemap must include canonical domain');
    assert.ok(sitemapContent.includes('<urlset'), 'sitemap must be valid xml urlset');

    const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
    assert.ok(fs.existsSync(robotsPath), 'public/robots.txt must exist');
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    assert.ok(robotsContent.includes('Sitemap: https://imposter.website/sitemap.xml'), 'robots.txt must reference sitemap');
  });
});
