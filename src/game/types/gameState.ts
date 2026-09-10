/**
 * Central Game State Definitions & Enums
 * Supporting complete lifecycle: LOBBY -> NEXT_ROUND
 */

export type GamePhase =
  | 'LOBBY'
  | 'PLAYER_SETUP'
  | 'GAME_SETUP'
  | 'ROLE_REVEAL'
  | 'CLUE_ROUND'
  | 'CLUE_PHASE'
  | 'DISCUSSION'
  | 'VOTING'
  | 'MR_WHITE_GUESS'
  | 'RESULTS'
  | 'RESULT'
  | 'IMPOSTER_GUESS'
  | 'SCORE'
  | 'NEXT_ROUND';

export type GameMode =
  | 'classic'
  | 'undercover'
  | 'mr_white'
  | 'multiple_imposters'
  | 'chaos';

export type CategoryId =
  | 'random'
  | 'everyday'
  | 'food'
  | 'animals'
  | 'movies'
  | 'places'
  | 'tech';

export type PlayerRole = 'innocent' | 'imposter' | 'mr_white' | 'undercover';

export interface Player {
  id: string;
  name: string;
  isCustomName: boolean;
  avatarColor: string;
  role?: PlayerRole;
  secretWord?: string;
  isHost?: boolean;
}

export interface GameSettingsConfig {
  mode: GameMode;
  category: CategoryId;
  impostersCount: number;
  undercoverCount?: number;
  roundTimeMinutes: number; // 1, 2, 3, 5, or 0 (unlimited)
  allowHints: boolean;
}

export interface RevealState {
  currentRevealIndex: number;
  isRevealed: boolean;
}

export interface ClueState {
  activeSpeakerIndex: number;
  remainingSeconds: number;
  isPaused: boolean;
}

export interface VotingState {
  currentVoterIndex: number;
  isReadyToVote: boolean;
  selectedSuspectId: string | null;
  votes: Record<string, string>; // voterId -> suspectId
}

export interface MrWhiteGuessState {
  mrWhitePlayerId: string;
  isReadyToGuess: boolean;
  submittedGuess: string | null;
  wasGuessCorrect: boolean | null;
}

export interface ResultsState {
  winner: 'group' | 'imposter' | 'mr_white' | 'undercover';
  voteCounts: Record<string, number>;
  mostVotedPlayerIds: string[];
  isTie: boolean;
  actualImposterIds: string[];
  actualUndercoverIds?: string[];
  mrWhiteId?: string;
  mrWhiteGuessedWord?: string;
  wasMrWhiteGuessCorrect?: boolean;
  wordPair?: { wordA: string; wordB: string };
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  settings: GameSettingsConfig;
  minPlayers: number;
  maxPlayers: number;
  activeRound: number;
  selectedWord?: string;
  selectedWordPair?: { wordA: string; wordB: string };
  secretRoleAssigned: boolean;
  validationError: string | null;
  alertMessage: { text: string; type: 'info' | 'warning' | 'error' | 'success' } | null;
  reveal: RevealState;
  clue: ClueState;
  voting: VotingState;
  mrWhiteGuess: MrWhiteGuessState | null;
  results: ResultsState | null;
  isInterrupted: boolean;
}

export type GameAction =
  | { type: 'ADD_PLAYER'; payload?: { name?: string } }
  | { type: 'REMOVE_PLAYER'; payload: { id: string } }
  | { type: 'UPDATE_PLAYER_NAME'; payload: { id: string; name: string } }
  | { type: 'SET_PLAYER_COUNT'; payload: { count: number } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettingsConfig> }
  | { type: 'SET_MODE'; payload: { mode: GameMode } }
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_ALERT'; payload: { text: string; type: 'info' | 'warning' | 'error' | 'success' } | null }
  | { type: 'TRANSITION_PHASE'; payload: { phase: GamePhase } }
  | { type: 'TOGGLE_REVEAL_ROLE' }
  | { type: 'NEXT_REVEAL_PLAYER' }
  | { type: 'NEXT_SPEAKER' }
  | { type: 'TICK_CLUE_TIMER' }
  | { type: 'TOGGLE_TIMER_PAUSE' }
  | { type: 'SKIP_TO_VOTING' }
  | { type: 'SET_VOTER_READY' }
  | { type: 'SET_SELECTED_SUSPECT'; payload: { suspectId: string } }
  | { type: 'CONFIRM_VOTE' }
  | { type: 'CALCULATE_RESULTS' }
  | { type: 'SET_MR_WHITE_READY' }
  | { type: 'SUBMIT_MR_WHITE_GUESS'; payload: { guess: string } }
  | { type: 'PLAY_AGAIN' }
  | { type: 'QUIT_TO_LOBBY' }
  | { type: 'RESET_INTERRUPTED_GAME' };
