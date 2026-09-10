import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './HowItWorksSection.css';

export const HowItWorksSection: React.FC = () => {
  const { t } = useI18n();

  const steps = [
    {
      num: 1,
      icon: '👥',
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
    },
    {
      num: 2,
      icon: '🤫',
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
    },
    {
      num: 3,
      icon: '🗣️',
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
    },
    {
      num: 4,
      icon: '🔍',
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
    },
  ];

  return (
    <section id="how-it-works" className="section-wrapper" aria-label="How to play">
      <div className="section-header">
        <span className="badge badge-purple">{t.howItWorks.badge}</span>
        <h2 className="heading-section">{t.howItWorks.title}</h2>
        <p className="section-subtitle">{t.howItWorks.subtitle}</p>
      </div>

      <div className="steps-grid">
        {steps.map((step) => (
          <div key={step.num} className="step-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="step-number">{step.num}</span>
              <span className="step-icon" aria-hidden="true">{step.icon}</span>
            </div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
