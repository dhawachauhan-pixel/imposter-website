import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useGame } from '../../game/state/gameContext';
import { triggerHaptic } from '../../game/utils/haptics';
import type { GameMode } from '../../game/types/gameState';
import './GameModesSection.css';

export const GameModesSection: React.FC = () => {
  const { t } = useI18n();
  const { setMode } = useGame();

  const handleModeClick = (modeId: GameMode, isActive: boolean) => {
    if (!isActive) return;
    triggerHaptic('selection');
    setMode(modeId);
    const target = document.getElementById('play-game') || document.querySelector('.game-stage-container');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const modes: Array<{
    id: GameMode;
    icon: string;
    title: string;
    desc: string;
    status: string;
    isActive: boolean;
  }> = [
    {
      id: 'classic',
      icon: '🎭',
      title: t.modes.classicTitle,
      desc: t.modes.classicDesc,
      status: 'Active',
      isActive: true,
    },
    {
      id: 'undercover',
      icon: '🕵️',
      title: t.modes.undercoverTitle,
      desc: t.modes.undercoverDesc,
      status: 'Active',
      isActive: true,
    },
    {
      id: 'mr_white',
      icon: '🎩',
      title: t.modes.mrWhiteTitle,
      desc: t.modes.mrWhiteDesc,
      status: 'Active',
      isActive: true,
    },
    {
      id: 'chaos',
      icon: '⚡',
      title: t.modes.chaosTitle,
      desc: t.modes.chaosDesc,
      status: 'Coming Soon',
      isActive: false,
    },
  ];

  return (
    <section id="game-modes" className="section-wrapper" aria-label="Game Modes">
      <div className="section-header">
        <span className="badge badge-cyan">{t.modes.badge}</span>
        <h2 className="heading-section">{t.modes.title}</h2>
        <p className="section-subtitle">{t.modes.subtitle}</p>
      </div>

      <div className="modes-grid">
        {modes.map((mode) => (
          <div
            key={mode.id}
            className={`mode-detail-card ${mode.isActive ? 'is-active is-clickable' : ''}`}
            onClick={() => handleModeClick(mode.id, mode.isActive)}
            role={mode.isActive ? 'button' : undefined}
            tabIndex={mode.isActive ? 0 : undefined}
            onKeyDown={(e) => {
              if (mode.isActive && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleModeClick(mode.id, mode.isActive);
              }
            }}
            aria-label={mode.isActive ? `Select ${mode.title} game mode` : undefined}
            data-testid={`mode-card-${mode.id}`}
          >
            <div className="mode-header-row">
              <span className="mode-icon" aria-hidden="true">{mode.icon}</span>
              <span className={`badge ${mode.isActive ? 'badge-purple' : 'badge-muted'}`}>
                {mode.status}
              </span>
            </div>
            <h3 className="mode-title">{mode.title}</h3>
            <p className="mode-desc">{mode.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
