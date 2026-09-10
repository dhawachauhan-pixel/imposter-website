import React from 'react';
import { useGame } from '../../game/state/gameContext';
import { Button } from '../common/Button';
import './VotingPhase.css';

export const VotingPhase: React.FC = () => {
  const {
    state,
    setVoterReady,
    setSelectedSuspect,
    confirmVote,
  } = useGame();
  const { voting, players } = state;
  const currentVoter = players[voting.currentVoterIndex];

  if (!currentVoter) {
    return null;
  }

  // Suspect options exclude the active voter
  const suspectCandidates = players.filter((p) => p.id !== currentVoter.id);
  const isLastVoter = voting.currentVoterIndex === players.length - 1;

  return (
    <div className="voting-phase-container" role="region" aria-label="Secret Voting Phase">
      {/* 1. Progress Indicator */}
      <div className="voting-progress-tag">
        Voter {voting.currentVoterIndex + 1} of {players.length}
      </div>

      {/* 2. Pass Screen (shown before ballot is displayed) */}
      {!voting.isReadyToVote ? (
        <div className="voting-pass-card">
          <div
            className="vote-pass-avatar"
            style={{ backgroundColor: currentVoter.avatarColor }}
            aria-hidden="true"
          >
            {currentVoter.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="vote-pass-title">
            Pass the device to <span className="vote-voter-name">{currentVoter.name}</span>
          </h2>
          <p className="vote-pass-instruction">
            Your vote is completely secret. Make sure only you are looking at the screen.
          </p>
          <div className="voting-action-wrapper">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={setVoterReady}
              data-testid="ready-to-vote-button"
            >
              🗳️ I'm Ready to Vote
            </Button>
          </div>
        </div>
      ) : (
        /* 3. Secret Ballot Screen */
        <div className="voting-ballot-card">
          <div className="ballot-header-group">
            <h2 className="ballot-title">Who is the Imposter?</h2>
            <p className="ballot-subtitle">
              Select the player you suspect most, then confirm your vote.
            </p>
          </div>

          <div className="suspects-list" role="radiogroup" aria-label="Suspect Candidates">
            {suspectCandidates.map((candidate) => {
              const isSelected = voting.selectedSuspectId === candidate.id;
              return (
                <button
                  key={candidate.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`suspect-option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedSuspect(candidate.id)}
                  data-testid={`suspect-${candidate.id}`}
                >
                  <div className="suspect-info">
                    <div
                      className="suspect-avatar"
                      style={{ backgroundColor: candidate.avatarColor }}
                      aria-hidden="true"
                    >
                      {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="suspect-name">{candidate.name}</span>
                  </div>
                  <div className="suspect-check-indicator" aria-hidden="true">
                    {isSelected ? '🎯' : '○'}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="voting-action-wrapper">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!voting.selectedSuspectId}
              onClick={confirmVote}
              data-testid="confirm-vote-button"
            >
              {isLastVoter ? '🔒 Submit Final Vote & See Results' : '🔒 Confirm Secret Vote'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
