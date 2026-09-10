import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { WordGeneratorTool } from '../tools/WordGeneratorTool';
import './WordGeneratorTeaser.css';

export const WordGeneratorTeaser: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="word-generator" className="section-wrapper" aria-label="Word Generator">
      <div className="section-header">
        <span className="badge badge-pink">{t.wordGeneratorTeaser.badge}</span>
        <h2 className="heading-section">{t.wordGeneratorTeaser.title}</h2>
        <p className="section-subtitle">{t.wordGeneratorTeaser.subtitle}</p>
      </div>

      <WordGeneratorTool />
    </section>
  );
};
