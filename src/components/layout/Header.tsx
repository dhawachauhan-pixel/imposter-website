import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { LanguageSelector } from './LanguageSelector';
import { SplitMaskLogo } from '../common/SplitMaskLogo';
import { triggerHaptic } from '../../game/utils/haptics';
import './Header.css';

export const Header: React.FC = () => {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const scrollToRules = () => {
    triggerHaptic('light');
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand Logo matching reference */}
        <a href="#" className="brand-logo" onClick={closeMenu} aria-label="IMPOSTER Home">
          <SplitMaskLogo size={36} />
          <div className="brand-text-col">
            <span className="brand-title">IMPOSTER</span>
            <span className="brand-tagline">One Word. One Liar.</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <a href="#how-it-works" className="nav-link">
            {t.nav.howToPlay}
          </a>
          <a href="#game-modes" className="nav-link">
            {t.nav.gameModes}
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions">
          <LanguageSelector />
          <button
            type="button"
            className="header-rules-btn"
            aria-label="How to Play & Rules"
            title="How to Play & Rules"
            onClick={scrollToRules}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="mobile-controls">
          <button
            className={`hamburger-btn ${mobileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={closeMenu}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <a href="#how-it-works" className="mobile-nav-link" onClick={closeMenu}>
              {t.nav.howToPlay}
            </a>
            <a href="#game-modes" className="mobile-nav-link" onClick={closeMenu}>
              {t.nav.gameModes}
            </a>
            <a href="#faq" className="mobile-nav-link" onClick={closeMenu}>
              FAQ
            </a>
            <div className="mobile-drawer-footer">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Language:</span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
