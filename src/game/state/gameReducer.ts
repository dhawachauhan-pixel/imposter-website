/**
 * Reducer and Session Interruption Handlers for Imposter Game
 * Supports Classic, Mr. White, and Undercover modes
 */

import type { GameState, GameAction } from '../types/gameState';
import { createDefaultPlayers, createNewPlayer, resolveDuplicateName, sanitizePlayerName } from './playerUtils';
import { assignRoles, calculateGameResults } from './gameLogic';
import { isWordGuessCorrect } from '../utils/normalizeWord';
import { savePartyRoster, loadPartyRoster, clearSavedRoster } from '../utils/rosterStorage';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 16;
export const SESSION_ACTIVE_KEY = 'imposter_active_session';

export function setGameSessionActive(active: boolean) {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      if (active) {
        window.sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
      } else {
        window.sessionStorage.removeItem(SESSION_ACTIVE_KEY);
      }
    } catch {
      // Storage access gracefully handled in private/restricted environments
    }
  }
}

export function checkWasGameInterrupted(): boolean {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      return window.sessionStorage.getItem(SESSION_ACTIVE_KEY) === 'true';
    } catch {
      return false;
    }
  }
  return false;
}

function getInitialPlayers() {
  const saved = loadPartyRoster();
  if (saved && saved.length >= MIN_PLAYERS) {
    return saved;
  }
  return createDefaultPlayers();
}

