import React from 'react';
import './FeatureTrioSection.css';

export const FeatureTrioSection: React.FC = () => {
  return (
    <div className="feature-trio-wrapper" aria-label="Game Core Features">
      <div className="feature-trio-grid">
        {/* 1. 3+ Players */}
        <div className="feature-trio-item">
          <div className="feature-trio-icon-box" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <h2 className="feature-trio-title">3+ Players</h2>
          <p className="feature-trio-desc">Play with friends, family or in the room</p>
        </div>

        {/* 2. Give Clues */}
        <div className="feature-trio-item">
          <div className="feature-trio-icon-box" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
            </svg>
          </div>
          <h2 className="feature-trio-title">Give Clues</h2>
          <p className="feature-trio-desc">Describe the word without saying it directly</p>
        </div>

        {/* 3. Find the Imposter */}
        <div className="feature-trio-item">
          <div className="feature-trio-icon-box" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h2 className="feature-trio-title">Find the Imposter</h2>
          <p className="feature-trio-desc">Vote and see who was lying!</p>
        </div>
      </div>
    </div>
  );
};
