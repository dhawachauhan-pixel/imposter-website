import React from 'react';
import { useGame } from '../../game/state/gameContext';
import { useI18n } from '../../i18n/I18nContext';
import type { GameMode } from '../../game/types/gameState';
import './GameModeSelector.css';

interface ModeOption {
  id: GameMode;
  name: string;
  isAvailable: boolean;
}

const MODES: ModeOption[] = [
  { id: 'classic', name: 'Classic', isAvailable: true },
  { id: 'undercover', name: 'Undercover', isAvailable: true },
  { id: 'mr_white', name: 'Mr. White', isAvailable: true },
  { id: 'chaos', name: 'Chaos', isAvailable: false },
];

export const GameModeSelector: React.FC = () => {
  const { state, setMode } = useGame();
  const { t } = useI18n();

  return (
    <div className="game-mode-selector">
      <span className="mode-selector-label">{t.gameSetup.gameMode}</span>
      <div className="mode-pills-grid" role="radiogroup" aria-label="Select Game Mode">
        {MODES.map((mode) => {
          const isActive = state.settings.mode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              className={`mode-pill ${isActive ? 'is-active' : ''} ${!mode.isAvailable ? 'is-disabled' : ''}`}
              onClick={() => {
                if (mode.isAvailable) {
                  setMode(mode.id);
                }
              }}
              role="radio"
              aria-checked={isActive}
              aria-disabled={!mode.isAvailable}
              title={mode.isAvailable ? mode.name : `${mode.name} (Coming Soon)`}
            >
              <div className="mode-pill-header">
                <span className="mode-name">{mode.name}</span>
                {mode.isAvailable ? (
                  <span className="mode-pill-tag active-tag">Ready</span>
                ) : (
                  <span className="mode-pill-tag soon-tag">Soon</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
