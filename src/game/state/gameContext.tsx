/**
 * Centralized Game Context & State Provider
 * Manages game state and actions via gameReducer
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { GameState, GameAction } from '../types/gameState';
import {
  gameReducer,
  initialGameState,
  checkWasGameInterrupted,
} from './gameReducer';

export interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  addPlayer: (name?: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, name: string) => void;
  setPlayerCount: (count: number) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  setMode: (mode: GameState['settings']['mode']) => void;
  startGame: () => void;
  resetGame: () => void;
  dismissAlert: () => void;
  // Phase 2 Action helpers:
  toggleRevealRole: () => void;
  nextRevealPlayer: () => void;
  nextSpeaker: () => void;
  tickClueTimer: () => void;
  toggleTimerPause: () => void;
  skipToVoting: () => void;
  setVoterReady: () => void;
  setSelectedSuspect: (suspectId: string) => void;
  confirmVote: () => void;
  playAgain: () => void;
  quitToLobby: () => void;
  resetInterruptedGame: () => void;
  // Phase 3A Mr. White helpers:
  setMrWhiteReady: () => void;
  submitMrWhiteGuess: (guess: string) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state; if active game was interrupted by reload, mark isInterrupted
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    const wasInterrupted = checkWasGameInterrupted();
    if (wasInterrupted) {
      return {
        ...initialGameState,
        isInterrupted: true,
      };
    }
    return initialGameState;
  });

  // Auto-validate on player count change
  useEffect(() => {
    if (state.players.length < state.minPlayers && !state.validationError) {
      dispatch({
        type: 'SET_ALERT',
        payload: { text: `Add at least ${state.minPlayers} players to start.`, type: 'info' },
      });
    }
  }, [state.players.length, state.minPlayers, state.validationError]);

  const addPlayer = (name?: string) => dispatch({ type: 'ADD_PLAYER', payload: { name } });
  const removePlayer = (id: string) => dispatch({ type: 'REMOVE_PLAYER', payload: { id } });
  const updatePlayerName = (id: string, name: string) => dispatch({ type: 'UPDATE_PLAYER_NAME', payload: { id, name } });
  const setPlayerCount = (count: number) => dispatch({ type: 'SET_PLAYER_COUNT', payload: { count } });
  const updateSettings = (settings: Partial<GameState['settings']>) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  const setMode = (mode: GameState['settings']['mode']) => dispatch({ type: 'SET_MODE', payload: { mode } });
  const startGame = () => dispatch({ type: 'START_GAME' });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });
  const dismissAlert = () => dispatch({ type: 'SET_ALERT', payload: null });

  // Phase 2 helpers
  const toggleRevealRole = () => dispatch({ type: 'TOGGLE_REVEAL_ROLE' });
  const nextRevealPlayer = () => dispatch({ type: 'NEXT_REVEAL_PLAYER' });
  const nextSpeaker = () => dispatch({ type: 'NEXT_SPEAKER' });
  const tickClueTimer = () => dispatch({ type: 'TICK_CLUE_TIMER' });
  const toggleTimerPause = () => dispatch({ type: 'TOGGLE_TIMER_PAUSE' });
  const skipToVoting = () => dispatch({ type: 'SKIP_TO_VOTING' });
  const setVoterReady = () => dispatch({ type: 'SET_VOTER_READY' });
  const setSelectedSuspect = (suspectId: string) => dispatch({ type: 'SET_SELECTED_SUSPECT', payload: { suspectId } });
  const confirmVote = () => dispatch({ type: 'CONFIRM_VOTE' });
  const playAgain = () => dispatch({ type: 'PLAY_AGAIN' });
  const quitToLobby = () => dispatch({ type: 'QUIT_TO_LOBBY' });
  const resetInterruptedGame = () => dispatch({ type: 'RESET_INTERRUPTED_GAME' });
  const setMrWhiteReady = () => dispatch({ type: 'SET_MR_WHITE_READY' });
  const submitMrWhiteGuess = (guess: string) => dispatch({ type: 'SUBMIT_MR_WHITE_GUESS', payload: { guess } });

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        addPlayer,
        removePlayer,
        updatePlayerName,
        setPlayerCount,
        updateSettings,
        setMode,
        startGame,
        resetGame,
        dismissAlert,
        toggleRevealRole,
        nextRevealPlayer,
        nextSpeaker,
        tickClueTimer,
        toggleTimerPause,
        skipToVoting,
        setVoterReady,
        setSelectedSuspect,
        confirmVote,
        playAgain,
        quitToLobby,
        resetInterruptedGame,
        setMrWhiteReady,
        submitMrWhiteGuess,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
