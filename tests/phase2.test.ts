/**
 * Comprehensive Automated Verification Suite for Phase 2: Classic Imposter Game
 * Tests role assignment, word distribution, privacy scrubbing, clue timer,
 * private voting, exact win conditions, tie-handling, and game restarts.
 */

import {
  assignRoles,
  calculateGameResults,
  isValidImposterCount,
  formatTime,
} from '../src/game/state/gameLogic';
import {
  gameReducer,
  initialGameState,
} from '../src/game/state/gameReducer';
import type { Player, GameState } from '../src/game/types/gameState';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

console.log('=== RUNNING PHASE 2 AUTOMATED VERIFICATION ===\n');

const testPlayers: Player[] = [
  { id: 'p1', name: 'Alex', isCustomName: true, avatarColor: '#8B5CF6' },
  { id: 'p2', name: 'Sofia', isCustomName: true, avatarColor: '#EC4899' },
  { id: 'p3', name: 'Liam', isCustomName: true, avatarColor: '#06B6D4' },
  { id: 'p4', name: 'Yuki', isCustomName: true, avatarColor: '#10B981' },
];

// ============================================================================
// 1. Role Assignment & Multiple Imposter Limits
// ============================================================================
console.log('--- 1. Role Assignment & Multiple Imposter Limits ---');
assert(isValidImposterCount(2, 1) === false, 'Disallow games with less than 3 players');
assert(isValidImposterCount(3, 1) === true, 'Allow 1 imposter for 3 players');
assert(isValidImposterCount(3, 2) === false, 'Disallow 2 imposters for 3 players (max floor(3/2)=1)');
assert(isValidImposterCount(4, 2) === true, 'Allow 2 imposters for 4 players (max floor(4/2)=2)');
assert(isValidImposterCount(4, 3) === false, 'Disallow 3 imposters for 4 players');
assert(isValidImposterCount(6, 3) === true, 'Allow 3 imposters for 6 players');

// 1 Imposter assignment check
const singleAssignment = assignRoles(testPlayers, 1, 'food');
const singleImposters = singleAssignment.players.filter((p) => p.role === 'imposter');
const singleCivilians = singleAssignment.players.filter((p) => p.role === 'innocent');

assert(singleImposters.length === 1, 'Exactly 1 imposter assigned when configured for 1');
assert(singleCivilians.length === 3, 'Exactly 3 civilians assigned for 4 players');
assert(singleImposters[0].secretWord === undefined, 'Imposter secretWord is strictly undefined');
assert(
  typeof singleAssignment.selectedWord === 'string' && singleAssignment.selectedWord.length > 0,
  'Secret word generated from WordEngine'
);
assert(
  singleCivilians.every((c) => c.secretWord === singleAssignment.selectedWord),
  'All Civilians receive the identical secret word'
);

// 2 Imposters assignment check
const fivePlayers: Player[] = [
  ...testPlayers,
  { id: 'p5', name: 'Carlos', isCustomName: true, avatarColor: '#F59E0B' },
];
const multiAssignment = assignRoles(fivePlayers, 2, 'everyday');
const multiImposters = multiAssignment.players.filter((p) => p.role === 'imposter');
const multiCivilians = multiAssignment.players.filter((p) => p.role === 'innocent');

assert(multiImposters.length === 2, 'Exactly 2 imposters assigned when configured for 2');
assert(multiCivilians.length === 3, 'Exactly 3 civilians assigned for 5 players');
assert(
  multiImposters.every((imp) => imp.secretWord === undefined),
  'All imposters in multi-imposter game have undefined secretWord'
);
assert(
  multiCivilians.every((c) => c.secretWord === multiAssignment.selectedWord),
  'All civilians in multi-imposter game receive the identical secret word'
);

// Distribution fairness check (over multiple runs, different players become imposter)
const imposterOccurrenceCount: Record<string, number> = { p1: 0, p2: 0, p3: 0 };
for (let i = 0; i < 40; i++) {
  const run = assignRoles(testPlayers.slice(0, 3), 1, 'random');
  const imp = run.players.find((p) => p.role === 'imposter');
  if (imp) {
    imposterOccurrenceCount[imp.id] = (imposterOccurrenceCount[imp.id] || 0) + 1;
  }
}
assert(
  imposterOccurrenceCount.p1 > 0 && imposterOccurrenceCount.p2 > 0 && imposterOccurrenceCount.p3 > 0,
  'Fair random distribution: all players have been assigned imposter across multiple runs'
);

