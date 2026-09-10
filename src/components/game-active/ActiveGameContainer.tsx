import React, { useState, useEffect } from 'react';
import { useGame } from '../../game/state/gameContext';
import { RoleRevealPhase } from './RoleRevealPhase';
import { ClueRoundPhase } from './ClueRoundPhase';
import { VotingPhase } from './VotingPhase';
import { ResultsPhase } from './ResultsPhase';
import { MrWhiteGuessPhase } from './MrWhiteGuessPhase';
import { InterruptedRecoveryScreen } from './InterruptedRecoveryScreen';
import { QuitConfirmModal } from './QuitConfirmModal';
import { wakeLock } from '../../game/utils/wakeLock';
import './ActiveGameContainer.css';

export const ActiveGameContainer: React.FC = () => {
  const { state, quitToLobby } = useGame();
  const [showQuitModal, setShowQuitModal] = useState(false);

  useEffect(() => {
    wakeLock.request();
    return () => {
      wakeLock.release();
    };
  }, []);

  const getPhaseTitle = () => {
    if (state.isInterrupted) return 'INTERRUPTED';
    switch (state.phase) {
      case 'ROLE_REVEAL':
        return 'ROLE REVEAL';
      case 'CLUE_ROUND':
      case 'CLUE_PHASE':
        return 'CLUE ROUND';
      case 'VOTING':
        return 'SECRET VOTING';
      case 'MR_WHITE_GUESS':
        return 'MR. WHITE GUESS';
      case 'RESULTS':
      case 'RESULT':
        return 'ROUND RESULTS';
      default:
        return 'ACTIVE GAME';
    }
  };

  return (
    <div className="active-game-wrapper" data-testid="active-game-container">
      {/* Top Meta Bar */}
      <div className="active-game-header-bar">
        <div className="game-meta-group">
          <span className="round-pill">ROUND {state.activeRound}</span>
          <span className="phase-pill">{getPhaseTitle()}</span>
        </div>

        {!state.isInterrupted && (
          <button
            type="button"
            className="quit-game-btn"
            onClick={() => setShowQuitModal(true)}
            data-testid="open-quit-modal"
            aria-label="Quit to Lobby"
          >
            <span aria-hidden="true">✕</span>
            <span>Quit</span>
          </button>
        )}
      </div>

      {/* Main Active Phase View */}
      <div className="active-game-content-card">
        {state.isInterrupted ? (
          <InterruptedRecoveryScreen />
        ) : state.phase === 'ROLE_REVEAL' ? (
          <RoleRevealPhase />
        ) : state.phase === 'CLUE_ROUND' || state.phase === 'CLUE_PHASE' ? (
          <ClueRoundPhase />
        ) : state.phase === 'VOTING' ? (
          <VotingPhase />
        ) : state.phase === 'MR_WHITE_GUESS' ? (
          <MrWhiteGuessPhase />
        ) : state.phase === 'RESULTS' || state.phase === 'RESULT' ? (
          <ResultsPhase />
        ) : (
          <RoleRevealPhase />
        )}
      </div>

      {/* Exit confirmation modal */}
      <QuitConfirmModal
        isOpen={showQuitModal}
        onConfirm={() => {
          setShowQuitModal(false);
          quitToLobby();
        }}
        onCancel={() => setShowQuitModal(false)}
      />
    </div>
  );
};
