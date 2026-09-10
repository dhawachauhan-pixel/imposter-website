import React from 'react';
import { useGame } from '../../game/state/gameContext';
import { Button } from '../common/Button';
import './ResultsPhase.css';

export const ResultsPhase: React.FC = () => {
  const { state, playAgain, quitToLobby } = useGame();
  const { results, players, selectedWord, settings } = state;

  if (!results) {
    return null;
  }

  const isGroupWin = results.winner === 'group';
  const isMrWhiteWin = results.winner === 'mr_white';
  const isUndercoverWin = results.winner === 'undercover';
  const isImposterWin = results.winner === 'imposter';

  const imposters = players.filter((p) => p.role === 'imposter');
  const mrWhite = players.find((p) => p.role === 'mr_white');

  let bannerClass = 'group-wins';
  let bannerIcon = '🏆';
  let bannerTitle = settings.mode === 'undercover' ? 'CIVILIANS WIN!' : 'GROUP WINS!';

  if (isMrWhiteWin) {
    bannerClass = 'mr-white-wins';
    bannerIcon = '🕵️‍♂️';
    bannerTitle = 'MR. WHITE WINS!';
  } else if (isUndercoverWin) {
    bannerClass = 'undercover-wins';
    bannerIcon = '🤫';
    bannerTitle = 'UNDERCOVER WINS!';
  } else if (isImposterWin) {
    bannerClass = 'imposter-wins';
    bannerIcon = '🎭';
    bannerTitle = 'IMPOSTER WINS!';
  }

  const getSubtitle = () => {
    if (results.wasMrWhiteGuessCorrect && results.mrWhiteGuessedWord) {
      return `Mr. White was caught, but correctly guessed "${results.mrWhiteGuessedWord}" to steal victory!`;
    }
    if (results.mrWhiteId && results.wasMrWhiteGuessCorrect === false && results.mrWhiteGuessedWord) {
      return `Mr. White was caught and guessed "${results.mrWhiteGuessedWord}", failing to name the secret word!`;
    }
    if (settings.mode === 'undercover') {
      if (results.isTie) {
        return 'The vote ended in a tie! Undercover infiltrators win on ties.';
      }
      return isGroupWin
        ? 'The Civilians successfully identified and voted out the Undercover Agent!'
        : 'The Undercover Agent blended in! A Civilian was voted out.';
    }
    if (results.isTie) {
      return 'The vote ended in a tie! Under official rules, ties award victory to the Imposter.';
    }
    if (isGroupWin) {
      return 'The group successfully identified and eliminated the infiltrator!';
    }
    return 'A Civilian was voted out! The infiltrator successfully blended in.';
  };

  return (
    <div className="results-phase-container" role="region" aria-label="Game Results Phase">
      {/* 1. Dramatic Outcome Banner */}
      <div
        className={`results-outcome-banner ${bannerClass}`}
        data-testid="results-banner"
      >
        <div className="outcome-icon-tag" aria-hidden="true">
          {bannerIcon}
        </div>
        <h2 className="outcome-title" data-testid="winner-title">
          {bannerTitle}
        </h2>
        <p className="outcome-subtitle">
          {getSubtitle()}
        </p>
      </div>

      {/* 2. Secret Reveals Grid (Infiltrators & Secret Word / Paired Words) */}
      <div className="results-details-grid">
        {settings.mode === 'undercover' && state.selectedWordPair ? (
          <>
            <div className="reveal-info-card">
              <div className="reveal-card-label">Civilian Word (Word A)</div>
              <div className="revealed-word-text" data-testid="revealed-word-a" style={{ color: 'var(--accent-cyan)' }}>
                {state.selectedWordPair.wordA}
              </div>
            </div>
            <div className="reveal-info-card">
              <div className="reveal-card-label">Undercover Word (Word B)</div>
              <div className="revealed-word-text" data-testid="revealed-word-b" style={{ color: '#c084fc' }}>
                {state.selectedWordPair.wordB}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="reveal-info-card">
              <div className="reveal-card-label">
                {mrWhite ? 'Mr. White' : `The Imposter${imposters.length > 1 ? 's' : ''}`}
              </div>
              <div className="revealed-imposter-names" data-testid="revealed-imposters">
                {mrWhite ? (
                  <span className="imposter-tag" style={{ color: '#f8fafc' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: mrWhite.avatarColor,
                      }}
                      aria-hidden="true"
                    />
                    {mrWhite.name} (Mr. White)
                  </span>
                ) : (
                  imposters.map((imp) => (
                    <span key={imp.id} className="imposter-tag">
                      <span
                        style={{
                          display: 'inline-block',
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: imp.avatarColor,
                        }}
                        aria-hidden="true"
                      />
                      {imp.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="reveal-info-card">
              <div className="reveal-card-label">Secret Word ({settings.category})</div>
              <div className="revealed-word-text" data-testid="revealed-word">
                {selectedWord || '—'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Vote Breakdown Tally */}
      <div className="vote-tally-section">
        <div className="vote-tally-title">Vote Breakdown</div>
        <div className="vote-tally-list">
          {players.map((p) => {
            const votesReceived = results.voteCounts[p.id] || 0;
            const isEliminated = results.mostVotedPlayerIds.includes(p.id) && !results.isTie;
            const isTied = results.mostVotedPlayerIds.includes(p.id) && results.isTie;
            
            let roleLabel = 'Civilian';
            let roleBadgeClass = 'civilian';
            if (p.role === 'imposter') {
              roleLabel = 'Imposter';
              roleBadgeClass = 'imposter';
            } else if (p.role === 'mr_white') {
              roleLabel = 'Mr. White';
              roleBadgeClass = 'mr_white';
            } else if (p.role === 'undercover') {
              roleLabel = 'Undercover';
              roleBadgeClass = 'undercover';
            }

            return (
              <div
                key={p.id}
                className={`tally-row ${isEliminated || isTied ? 'eliminated' : ''}`}
                data-testid={`tally-${p.id}`}
              >
                <div className="tally-player-info">
                  <div
                    className="tally-avatar-mini"
                    style={{ backgroundColor: p.avatarColor }}
                    aria-hidden="true"
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="tally-name">{p.name}</span>
                  <span
                    className={`tally-role-badge ${roleBadgeClass}`}
                  >
                    {roleLabel}
                  </span>
                </div>

                <div
                  className={`tally-votes-count ${votesReceived > 0 ? 'high-votes' : ''}`}
                >
                  {votesReceived} {votesReceived === 1 ? 'vote' : 'votes'}
                  {isEliminated && ' 🎯 (Voted Out)'}
                  {isTied && ' ⚖️ (Tie)'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Post-Game Actions */}
      <div className="results-actions-group">
        <Button
          variant="primary"
          size="lg"
          onClick={playAgain}
          data-testid="play-again-button"
        >
          🔄 Play Again
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={quitToLobby}
          data-testid="change-settings-button"
        >
          ⚙️ Change Settings
        </Button>
      </div>
    </div>
  );
};