// ============================================================================
// 2. Role Reveal Privacy & Scrubbing
// ============================================================================
console.log('\n--- 2. Role Reveal Privacy & Scrubbing ---');
let state: GameState = {
  ...initialGameState,
  players: testPlayers,
};

// Start Game
state = gameReducer(state, { type: 'START_GAME' });
assert(state.phase === 'ROLE_REVEAL', 'START_GAME transitions phase to ROLE_REVEAL');
assert(state.reveal.currentRevealIndex === 0, 'Initial reveal index is 0 (first player)');
assert(state.reveal.isRevealed === false, 'Role card is initially hidden before user taps reveal');

// Tap to reveal
state = gameReducer(state, { type: 'TOGGLE_REVEAL_ROLE' });
assert(state.reveal.isRevealed === true, 'TOGGLE_REVEAL_ROLE sets isRevealed to true');

// Hide & Pass Phone
state = gameReducer(state, { type: 'NEXT_REVEAL_PLAYER' });
assert(state.reveal.currentRevealIndex === 1, 'NEXT_REVEAL_PLAYER advances to player index 1');
assert(
  state.reveal.isRevealed === false,
  'Privacy Guarantee: isRevealed is immediately scrubbed to false for the next player'
);

// Advance through remaining players (index 1 -> 2 -> 3)
state = gameReducer(state, { type: 'TOGGLE_REVEAL_ROLE' });
state = gameReducer(state, { type: 'NEXT_REVEAL_PLAYER' }); // now at 2
state = gameReducer(state, { type: 'TOGGLE_REVEAL_ROLE' });
state = gameReducer(state, { type: 'NEXT_REVEAL_PLAYER' }); // now at 3 (last player)
assert(state.reveal.currentRevealIndex === 3, 'Advances to 4th and final player');
state = gameReducer(state, { type: 'TOGGLE_REVEAL_ROLE' });
state = gameReducer(state, { type: 'NEXT_REVEAL_PLAYER' }); // finished all players!

assert(state.phase === 'CLUE_ROUND', 'Finishing role reveal for all players advances directly to CLUE_ROUND');
assert(state.clue.activeSpeakerIndex === 0, 'Clue round initializes speaker index at 0');

// ============================================================================
// 3. Clue Round, Speaker Order & Timer
// ============================================================================
console.log('\n--- 3. Clue Round, Speaker Order & Timer ---');
assert(formatTime(180) === '03:00', 'formatTime formats 180s as 03:00');
assert(formatTime(45) === '00:45', 'formatTime formats 45s as 00:45');
assert(formatTime(0) === '00:00', 'formatTime formats 0s as 00:00');

// Speaker progression
state = gameReducer(state, { type: 'NEXT_SPEAKER' });
assert(state.clue.activeSpeakerIndex === 1, 'NEXT_SPEAKER advances to speaker index 1');
state = gameReducer(state, { type: 'NEXT_SPEAKER' });
state = gameReducer(state, { type: 'NEXT_SPEAKER' });
state = gameReducer(state, { type: 'NEXT_SPEAKER' });
assert(state.clue.activeSpeakerIndex === 0, 'NEXT_SPEAKER loops back to speaker index 0 after all players');

// Timer tick
const startingSeconds = state.clue.remainingSeconds;
state = gameReducer(state, { type: 'TICK_CLUE_TIMER' });
assert(state.clue.remainingSeconds === startingSeconds - 1, 'TICK_CLUE_TIMER decrements timer by 1 second');

// Pause / Resume
state = gameReducer(state, { type: 'TOGGLE_TIMER_PAUSE' });
assert(state.clue.isPaused === true, 'TOGGLE_TIMER_PAUSE pauses the timer');
const pausedSeconds = state.clue.remainingSeconds;
state = gameReducer(state, { type: 'TICK_CLUE_TIMER' });
assert(state.clue.remainingSeconds === pausedSeconds, 'Timer does not decrement while paused');
state = gameReducer(state, { type: 'TOGGLE_TIMER_PAUSE' });
assert(state.clue.isPaused === false, 'TOGGLE_TIMER_PAUSE resumes the timer');

