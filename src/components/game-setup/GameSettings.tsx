import React from 'react';
import { useGame } from '../../game/state/gameContext';
import type { CategoryId, GameMode } from '../../game/types/gameState';
import { CATEGORIES_META } from '../../game/words/wordDatabase';
import './GameSettings.css';

export const GameSettings: React.FC = () => {
  const { state, updateSettings, setMode } = useGame();
  const maxAllowedImposters = Math.max(1, Math.floor(state.players.length / 2));

  // Imposter count choices
  const imposterChoices = Array.from({ length: maxAllowedImposters }, (_, i) => i + 1);

  return (
    <div className="game-settings-stack">
      {/* 1. Game Mode */}
      <div className="setting-item-group">
        <div className="setting-item-header">
          <span className="setting-item-icon" aria-hidden="true">🎮</span>
          <span>Game Mode</span>
        </div>
        <div className="setting-dropdown-box">
          <select
            className="setting-select-element"
            value={state.settings.mode}
            onChange={(e) => setMode(e.target.value as GameMode)}
            aria-label="Game Mode"
          >
            <option value="classic">Classic</option>
            <option value="undercover">Undercover</option>
            <option value="mr_white">Mr. White</option>
            <option value="chaos" disabled>Chaos (Soon)</option>
          </select>
          <span className="setting-dropdown-arrow" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        <span className="setting-helper-text">
          {state.settings.mode === 'classic' && 'Imposters receive no word.'}
          {state.settings.mode === 'undercover' && 'Civilians get Word A, Undercover gets Word B.'}
          {state.settings.mode === 'mr_white' && 'Mr. White receives no word and guesses to steal the win.'}
          {state.settings.mode === 'chaos' && 'Chaos modifiers (coming soon).'}
        </span>
      </div>

      {/* 2. Word Category */}
      <div className="setting-item-group">
        <div className="setting-item-header">
          <span className="setting-item-icon" aria-hidden="true">🏷️</span>
          <span>Category</span>
        </div>
        <div className="setting-dropdown-box">
          <select
            className="setting-select-element"
            value={state.settings.category}
            onChange={(e) => updateSettings({ category: e.target.value as CategoryId })}
            aria-label="Word Category"
          >
            {CATEGORIES_META.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}
              </option>
            ))}
          </select>
          <span className="setting-dropdown-arrow" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        <span className="setting-helper-text">A mix of fun party words and pairs.</span>
      </div>

      {/* 3. Imposters or Undercover Count */}
      {state.settings.mode === 'undercover' ? (
        <div className="setting-item-group">
          <div className="setting-item-header">
            <span className="setting-item-icon" aria-hidden="true">🕵️</span>
            <span>Undercover Players</span>
          </div>
          <div className="setting-dropdown-box">
            <select
              className="setting-select-element"
              value={state.settings.undercoverCount || 1}
              onChange={(e) => updateSettings({ undercoverCount: parseInt(e.target.value, 10) })}
              aria-label="Number of Undercover Players"
            >
              {Array.from({ length: Math.max(1, Math.floor((state.players.length - 1) / 2)) }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Undercover' : 'Undercover Players'}
                </option>
              ))}
            </select>
            <span className="setting-dropdown-arrow" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
          <span className="setting-helper-text">
            {(state.settings.undercoverCount || 1) === 1
              ? '1 player receives paired Word B stealthily.'
              : `${state.settings.undercoverCount || 1} players receive paired Word B stealthily.`}
          </span>
        </div>
      ) : (
        <div className="setting-item-group">
          <div className="setting-item-header">
            <span className="setting-item-icon" aria-hidden="true">🎭</span>
            <span>{state.settings.mode === 'mr_white' ? 'Imposters (+1 Mr. White)' : 'Imposters'}</span>
          </div>
          <div className="setting-dropdown-box">
            <select
              className="setting-select-element"
              value={state.settings.impostersCount}
              onChange={(e) => updateSettings({ impostersCount: parseInt(e.target.value, 10) })}
              aria-label="Number of Imposters"
            >
              {imposterChoices.map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Imposter' : 'Imposters'}
                </option>
              ))}
            </select>
            <span className="setting-dropdown-arrow" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
          <span className="setting-helper-text">
            {state.settings.mode === 'mr_white'
              ? `${state.settings.impostersCount} Imposter(s) + 1 Mr. White receive no word.`
              : state.settings.impostersCount === 1
              ? '1 player receives no word.'
              : `${state.settings.impostersCount} players receive no word.`}
          </span>
        </div>
      )}

      {/* 4. Round Time */}
      <div className="setting-item-group">
        <div className="setting-item-header">
          <span className="setting-item-icon" aria-hidden="true">⏱️</span>
          <span>Round Time</span>
        </div>
        <div className="setting-dropdown-box">
          <select
            className="setting-select-element"
            value={state.settings.roundTimeMinutes}
            onChange={(e) => updateSettings({ roundTimeMinutes: parseInt(e.target.value, 10) })}
            aria-label="Round Time"
          >
            <option value="1">1 minute</option>
            <option value="2">2 minutes</option>
            <option value="3">3 minutes</option>
            <option value="5">5 minutes</option>
            <option value="0">Unlimited</option>
          </select>
          <span className="setting-dropdown-arrow" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        <span className="setting-helper-text">Recommended discussion time.</span>
      </div>
    </div>
  );
};
