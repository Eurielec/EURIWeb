'use client';

import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { locale } = useLanguage();

  return (
    <button
      onClick={() => setTheme(theme === 'default' ? 'high-contrast' : 'default')}
      className="p-2 flex items-center justify-center rounded-full transition-all outline-none"
      style={{
        color: 'var(--navbar-text)',
        background: 'var(--navbar-control-bg)',
      }}
      title={locale === 'es' ? 'Alternar modo blanco y negro' : 'Toggle black and white mode'}
    >
      {theme === 'default' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