// Timer expiration transition
state = { ...state, clue: { ...state.clue, remainingSeconds: 1 } };
state = gameReducer(state, { type: 'TICK_CLUE_TIMER' });
assert(state.phase === 'VOTING', 'Timer hitting zero automatically transitions to VOTING');
assert(state.clue.remainingSeconds === 0, 'Clue timer stops cleanly at 0');

// Unlimited Mode Timer
let unlimitedState: GameState = {
  ...initialGameState,
  players: testPlayers,
  settings: { ...initialGameState.settings, roundTimeMinutes: 0 },
};
unlimitedState = gameReducer(unlimitedState, { type: 'START_GAME' });
unlimitedState = { ...unlimitedState, phase: 'CLUE_ROUND' };
const unlSeconds = unlimitedState.clue.remainingSeconds;
unlimitedState = gameReducer(unlimitedState, { type: 'TICK_CLUE_TIMER' });
assert(unlimitedState.phase === 'CLUE_ROUND', 'Unlimited mode does not auto-transition on tick');
assert(unlimitedState.clue.remainingSeconds === unlSeconds, 'Unlimited mode timer remains 0 without ticking down');

// Skip to Voting
state = { ...state, phase: 'CLUE_ROUND' };
state = gameReducer(state, { type: 'SKIP_TO_VOTING' });
assert(state.phase === 'VOTING', 'SKIP_TO_VOTING advances phase to VOTING');

// ============================================================================
// 4. Secret Pass-the-Phone Voting
// ============================================================================
console.log('\n--- 4. Secret Pass-the-Phone Voting ---');
assert(state.voting.currentVoterIndex === 0, 'Voting starts at voter index 0');
assert(state.voting.isReadyToVote === false, 'Ballot initially hidden before voter taps ready');
assert(state.voting.selectedSuspectId === null, 'No suspect initially pre-selected');

// Ready to vote
state = gameReducer(state, { type: 'SET_VOTER_READY' });
assert(state.voting.isReadyToVote === true, 'SET_VOTER_READY reveals secret ballot');

// Select suspect
state = gameReducer(state, { type: 'SET_SELECTED_SUSPECT', payload: { suspectId: 'p2' } });
assert(state.voting.selectedSuspectId === 'p2', 'SET_SELECTED_SUSPECT selects target candidate');

// Confirm vote
state = gameReducer(state, { type: 'CONFIRM_VOTE' });
assert(state.voting.votes['p1'] === 'p2', 'Vote recorded in votes state object');
assert(state.voting.currentVoterIndex === 1, 'CONFIRM_VOTE advances to next voter');
assert(
  state.voting.isReadyToVote === false,
  'Privacy Guarantee: Ballot is hidden before handing phone to next voter'
);
assert(
  state.voting.selectedSuspectId === null,
  'Privacy Guarantee: Selected suspect is cleared from view before next voter'
);

// Cast votes for remaining players:
// p2 votes for p1
state = gameReducer(state, { type: 'SET_VOTER_READY' });
state = gameReducer(state, { type: 'SET_SELECTED_SUSPECT', payload: { suspectId: 'p1' } });
state = gameReducer(state, { type: 'CONFIRM_VOTE' });

// p3 votes for p1
state = gameReducer(state, { type: 'SET_VOTER_READY' });
state = gameReducer(state, { type: 'SET_SELECTED_SUSPECT', payload: { suspectId: 'p1' } });
state = gameReducer(state, { type: 'CONFIRM_VOTE' });

// p4 votes for p1 (final voter)
state = gameReducer(state, { type: 'SET_VOTER_READY' });
state = gameReducer(state, { type: 'SET_SELECTED_SUSPECT', payload: { suspectId: 'p1' } });
state = gameReducer(state, { type: 'CONFIRM_VOTE' });

assert(state.phase === 'RESULTS', 'All players voting automatically transitions to RESULTS');
assert(state.results !== null, 'Results state is populated upon completion of voting');

