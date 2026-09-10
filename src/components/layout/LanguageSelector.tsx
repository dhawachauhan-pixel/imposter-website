import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import type { SupportedLanguage } from '../../i18n/types';
import './LanguageSelector.css';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="language-selector-wrapper">
      <label htmlFor="language-select" className="sr-only">
        Language
      </label>
      <div className="language-select-box">
        <span className="language-globe-icon" aria-hidden="true">🌐</span>
        <select
          id="language-select"
          className="language-native-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          aria-label="Select Language"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
