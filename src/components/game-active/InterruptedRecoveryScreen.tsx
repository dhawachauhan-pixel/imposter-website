import React from 'react';
import { useGame } from '../../game/state/gameContext';
import { Button } from '../common/Button';
import './InterruptedRecoveryScreen.css';

export const InterruptedRecoveryScreen: React.FC = () => {
  const { resetInterruptedGame } = useGame();

  return (
    <div className="interrupted-screen-container" role="region" aria-label="Game Interrupted Notice">
      <div className="interrupted-badge-icon" aria-hidden="true">
        🔒
      </div>
      <h2 className="interrupted-title">Game Interrupted</h2>
      <p className="interrupted-text">
        An active game was interrupted by a page refresh. Roles and secret words are kept hidden for fairness.
      </p>
      <div className="interrupted-privacy-note">
        <span aria-hidden="true">🛡️</span>
        <span>Your previous player roster is safely preserved.</span>
      </div>
      <Button variant="primary" size="lg" onClick={resetInterruptedGame}>
        Return to Lobby
      </Button>
    </div>
  );
};
