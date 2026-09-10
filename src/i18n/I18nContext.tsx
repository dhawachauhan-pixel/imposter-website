/**
 * i18n Context Provider & Hooks
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SupportedLanguage, TranslationSchema } from './types';
import { translations, enTranslations } from './translations';

interface I18nContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationSchema;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  // Detect browser language on first load if supported
  useEffect(() => {
    try {
      const browserLang = navigator.language.slice(0, 2) as SupportedLanguage;
      if (['en', 'es', 'de', 'fr', 'pt', 'ja'].includes(browserLang)) {
        setLanguageState(browserLang);
      }
    } catch {
      // Default to 'en'
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
  };

  const currentTranslations = translations[language] || enTranslations;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: currentTranslations }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
