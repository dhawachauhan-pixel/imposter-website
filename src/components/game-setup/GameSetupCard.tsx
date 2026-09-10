import React from 'react';
import { useGame } from '../../game/state/gameContext';
import { PlayerCounter } from './PlayerCounter';
import { PlayerList } from './PlayerList';
import { GameSettings } from './GameSettings';
import { PrimaryCTA } from './PrimaryCTA';
import { MysterySilhouetteLeft, MysterySilhouetteRight } from '../common/MysterySilhouettes';
import { ActiveGameContainer } from '../game-active/ActiveGameContainer';
import './GameSetupCard.css';

export const GameSetupCard: React.FC = () => {
  const { state } = useGame();
  const isLobby = state.phase === 'PLAYER_SETUP' && !state.isInterrupted;

  return (
    <section className="game-stage-container" id="play-game" aria-label="Game Setup">
      {/* 1. Homepage Title & Subtitle */}
      <div className="game-headline-group">
        <h1 className="main-game-title">
          Find the <span className="highlight-imposter">Imposter</span>
        </h1>
        <p className="main-game-subtitle">
          A fun party game for <span className="subtitle-desktop-text">friends, family and </span>everyone!
        </p>
      </div>

      {/* 2. Central Setup Stage with decorative mystery silhouettes */}
      <div className="setup-stage-wrapper">
        <MysterySilhouetteLeft />

        <div className="main-setup-card">
          {isLobby ? (
            <>
              <div className="setup-grid-layout">
                {/* Left Column: Players */}
                <div className="setup-col">
                  <div className="setup-col-header">
                    <div className="setup-col-title">
                      <svg
                        className="setup-col-title-icon"
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>Players ({state.minPlayers}-{state.maxPlayers})</span>
                    </div>
                    <PlayerCounter />
                  </div>
                  <PlayerList />
                </div>

                {/* Right Column: Settings */}
                <div className="setup-col">
                  <GameSettings />
                </div>
              </div>

              {/* Start Game Action CTA */}
              <PrimaryCTA />
            </>
          ) : (
            <ActiveGameContainer />
          )}
        </div>

        <MysterySilhouetteRight />
      </div>
    </section>
  );
};
