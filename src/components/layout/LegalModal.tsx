import React, { useEffect } from 'react';
import { Button } from '../common/Button';
import './LegalModal.css';

export type LegalModalType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && type !== null) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, onClose]);

  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      className="legal-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div className="legal-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="legal-modal-header">
          <div className="legal-modal-header-title">
            <span className="legal-modal-icon" aria-hidden="true">
              {isPrivacy ? '🛡️' : '📜'}
            </span>
            <h3 id="legal-modal-title" className="legal-modal-title">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
          </div>
          <button
            type="button"
            className="legal-close-icon-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="legal-modal-body">
          {isPrivacy ? (
            <>
              <div>
                <h4>Privacy-First Party Gaming</h4>
                <p>
                  imposter.website is built from the ground up to respect your privacy.
                  We believe party games should be instant and fun without mandatory accounts,
                  passwords, or intrusive data collection.
                </p>
              </div>

              <div>
                <h4>No User Accounts Required</h4>
                <p>
                  You do not need to register, provide an email address, phone number,
                  or payment details to play any of our game modes.
                </p>
              </div>

              <div>
                <h4>Local Device Processing</h4>
                <p>
                  All player names, secret role assignments, word decks, and voting ballots
                  are generated and processed locally in your web browser. Your custom party
                  names are stored in your device&apos;s local storage for convenience during
                  future game nights and are never transmitted to external marketing servers.
                </p>
              </div>

              <div>
                <h4>Device Features & Permissions</h4>
                <p>
                  To provide a seamless pass-the-phone experience, the game may request the
                  Screen Wake Lock API (to keep your display active during gameplay) and the
                  Vibration API (for subtle button haptics). Neither feature collects personal
                  information.
                </p>
              </div>

              <div>
                <h4>Cookies & Telemetry</h4>
                <p>
                  We do not use invasive tracking cookies. Standard server logs or basic web
                  metrics may collect non-identifying technical information (browser type,
                  error logs) solely for maintaining site performance and reliability.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4>Welcome to Imposter</h4>
                <p>
                  By accessing and playing games on imposter.website, you agree to these
                  straightforward terms designed for friendly party entertainment.
                </p>
              </div>

              <div>
                <h4>Free Entertainment Service</h4>
                <p>
                  imposter.website provides free browser-based party games for personal,
                  non-commercial entertainment with your friends, family, and colleagues.
                </p>
              </div>

              <div>
                <h4>Player Content & Conduct</h4>
                <p>
                  Players can enter custom player names and clues on their own devices.
                  Please keep names and gameplay respectful and appropriate for your group.
                  You remain solely responsible for any content entered on your device.
                </p>
              </div>

              <div>
                <h4>&ldquo;As-Is&rdquo; Availability</h4>
                <p>
                  While we work hard to keep the service fast, reliable, and bug-free,
                  the game is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis.
                  We make no guarantees of uninterrupted or error-free operation.
                </p>
              </div>

              <div>
                <h4>Intellectual Property</h4>
                <p>
                  The unique website design, logo, user interface, and curated word databases
                  are the property of imposter.website. Traditional social deduction and party
                  word game mechanics belong to the public gaming heritage.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="legal-modal-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