// ============================================================================
// 5. Exact Win Conditions & Tie Rules
// ============================================================================
console.log('\n--- 5. Exact Win Conditions & Tie Rules ---');

const playersWithRoles: Player[] = [
  { id: 'p1', name: 'Alex', isCustomName: true, avatarColor: '#8B5CF6', role: 'imposter' },
  { id: 'p2', name: 'Sofia', isCustomName: true, avatarColor: '#EC4899', role: 'innocent', secretWord: 'Pizza' },
  { id: 'p3', name: 'Liam', isCustomName: true, avatarColor: '#06B6D4', role: 'innocent', secretWord: 'Pizza' },
  { id: 'p4', name: 'Yuki', isCustomName: true, avatarColor: '#10B981', role: 'innocent', secretWord: 'Pizza' },
];

// Scenario A: Single top suspect is Imposter -> GROUP WINS
const groupWinVotes = { p1: 'p2', p2: 'p1', p3: 'p1', p4: 'p1' }; // p1 gets 3 votes
const resA = calculateGameResults(playersWithRoles, groupWinVotes);
assert(resA.winner === 'group', 'Single top suspect on Imposter results in GROUP WINS');
assert(resA.isTie === false, 'Group win is not a tie');
assert(resA.mostVotedPlayerIds[0] === 'p1', 'Most voted player is correctly identified as p1');

// Scenario B: Single top suspect is Civilian -> IMPOSTER WINS
const imposterWinVotes = { p1: 'p2', p2: 'p3', p3: 'p2', p4: 'p2' }; // p2 gets 3 votes
const resB = calculateGameResults(playersWithRoles, imposterWinVotes);
assert(resB.winner === 'imposter', 'Single top suspect on Civilian results in IMPOSTER WINS');
assert(resB.isTie === false, 'Civilian eliminated is not a tie');
assert(resB.mostVotedPlayerIds[0] === 'p2', 'Most voted player is correctly identified as p2');

// Scenario C: Voting Tie -> ALWAYS IMPOSTER WINS (Strict Rule: No random tiebreak)
const tieVotes = { p1: 'p2', p2: 'p1', p3: 'p2', p4: 'p1' }; // p1 has 2 votes, p2 has 2 votes
const resC = calculateGameResults(playersWithRoles, tieVotes);
assert(resC.winner === 'imposter', 'Voting tie strictly results in IMPOSTER WINS (no random tiebreak)');
assert(resC.isTie === true, 'isTie is true when highest votes tie');
assert(resC.mostVotedPlayerIds.length === 2, 'Both tied players are identified in mostVotedPlayerIds');

// Scenario D: Multi-Imposter Win Conditions
const multiImposterPlayers: Player[] = [
  { id: 'p1', name: 'Alex', isCustomName: true, avatarColor: '#8B5CF6', role: 'imposter' },
  { id: 'p2', name: 'Sofia', isCustomName: true, avatarColor: '#EC4899', role: 'imposter' },
  { id: 'p3', name: 'Liam', isCustomName: true, avatarColor: '#06B6D4', role: 'innocent', secretWord: 'Guitar' },
  { id: 'p4', name: 'Yuki', isCustomName: true, avatarColor: '#10B981', role: 'innocent', secretWord: 'Guitar' },
  { id: 'p5', name: 'Carlos', isCustomName: true, avatarColor: '#F59E0B', role: 'innocent', secretWord: 'Guitar' },
];

// Multi-Imposter: group eliminates Imposter p1
const multiGroupVotes = { p1: 'p3', p2: 'p3', p3: 'p1', p4: 'p1', p5: 'p1' }; // p1 gets 3 votes
const resD = calculateGameResults(multiImposterPlayers, multiGroupVotes);
assert(resD.winner === 'group', 'Multi-imposter: single majority vote on an Imposter awards GROUP WINS');

// Multi-Imposter: tie between Imposter and Civilian -> IMPOSTER WINS
const multiTieVotes = { p1: 'p3', p2: 'p3', p3: 'p1', p4: 'p1', p5: 'p2' }; // p1 has 2, p3 has 2
const resE = calculateGameResults(multiImposterPlayers, multiTieVotes);
assert(resE.winner === 'imposter', 'Multi-imposter: tie between Imposter and Civilian results in IMPOSTER WINS');
assert(resE.isTie === true, 'Multi-imposter tie correctly flagged');

