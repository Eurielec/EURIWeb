'use client';

import { useLanguage } from './LanguageProvider';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(locale === 'es' ? 'en' : 'es')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-sm font-bold tracking-wider text-white"
      title="Cambiar idioma / Change language"
    >
      <Globe className="w-4 h-4" />
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  );
}
