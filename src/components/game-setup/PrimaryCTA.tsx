import React from 'react';
import { useGame } from '../../game/state/gameContext';
import './PrimaryCTA.css';

export const PrimaryCTA: React.FC = () => {
  const { state, startGame } = useGame();
  const isEligible = state.players.length >= state.minPlayers;

  return (
    <div className="cta-action-area">
      <button
        type="button"
        id="btn-start-game"
        className="start-button-main"
        onClick={startGame}
        disabled={!isEligible}
        aria-disabled={!isEligible}
        aria-label="Start Game"
      >
        <span className="start-button-icon" aria-hidden="true">▶</span>
        <span>Start Game</span>
      </button>

      {isEligible ? (
        <p className="cta-microcopy">
          No signup needed • Free to play
          <span className="microcopy-extra"> • Works on any device</span>
        </p>
      ) : (
        <div className="cta-validation-error-badge" role="status">
          <span aria-hidden="true">ℹ️</span>
          <span>Add at least {state.minPlayers} players to start.</span>
        </div>
      )}
    </div>
  );
};