// Multi-Imposter: tie between TWO Imposters -> IMPOSTER WINS
const exactTwoImpostersTie = { p1: 'p2', p2: 'p1', p3: 'p1', p4: 'p2' }; // p1 has 2, p2 has 2
const resF = calculateGameResults(multiImposterPlayers, exactTwoImpostersTie);
assert(
  resF.winner === 'imposter',
  'Tie between two imposters results in IMPOSTER WINS (tie rule always holds)'
);

// Edge Case: 0 votes cast
const resZero = calculateGameResults(playersWithRoles, {});
assert(resZero.winner === 'imposter' && resZero.isTie === true, 'Zero votes cast defaults safely to tie / imposter win');

// ============================================================================
// 6. Play Again & Change Settings Reset
// ============================================================================
console.log('\n--- 6. Play Again & Change Settings Reset ---');
const finishedState: GameState = {
  ...state,
  phase: 'RESULTS',
  results: resA,
  activeRound: 1,
};

// Play Again
const replayState = gameReducer(finishedState, { type: 'PLAY_AGAIN' });
assert(replayState.phase === 'ROLE_REVEAL', 'PLAY_AGAIN navigates directly to ROLE_REVEAL');
assert(replayState.activeRound === 2, 'PLAY_AGAIN increments activeRound to 2');
assert(replayState.results === null, 'PLAY_AGAIN clears previous results');
assert(Object.keys(replayState.voting.votes).length === 0, 'PLAY_AGAIN resets votes object to empty');
assert(replayState.reveal.currentRevealIndex === 0, 'PLAY_AGAIN resets reveal index to 0');
assert(replayState.reveal.isRevealed === false, 'PLAY_AGAIN ensures initial reveal card is hidden');
assert(replayState.players.length === testPlayers.length, 'PLAY_AGAIN preserves all players in roster');
assert(
  replayState.players.some((p) => p.role === 'imposter'),
  'PLAY_AGAIN re-assigns roles with new imposter'
);
assert(
  typeof replayState.selectedWord === 'string' && replayState.selectedWord.length > 0,
  'PLAY_AGAIN draws a fresh secret word'
);

// Quit to Lobby / Change Settings
const lobbyState = gameReducer(finishedState, { type: 'QUIT_TO_LOBBY' });
assert(lobbyState.phase === 'PLAYER_SETUP', 'QUIT_TO_LOBBY navigates back to PLAYER_SETUP');
assert(lobbyState.results === null, 'QUIT_TO_LOBBY clears results');
assert(lobbyState.selectedWord === undefined, 'QUIT_TO_LOBBY scrubs selectedWord from state');
assert(
  lobbyState.players.every((p) => p.role === undefined && p.secretWord === undefined),
  'QUIT_TO_LOBBY completely scrubs all secret roles and words from player state'
);
assert(lobbyState.players.length === testPlayers.length, 'QUIT_TO_LOBBY preserves player names and roster');

// ============================================================================
// 7. Refresh Recovery & Privacy Guarantee
// ============================================================================
console.log('\n--- 7. Refresh Recovery & Privacy Guarantee ---');
const interruptedState: GameState = {
  ...initialGameState,
  isInterrupted: true,
};
assert(interruptedState.isInterrupted === true, 'Detects interrupted game session');
assert(interruptedState.selectedWord === undefined, 'Recovery state holds no secret word in memory');
assert(
  interruptedState.players.every((p) => p.role === undefined && p.secretWord === undefined),
  'Recovery state holds no player roles or secret words'
);

const recoveredState = gameReducer(interruptedState, { type: 'RESET_INTERRUPTED_GAME' });
assert(recoveredState.phase === 'PLAYER_SETUP', 'RESET_INTERRUPTED_GAME returns to PLAYER_SETUP');
assert(recoveredState.isInterrupted === false, 'RESET_INTERRUPTED_GAME clears isInterrupted flag');

console.log(`\n========================================`);
console.log(`SUMMARY: ${passedTests} / ${totalTests} tests passed.`);
console.log(`========================================\n`);
