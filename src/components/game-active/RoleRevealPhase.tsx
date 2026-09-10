import React from 'react';
import { useGame } from '../../game/state/gameContext';
import { Button } from '../common/Button';
import './RoleRevealPhase.css';

export const RoleRevealPhase: React.FC = () => {
  const { state, toggleRevealRole, nextRevealPlayer } = useGame();
  const { reveal, players } = state;
  const currentPlayer = players[reveal.currentRevealIndex];

  if (!currentPlayer) {
    return null;
  }

  const isImposter = currentPlayer.role === 'imposter';
  const isMrWhite = currentPlayer.role === 'mr_white';
  const isUndercover = currentPlayer.role === 'undercover';
  const isLastPlayer = reveal.currentRevealIndex === players.length - 1;

  // Determine card style class and badge text
  let cardClass = 'civilian';
  let badgeIcon = '🛡️';
  let badgeLabel = 'CIVILIAN';

  if (isImposter) {
    cardClass = 'imposter';
    badgeIcon = '🎭';
    badgeLabel = 'IMPOSTER';
  } else if (isMrWhite) {
    cardClass = 'mr_white';
    badgeIcon = '🕵️‍♂️';
    badgeLabel = 'MR. WHITE';
  } else if (isUndercover) {
    // True stealth: Undercover players see standard Civilian styling and are unaware they are Undercover
    cardClass = 'civilian';
    badgeIcon = '🛡️';
    badgeLabel = 'CIVILIAN';
  }

  return (
    <div className="role-reveal-container" role="region" aria-label="Role Reveal Phase">
      {/* 1. Progress Indicator */}
      <div className="reveal-progress-tracker">
        Player {reveal.currentRevealIndex + 1} of {players.length}
      </div>

      {/* 2. Privacy Pass Screen (State when role is NOT revealed) */}
      {!reveal.isRevealed ? (
        <div className="reveal-pass-card">
          <div
            className="pass-avatar-wrapper"
            style={{ backgroundColor: currentPlayer.avatarColor }}
            aria-hidden="true"
          >
            {currentPlayer.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="pass-headline">
            Pass the device to <span className="pass-player-name">{currentPlayer.name}</span>
          </h2>
          <p className="pass-instruction">
            Make sure only you can see the screen before tapping to reveal your secret role.
          </p>
          <div className="pass-privacy-badge">
            <span aria-hidden="true">🛡️</span>
            <span>Private & Confidential</span>
          </div>
          <div className="reveal-actions-wrapper">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={toggleRevealRole}
              data-testid="reveal-role-button"
            >
              👁️ I'm Ready — Tap to Reveal
            </Button>
          </div>
        </div>
      ) : (
        /* 3. Revealed Role Card (Only rendered when isRevealed is TRUE) */
        <div className="reveal-pass-card">
          <div
            className={`secret-role-card ${cardClass}`}
            data-testid="revealed-role-card"
          >
            <div className={`role-badge ${cardClass}`}>
              <span aria-hidden="true">{badgeIcon}</span>
              <span>{badgeLabel}</span>
            </div>

            <div className="word-reveal-group">
              <div className="word-label">
                {isImposter || isMrWhite ? 'Status' : 'Your Secret Word'}
              </div>
              {isImposter || isMrWhite ? (
                <div className="imposter-word-placeholder">
                  {isMrWhite
                    ? 'You have NO secret word!'
                    : 'You did not receive the secret word!'}
                </div>
              ) : (
                <div className="revealed-secret-word" data-testid="secret-word-display">
                  {currentPlayer.secretWord}
                </div>
              )}
            </div>

            <p className="role-instruction-text">
              {isMrWhite
                ? "Listen carefully to everyone's clues, blend in, and figure out the word without getting caught."
                : isImposter
                ? "Listen carefully to everyone's clues, blend in with the group, and figure out the word without getting caught."
                : 'Give subtle clues about this word. Do not say the word directly or make it too obvious to the infiltrators.'}
            </p>
          </div>

          <div className="reveal-actions-wrapper">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={nextRevealPlayer}
              data-testid="hide-role-button"
            >
              🔒 {isLastPlayer ? 'Hide & Start Clue Round' : 'Hide & Pass Phone'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
