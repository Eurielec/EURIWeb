'use client';

import { useLanguage } from './LanguageProvider';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(locale === 'es' ? 'en' : 'es')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors text-sm font-bold tracking-wider"
      style={{
        color: 'var(--navbar-text)',
        background: 'var(--navbar-control-bg)',
        borderColor: 'var(--navbar-border)',
      }}
      title="Cambiar idioma / Change language"
    >
      <Globe className="w-4 h-4" />
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  );
}
