import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { LegalModal, type LegalModalType } from './LegalModal';
import './Footer.css';

export const Footer: React.FC = () => {
  const { t } = useI18n();
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  return (
    <>
      <footer className="site-footer">
        <div className="page-container footer-inner">
          <div className="footer-top">
            <div className="footer-brand-col">
              <div className="footer-brand">
                <span>🎭</span>
                <span>IMPOSTER.WEBSITE</span>
              </div>
              <p className="footer-tagline">{t.footer.disclaimer}</p>
              <div className="footer-instant-badge">{t.footer.instantPlay}</div>
            </div>

            <div className="footer-links-group">
              <div className="footer-col">
                <span className="footer-col-heading">Game</span>
                <a href="#how-it-works" className="footer-link">
                  {t.nav.howToPlay}
                </a>
                <a href="#game-modes" className="footer-link">
                  {t.nav.gameModes}
                </a>
                <a href="#word-generator" className="footer-link">
                  {t.nav.wordGenerator}
                </a>
              </div>

              <div className="footer-col">
                <span className="footer-col-heading">Content</span>
                <a href="#blog" className="footer-link">
                  {t.nav.blog}
                </a>
                <a href="#word-generator" className="footer-link">
                  Word Lists
                </a>
                <a href="#blog" className="footer-link">
                  Game Rules
                </a>
              </div>

              <div className="footer-col">
                <span className="footer-col-heading">Legal</span>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setLegalModalType('privacy')}
                  aria-haspopup="dialog"
                >
                  {t.footer.privacy}
                </button>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setLegalModalType('terms')}
                  aria-haspopup="dialog"
                >
                  {t.footer.terms}
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} imposter.website. {t.footer.rights}</span>
            <span>Designed for global party game nights.</span>
          </div>
        </div>
      </footer>

      {/* In-app Legal Dialog */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </>
  );
};
