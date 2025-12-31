"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dictionary, Language } from './dictionary';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { safeLocalStorage } from './utils';

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: typeof dictionary['en'];
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);
  const refreshTimeoutRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Check localStorage on client mount
    const storage = safeLocalStorage();
    const savedLang = storage.getItem('liquid_lang') as Language;
    if (savedLang && ['en', 'es', 'jp'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    // Don't change if it's the same language
    if (lang === language) return;

    // Clear any pending refresh timeouts
    refreshTimeoutRef.current.forEach(clearTimeout);
    refreshTimeoutRef.current = [];

    setLanguageState(lang);
    const storage = safeLocalStorage();
    storage.setItem('liquid_lang', lang);

    // Force ScrollTrigger refresh after language change and DOM updates
    if (typeof window !== 'undefined' && isInitialized) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        const timers = [
          setTimeout(() => ScrollTrigger.refresh(), 100),
          setTimeout(() => ScrollTrigger.refresh(), 300),
        ];
        refreshTimeoutRef.current = timers;
      });
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      refreshTimeoutRef.current.forEach(clearTimeout);
    };
  }, []); const value = {
    language,
    setLanguage,
    dict: dictionary[language],
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within an I18nProvider');
  }
  return context;
}
