import React, { useEffect } from 'react';
import { useGame } from '../../game/state/gameContext';
import { formatTime } from '../../game/state/gameLogic';
import { Button } from '../common/Button';
import './ClueRoundPhase.css';

export const ClueRoundPhase: React.FC = () => {
  const {
    state,
    tickClueTimer,
    toggleTimerPause,
    nextSpeaker,
    skipToVoting,
  } = useGame();
  const { clue, settings, players } = state;

  const isUnlimited = settings.roundTimeMinutes === 0;
  const currentSpeaker = players[clue.activeSpeakerIndex] || players[0];
  const isWarningTime = !isUnlimited && clue.remainingSeconds <= 30 && clue.remainingSeconds > 0;

  // Countdown timer interval with proper cleanup
  useEffect(() => {
    if (isUnlimited || clue.isPaused) return;

    const intervalId = setInterval(() => {
      tickClueTimer();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isUnlimited, clue.isPaused, tickClueTimer]);

  return (
    <div className="clue-round-container" role="region" aria-label="Clue Round Phase">
      {/* 1. Header */}
      <div className="clue-header-badge">
        <span aria-hidden="true">🎤</span>
        <span>CLUE ROUND</span>
      </div>
      <h2 className="clue-round-title">Give One-Word Clues</h2>
      <p className="clue-round-subtitle">
        Take turns giving a single word clue related to the secret. Imposters must bluff to fit in!
      </p>

      {/* 2. Timer Card */}
      <div className="clue-timer-card">
        <div className="timer-digits-group">
          <div className="timer-label">Round Timer</div>
          <div
            className={`timer-digits ${isWarningTime ? 'warning' : ''}`}
            aria-live="polite"
          >
            {isUnlimited ? '∞ Unlimited' : formatTime(clue.remainingSeconds)}
          </div>
        </div>

        {!isUnlimited && (
          <div className="timer-controls">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTimerPause}
              aria-label={clue.isPaused ? 'Resume Timer' : 'Pause Timer'}
            >
              {clue.isPaused ? '▶ Resume' : '⏸ Pause'}
            </Button>
          </div>
        )}
      </div>

      {/* 3. Active Speaker Spotlight */}
      <div className="speaker-section">
        <div className="active-speaker-spotlight">
          <div
            className="speaker-avatar-circle"
            style={{ backgroundColor: currentSpeaker.avatarColor }}
            aria-hidden="true"
          >
            {currentSpeaker.name.charAt(0).toUpperCase()}
          </div>
          <div className="speaker-turn-tag">Active Speaker</div>
          <div className="speaker-name">{currentSpeaker.name}'s Turn</div>
          <Button variant="outline" size="sm" onClick={nextSpeaker}>
            Next Speaker →
          </Button>
        </div>

        {/* 4. Speaker Roster Order */}
        <div className="speaker-roster-list" role="list" aria-label="Speaker Order">
          {players.map((p, idx) => {
            const isActive = idx === clue.activeSpeakerIndex;
            return (
              <div
                key={p.id}
                role="listitem"
                className={`speaker-chip ${isActive ? 'active' : ''}`}
              >
                <span
                  className="speaker-chip-dot"
                  style={{ backgroundColor: p.avatarColor }}
                  aria-hidden="true"
                />
                <span>
                  {idx + 1}. {p.name}
                </span>
                {isActive && <span aria-hidden="true"> 🎤</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Primary Action */}
      <div className="clue-action-row">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={skipToVoting}
          data-testid="proceed-to-voting-button"
        >
          🗳️ Proceed to Voting
        </Button>
      </div>
    </div>
  );
};
