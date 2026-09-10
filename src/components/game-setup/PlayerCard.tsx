import React from 'react';
import type { Player } from '../../game/types/gameState';
import { useGame } from '../../game/state/gameContext';
import './PlayerCard.css';

export interface PlayerCardProps {
  player: Player;
  index: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, index }) => {
  const { updatePlayerName, removePlayer } = useGame();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePlayerName(player.id, e.target.value);
  };

  const label = `Player ${index + 1}`;

  return (
    <div className="player-row" role="listitem">
      <span className="player-row-label">{label}</span>
      <div className="player-input-box">
        <input
          type="text"
          className="player-name-field"
          value={player.name}
          onChange={handleNameChange}
          placeholder={label}
          maxLength={20}
          aria-label={`${label} name`}
        />
      </div>
      <button
        type="button"
        className="player-delete-btn"
        onClick={() => removePlayer(player.id)}
        aria-label={`Remove ${player.name}`}
        title={`Remove ${player.name}`}
      >
        ×
      </button>
    </div>
  );
};
