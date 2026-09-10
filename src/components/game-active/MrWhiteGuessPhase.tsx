import React, { useState } from 'react';
import { useGame } from '../../game/state/gameContext';
import { Button } from '../common/Button';
import './MrWhiteGuessPhase.css';

export const MrWhiteGuessPhase: React.FC = () => {
  const { state, setMrWhiteReady, submitMrWhiteGuess } = useGame();
  const [guessInput, setGuessInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mrWhitePlayer = state.players.find((p) => p.role === 'mr_white') || state.players[0];
  const isReady = state.mrWhiteGuess?.isReadyToGuess;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = guessInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a word guess before submitting.');
      return;
    }
    setErrorMsg(null);
    submitMrWhiteGuess(trimmed);
  };

  return (
    <div className="mr-white-guess-container" role="region" aria-label="Mr. White Guess Phase">
      {!isReady ? (
        /* 1. Private Pass Screen */
        <div className="mr-white-guess-card">
          <div className="mr-white-badge-icon" aria-hidden="true">
            🕵️‍♂️
          </div>
          <h2 className="mr-white-pass-title">
            Pass the device to <span className="mr-white-player-name">{mrWhitePlayer.name}</span>
          </h2>
          <p className="mr-white-pass-instruction">
            You were voted out! But as Mr. White, you have one final chance to deduce the secret word and steal victory.
          </p>
          <div className="mr-white-action-wrapper">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={setMrWhiteReady}
              data-testid="ready-mr-white-button"
            >
              👁️ I'm Ready to Guess
            </Button>
          </div>
        </div>
      ) : (
        /* 2. Secret Word Guess Input Screen */
        <form className="mr-white-guess-card" onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="mr-white-header-badge">
            <span aria-hidden="true">🎯</span>
            <span>MR. WHITE'S FINAL CHANCE</span>
          </div>
          <h2 className="mr-white-guess-title">Can You Name the Secret Word?</h2>
          <p className="mr-white-guess-subtitle">
            Enter the secret word below. If your guess matches, you win the game!
          </p>

          <div className="mr-white-input-wrapper">
            <input
              type="text"
              autoFocus
              className="mr-white-guess-input"
              placeholder="Enter secret word..."
              value={guessInput}
              onChange={(e) => {
                setGuessInput(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              data-testid="mr-white-guess-input"
              aria-label="Secret Word Guess"
            />
            {errorMsg && <div className="mr-white-validation-msg">{errorMsg}</div>}
          </div>

          <div className="mr-white-action-wrapper">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              data-testid="submit-mr-white-guess-button"
            >
              🔒 Submit Final Guess
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