export const initialGameState: GameState = {
  phase: 'PLAYER_SETUP',
  players: getInitialPlayers(),
  settings: {
    mode: 'classic',
    category: 'random',
    impostersCount: 1,
    undercoverCount: 1,
    roundTimeMinutes: 3,
    allowHints: true,
  },
  minPlayers: MIN_PLAYERS,
  maxPlayers: MAX_PLAYERS,
  activeRound: 1,
  secretRoleAssigned: false,
  validationError: null,
  alertMessage: null,
  reveal: {
    currentRevealIndex: 0,
    isRevealed: false,
  },
  clue: {
    activeSpeakerIndex: 0,
    remainingSeconds: 180,
    isPaused: false,
  },
  voting: {
    currentVoterIndex: 0,
    isReadyToVote: false,
    selectedSuspectId: null,
    votes: {},
  },
  mrWhiteGuess: null,
  results: null,
  isInterrupted: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      if (state.players.length >= state.maxPlayers) {
        return {
          ...state,
          alertMessage: { text: `Maximum player limit (${state.maxPlayers}) reached.`, type: 'warning' },
        };
      }
      const newPlayer = createNewPlayer(state.players, action.payload?.name);
      const updatedPlayers = [...state.players, newPlayer];
      const isValid = updatedPlayers.length >= state.minPlayers;
      savePartyRoster(updatedPlayers);

      return {
        ...state,
        players: updatedPlayers,
        validationError: isValid ? null : `Add at least ${state.minPlayers} players to start.`,
        alertMessage: null,
      };
    }

    case 'REMOVE_PLAYER': {
      const updatedPlayers = state.players.filter((p) => p.id !== action.payload.id);
      const isValid = updatedPlayers.length >= state.minPlayers;
      const maxAllowedImposters = Math.max(1, Math.floor(updatedPlayers.length / 2));
      const adjustedImposters = Math.min(state.settings.impostersCount, maxAllowedImposters);
      const adjustedUndercover = Math.min(state.settings.undercoverCount || 1, maxAllowedImposters);
      savePartyRoster(updatedPlayers);

      return {
        ...state,
        players: updatedPlayers,
        settings: {
          ...state.settings,
          impostersCount: adjustedImposters,
          undercoverCount: adjustedUndercover,
        },
        validationError: isValid ? null : `Add at least ${state.minPlayers} players to start.`,
      };
    }

    case 'UPDATE_PLAYER_NAME': {
      const target = state.players.find((p) => p.id === action.payload.id);
      if (!target) return state;

      const sanitized = sanitizePlayerName(action.payload.name);
      let alertMsg = state.alertMessage;

      // Deduplicate if name conflicts with another player
      const finalName = resolveDuplicateName(sanitized || target.name, state.players, target.id);
      if (sanitized && finalName !== sanitized) {
        alertMsg = {
          text: `Duplicate name resolved to "${finalName}".`,
          type: 'info',
        };
      }

      const updatedPlayers = state.players.map((p) => {
        if (p.id === action.payload.id) {
          return {
            ...p,
            name: finalName,
            isCustomName: Boolean(sanitized.length >= 2),
          };
        }
        return p;
      });

      savePartyRoster(updatedPlayers);

      return {
        ...state,
        players: updatedPlayers,
        alertMessage: alertMsg,
      };
    }

    case 'SET_PLAYER_COUNT': {
      const targetCount = Math.max(1, Math.min(action.payload.count, state.maxPlayers));
      if (targetCount === state.players.length) return state;

      let updatedPlayers = [...state.players];
      if (targetCount > updatedPlayers.length) {
        const needed = targetCount - updatedPlayers.length;
        for (let i = 0; i < needed; i++) {
          updatedPlayers.push(createNewPlayer(updatedPlayers));
        }
      } else {
        updatedPlayers = updatedPlayers.slice(0, targetCount);
      }

      const isValid = updatedPlayers.length >= state.minPlayers;
      const maxAllowedImposters = Math.max(1, Math.floor(updatedPlayers.length / 2));
      const adjustedImposters = Math.min(state.settings.impostersCount, maxAllowedImposters);
      const adjustedUndercover = Math.min(state.settings.undercoverCount || 1, maxAllowedImposters);
      savePartyRoster(updatedPlayers);

      return {
        ...state,
        players: updatedPlayers,
        settings: {
          ...state.settings,
          impostersCount: adjustedImposters,
          undercoverCount: adjustedUndercover,
        },
        validationError: isValid ? null : `Add at least ${state.minPlayers} players to start.`,
      };
    }

    case 'UPDATE_SETTINGS': {
      const maxAllowedImposters = Math.max(1, Math.floor(state.players.length / 2));
      const newImposters =
        action.payload.impostersCount !== undefined
          ? Math.min(action.payload.impostersCount, maxAllowedImposters)
          : state.settings.impostersCount;

      const newUndercover =
        action.payload.undercoverCount !== undefined
          ? Math.min(action.payload.undercoverCount, maxAllowedImposters)
          : state.settings.undercoverCount;

      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
          impostersCount: Math.max(1, newImposters),
          undercoverCount: newUndercover !== undefined ? Math.max(1, newUndercover) : 1,
        },
      };
    }

    case 'SET_MODE': {
      return {
        ...state,
        settings: {
          ...state.settings,
          mode: action.payload.mode,
        },
      };
    }

    case 'START_GAME': {
      if (state.players.length < state.minPlayers) {
        return {
          ...state,
          validationError: `Add at least ${state.minPlayers} players to start.`,
          alertMessage: { text: `Add at least ${state.minPlayers} players to start.`, type: 'warning' },
        };
      }

      const assigned = assignRoles(state.players, state.settings);

      setGameSessionActive(true);

      const roundSeconds = state.settings.roundTimeMinutes > 0 ? state.settings.roundTimeMinutes * 60 : 0;

      return {
        ...state,
        players: assigned.players,
        selectedWord: assigned.selectedWord,
        selectedWordPair: assigned.selectedWordPair,
        secretRoleAssigned: true,
        phase: 'ROLE_REVEAL',
        validationError: null,
        alertMessage: null,
        reveal: {
          currentRevealIndex: 0,
          isRevealed: false,
        },
        clue: {
          activeSpeakerIndex: 0,
          remainingSeconds: roundSeconds,
          isPaused: false,
        },
        voting: {
          currentVoterIndex: 0,
          isReadyToVote: false,
          selectedSuspectId: null,
          votes: {},
        },
        mrWhiteGuess: null,
        results: null,
        isInterrupted: false,
      };
    }

    case 'TOGGLE_REVEAL_ROLE': {
      return {
        ...state,
        reveal: {
          ...state.reveal,
          isRevealed: true,
        },
      };
    }

    case 'NEXT_REVEAL_PLAYER': {
      const nextIndex = state.reveal.currentRevealIndex + 1;
      if (nextIndex >= state.players.length) {
        // All players viewed their roles -> Proceed to CLUE_ROUND
        const roundSeconds = state.settings.roundTimeMinutes > 0 ? state.settings.roundTimeMinutes * 60 : 0;
        return {
          ...state,
          phase: 'CLUE_ROUND',
          reveal: {
            currentRevealIndex: 0,
            isRevealed: false,
          },
          clue: {
            activeSpeakerIndex: 0,
            remainingSeconds: roundSeconds,
            isPaused: false,
          },
        };
      }

      // Privacy scrubbing: isRevealed immediately set to false for next player
      return {
        ...state,
        reveal: {
          currentRevealIndex: nextIndex,
          isRevealed: false,
        },
      };
    }

    case 'NEXT_SPEAKER': {
      return {
        ...state,
        clue: {
          ...state.clue,
          activeSpeakerIndex: (state.clue.activeSpeakerIndex + 1) % state.players.length,
        },
      };
    }

    case 'TICK_CLUE_TIMER': {
      if (state.settings.roundTimeMinutes === 0 || state.clue.isPaused) {
        return state;
      }

      if (state.clue.remainingSeconds <= 1) {
        return {
          ...state,
          phase: 'VOTING',
          clue: {
            ...state.clue,
            remainingSeconds: 0,
          },
          voting: {
            currentVoterIndex: 0,
            isReadyToVote: false,
            selectedSuspectId: null,
            votes: {},
          },
        };
      }

      return {
        ...state,
        clue: {
          ...state.clue,
          remainingSeconds: state.clue.remainingSeconds - 1,
        },
      };
    }

    case 'TOGGLE_TIMER_PAUSE': {
      return {
        ...state,
        clue: {
          ...state.clue,
          isPaused: !state.clue.isPaused,
        },
      };
    }

    case 'SKIP_TO_VOTING': {
      return {
        ...state,
        phase: 'VOTING',
        voting: {
          currentVoterIndex: 0,
          isReadyToVote: false,
          selectedSuspectId: null,
          votes: {},
        },
      };
    }

    case 'SET_VOTER_READY': {
      return {
        ...state,
        voting: {
          ...state.voting,
          isReadyToVote: true,
          selectedSuspectId: null,
        },
      };
    }

    case 'SET_SELECTED_SUSPECT': {
      return {
        ...state,
        voting: {
          ...state.voting,
          selectedSuspectId: action.payload.suspectId,
        },
      };
    }

    case 'CONFIRM_VOTE': {
      const currentVoter = state.players[state.voting.currentVoterIndex];
      if (!currentVoter || !state.voting.selectedSuspectId) {
        return state;
      }

      const updatedVotes = {
        ...state.voting.votes,
        [currentVoter.id]: state.voting.selectedSuspectId,
      };

      const nextVoterIndex = state.voting.currentVoterIndex + 1;
      if (nextVoterIndex >= state.players.length) {
        // All votes recorded! Calculate outcome based on mode
        const mode = state.settings.mode;

        // MR. WHITE MODE
        if (mode === 'mr_white') {
          const tentativeResults = calculateGameResults(state.players, updatedVotes, 'mr_white');
          const eliminatedId = tentativeResults.mostVotedPlayerIds.length === 1 ? tentativeResults.mostVotedPlayerIds[0] : null;
          const eliminatedPlayer = eliminatedId ? state.players.find((p) => p.id === eliminatedId) : null;

          if (eliminatedPlayer?.role === 'mr_white') {
            // Mr. White is the single eliminated player!
            // Start private MR_WHITE_GUESS without exposing secret word!
            return {
              ...state,
              phase: 'MR_WHITE_GUESS',
              voting: {
                currentVoterIndex: 0,
                isReadyToVote: false,
                selectedSuspectId: null,
                votes: updatedVotes,
              },
              mrWhiteGuess: {
                mrWhitePlayerId: eliminatedPlayer.id,
                isReadyToGuess: false,
                submittedGuess: null,
                wasGuessCorrect: null,
              },
              results: tentativeResults,
            };
          }

          // If Mr. White is NOT the single eliminated player:
          // Normal voting outcome applies:
          // - Civilian eliminated -> IMPOSTER WINS
          // - Imposter eliminated (if present) -> GROUP WINS
          // - Voting tie -> IMPOSTER WINS
          return {
            ...state,
            phase: 'RESULTS',
            voting: {
              currentVoterIndex: 0,
              isReadyToVote: false,
              selectedSuspectId: null,
              votes: updatedVotes,
            },
            results: tentativeResults,
          };
        }

        // UNDERCOVER MODE
        if (mode === 'undercover') {
          const results = calculateGameResults(
            state.players,
            updatedVotes,
            'undercover',
            state.selectedWordPair
          );
          return {
            ...state,
            phase: 'RESULTS',
            voting: {
              currentVoterIndex: 0,
              isReadyToVote: false,
              selectedSuspectId: null,
              votes: updatedVotes,
            },
            results,
          };
        }

        // CLASSIC MODE (Default)
        const results = calculateGameResults(state.players, updatedVotes, 'classic');
        return {
          ...state,
          phase: 'RESULTS',
          voting: {
            currentVoterIndex: 0,
            isReadyToVote: false,
            selectedSuspectId: null,
            votes: updatedVotes,
          },
          results,
        };
      }

      // Privacy scrubbing: isReadyToVote reset to false and selectedSuspectId cleared
      return {
        ...state,
        voting: {
          ...state.voting,
          currentVoterIndex: nextVoterIndex,
          isReadyToVote: false,
          selectedSuspectId: null,
          votes: updatedVotes,
        },
      };
    }

    case 'SET_MR_WHITE_READY': {
      if (!state.mrWhiteGuess) return state;
      return {
        ...state,
        mrWhiteGuess: {
          ...state.mrWhiteGuess,
          isReadyToGuess: true,
        },
      };
    }

    case 'SUBMIT_MR_WHITE_GUESS': {
      if (!state.mrWhiteGuess || !state.selectedWord) return state;

      const guess = action.payload.guess;
      const isCorrect = isWordGuessCorrect(guess, state.selectedWord);

      const finalWinner = isCorrect ? ('mr_white' as const) : ('group' as const);

      const updatedResults = {
        ...(state.results || calculateGameResults(state.players, state.voting.votes, 'mr_white')),
        winner: finalWinner,
        mrWhiteGuessedWord: guess,
        wasMrWhiteGuessCorrect: isCorrect,
      };

      return {
        ...state,
        phase: 'RESULTS',
        mrWhiteGuess: {
          ...state.mrWhiteGuess,
          submittedGuess: guess,
          wasGuessCorrect: isCorrect,
        },
        results: updatedResults,
      };
    }

    case 'CALCULATE_RESULTS': {
      const results = calculateGameResults(
        state.players,
        state.voting.votes,
        state.settings.mode,
        state.selectedWordPair
      );
      return {
        ...state,
        phase: 'RESULTS',
        results,
      };
    }

    case 'PLAY_AGAIN': {
      const cleanPlayers = state.players.map((p) => ({
        ...p,
        role: undefined,
        secretWord: undefined,
      }));

      const assigned = assignRoles(cleanPlayers, state.settings);

      setGameSessionActive(true);

      const roundSeconds = state.settings.roundTimeMinutes > 0 ? state.settings.roundTimeMinutes * 60 : 0;

      return {
        ...state,
        players: assigned.players,
        selectedWord: assigned.selectedWord,
        selectedWordPair: assigned.selectedWordPair,
        secretRoleAssigned: true,
        phase: 'ROLE_REVEAL',
        activeRound: state.activeRound + 1,
        validationError: null,
        alertMessage: null,
        reveal: {
          currentRevealIndex: 0,
          isRevealed: false,
        },
        clue: {
          activeSpeakerIndex: 0,
          remainingSeconds: roundSeconds,
          isPaused: false,
        },
        voting: {
          currentVoterIndex: 0,
          isReadyToVote: false,
          selectedSuspectId: null,
          votes: {},
        },
        mrWhiteGuess: null,
        results: null,
        isInterrupted: false,
      };
    }

    case 'QUIT_TO_LOBBY': {
      setGameSessionActive(false);
      const cleanPlayers = state.players.map((p) => ({
        ...p,
        role: undefined,
        secretWord: undefined,
      }));

      return {
        ...state,
        phase: 'PLAYER_SETUP',
        players: cleanPlayers,
        selectedWord: undefined,
        selectedWordPair: undefined,
        secretRoleAssigned: false,
        mrWhiteGuess: null,
        results: null,
        isInterrupted: false,
        reveal: { currentRevealIndex: 0, isRevealed: false },
        voting: { currentVoterIndex: 0, isReadyToVote: false, selectedSuspectId: null, votes: {} },
      };
    }

    case 'RESET_INTERRUPTED_GAME': {
      setGameSessionActive(false);
      const cleanPlayers = state.players.map((p) => ({
        ...p,
        role: undefined,
        secretWord: undefined,
      }));

      return {
        ...state,
        phase: 'PLAYER_SETUP',
        players: cleanPlayers,
        selectedWord: undefined,
        selectedWordPair: undefined,
        secretRoleAssigned: false,
        mrWhiteGuess: null,
        results: null,
        isInterrupted: false,
        reveal: { currentRevealIndex: 0, isRevealed: false },
        voting: { currentVoterIndex: 0, isReadyToVote: false, selectedSuspectId: null, votes: {} },
      };
    }

    case 'RESET_GAME': {
      setGameSessionActive(false);
      clearSavedRoster();
      return {
        ...initialGameState,
        players: createDefaultPlayers(),
      };
    }

    case 'SET_ALERT': {
      return {
        ...state,
        alertMessage: action.payload,
      };
    }

    case 'TRANSITION_PHASE': {
      return {
        ...state,
        phase: action.payload.phase,
      };
    }

    default:
      return state;
  }
}
