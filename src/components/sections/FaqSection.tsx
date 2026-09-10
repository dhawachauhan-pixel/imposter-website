import React, { useState } from 'react';
import './FaqSection.css';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'What is the Imposter party game?',
    a: 'Imposter is a fast-paced social deduction word game where everyone knows a secret word except one player (the Imposter). Players take turns giving subtle one-word clues to prove they know the word while the Imposter tries to blend in without getting caught.',
  },
  {
    q: 'How many players can play?',
    a: 'The game is designed for 3 to 16 players. It works great for small family gatherings as well as lively parties with larger groups of friends.',
  },
  {
    q: 'Do we need an account or app store download?',
    a: 'No! imposter.website runs entirely inside any modern web browser on phones, tablets, or computers with zero signups, downloads, or installations needed.',
  },
  {
    q: 'Can we play on a single phone?',
    a: 'Yes! The game is built for single-device pass-and-play as well as in-person room play. You can pass one phone around to view roles or play together.',
  },
  {
    q: 'What happens if the Imposter guesses the secret word?',
    a: 'If the innocent players vote out the Imposter, the Imposter gets one final chance to guess the secret word. If they guess correctly, the Imposter steals the victory!',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-wrapper" aria-label="Frequently Asked Questions">
      <div className="section-header">
        <span className="badge badge-purple">Got Questions?</span>
        <h2 className="heading-section">Frequently Asked Questions</h2>
        <p className="section-subtitle">Everything you need to know about playing Imposter.</p>
      </div>

      <div className="faq-container">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <span className="faq-chevron" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              {isOpen && <div className="faq-answer-panel">{faq.a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
};
