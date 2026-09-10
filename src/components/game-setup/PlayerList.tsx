import React from 'react';
import { useGame } from '../../game/state/gameContext';
import { PlayerCard } from './PlayerCard';
import './PlayerList.css';

export const PlayerList: React.FC = () => {
  const { state, addPlayer, resetGame } = useGame();
  const isMax = state.players.length >= state.maxPlayers;
  const hasCustomNames = state.players.some((p) => p.isCustomName);

  return (
    <div className="player-list-box">
      <div className="player-rows-stack" role="list" aria-label="Players list">
        {state.players.map((player, index) => (
          <PlayerCard key={player.id} player={player} index={index} />
        ))}
      </div>

      <div className="player-actions-row">
        <button
          type="button"
          className="add-player-action-btn"
          onClick={() => addPlayer()}
          disabled={isMax}
          aria-label="Add Player"
        >
          <svg
            className="add-player-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          <span>Add Player</span>
        </button>

        {hasCustomNames && (
          <button
            type="button"
            className="reset-names-action-btn"
            onClick={() => resetGame()}
            aria-label="Reset Player Names"
            title="Reset names to default"
          >
            <span aria-hidden="true">↺</span>
            <span>Reset Names</span>
          </button>
        )}
      </div>
    </div>
  );
};
