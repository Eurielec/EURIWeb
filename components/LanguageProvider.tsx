'use client';

import React, { createContext, useContext, useState } from 'react';
import { dictionaries, Dictionary, Locale } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  t: Dictionary;
  setLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLocale 
}: { 
  children: React.ReactNode; 
  initialLocale: Locale; 
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLanguage = (lang: Locale) => {
    setLocaleState(lang);
    // Guarda la preferencia en una cookie por 1 año
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    // Forzamos la recarga real para que los componentes de servidor lean la nueva cookie
    window.location.reload(); 
  };

  const t = dictionaries[locale] || dictionaries.es;

  return (
    <LanguageContext.Provider value={{ locale, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
