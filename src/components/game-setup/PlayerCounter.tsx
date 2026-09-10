import React from 'react';
import { useGame } from '../../game/state/gameContext';
import './PlayerCounter.css';

export const PlayerCounter: React.FC = () => {
  const { state, setPlayerCount } = useGame();
  const count = state.players.length;

  const decrement = () => {
    if (count > 1) {
      setPlayerCount(count - 1);
    }
  };

  const increment = () => {
    if (count < state.maxPlayers) {
      setPlayerCount(count + 1);
    }
  };

  return (
    <div className="player-counter-stepper" aria-label="Player count stepper">
      <button
        type="button"
        className="counter-btn"
        onClick={decrement}
        disabled={count <= 1}
        aria-label="Decrease player count"
      >
        −
      </button>
      <span className="counter-value-num" aria-live="polite">
        {count}
      </span>
      <button
        type="button"
        className="counter-btn counter-btn-primary"
        onClick={increment}
        disabled={count >= state.maxPlayers}
        aria-label="Increase player count"
      >
        +
      </button>
    </div>
  );
};
