'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { useState, useEffect } from 'react';
import { getSessionAction } from '@/app/actions/auth';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<{ userId: string; role: string; name?: string | null; image?: string | null } | null>(null);

  useEffect(() => {
    getSessionAction().then(setSession);
  }, [pathname]);

  const navItems = [
    { name: t.nav.home,    path: '/' },
    { name: t.nav.about,   path: '/conocenos' },
    { name: t.nav.board,   path: '/junta' },
    { name: t.nav.vocalias ?? 'Vocalías', path: '/vocalias' },
    { name: t.nav.projects ?? 'Proyectos', path: '/proyectos' },
    { name: t.nav.events,  path: '/calendario' },
    { name: t.nav.shop ?? 'Tienda', path: '/tienda' },
    { name: t.nav.archive ?? 'Archivo', path: '/archivo' },
    { name: t.nav.contact, path: '/contacto' },
  ];

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-colors duration-300 shadow-lg"
      style={{
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--navbar-border)',
      }}
    >
      <div className="max-w-[1700px] mx-auto px-6 h-16 flex items-center justify-between gap-4">

        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-eurielec.png"
                alt="Eurielec"
                width={120}
                height={40}
                className="h-10 w-auto rounded-sm transition-all"
                style={{ 
                  backgroundColor: 'var(--logo-bg)',
                  padding: 'var(--logo-pad)',
                  mixBlendMode: 'var(--logo-mix)' as any,
                  filter: 'var(--logo-filter, none)'
                }}
              />
              <div className="w-px h-6" style={{ background: 'var(--navbar-divider)' }} />
              <Image
                src="/logo-eestec.png"
                alt="EESTEC LC Madrid"
                width={100}
                height={28}
                className="h-7 w-auto"
                style={{ filter: 'var(--navbar-eestec-filter)' }}
              />
            </div>
          </Link>
        </div>

        {/* DESKTOP NAV - CENTERED */}
        <div className="hidden xl:flex items-center justify-center flex-1 gap-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className="relative px-3 2xl:px-4 py-2 text-[14px] font-black uppercase transition-all hover:opacity-100"
                style={{
                  color: isActive ? 'var(--navbar-active-text)' : 'var(--navbar-text)',
                  opacity: isActive ? 1 : 0.7,
                  letterSpacing: '0.08em',
                }}
              >
                {item.name}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 2xl:left-4 right-3 2xl:right-4 h-[2.5px] rounded-full"
                    style={{ background: 'var(--navbar-active-bg)' }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CONTROLS - RIGHT */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <div className="h-6 w-px" style={{ background: 'var(--navbar-divider)' }} />
          {session ? (
            <Link
              href={session.role === 'ADMIN' || session.role === 'VOCAL' ? '/admin' : '/perfil'}
              className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 shadow-md"
              style={{
                background: 'var(--navbar-control-bg)',
                borderColor: 'var(--navbar-border)',
              }}
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-red-600 flex items-center justify-center shrink-0 shadow-inner shadow-red-600/50">
                {session.image ? (
                  <Image src={session.image} alt={session.name || 'Perfil'} width={28} height={28} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-white font-black text-[10px]">{session.name ? session.name[0].toUpperCase() : 'E'}</span>
                )}
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest mt-0.5" style={{ color: 'var(--navbar-text)' }}>
                {session.role === 'ADMIN' || session.role === 'VOCAL' ? 'PANEL' : 'PERFIL'}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 rounded-full text-[13px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-md"
              style={{ background: '#111111', color: '#FFFFFF' }}
            >
              {t.nav.login}
            </Link>
          )}
        </div>

        {/* MOBILE TRIGGER */}
        <button
          className="xl:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span className={`h-0.5 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} style={{ background: 'var(--navbar-text)' }} />
            <span className={`h-0.5 transition-all ${open ? 'opacity-0' : ''}`} style={{ background: 'var(--navbar-text)' }} />
            <span className={`h-0.5 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: 'var(--navbar-text)' }} />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="xl:hidden px-4 pb-4 pt-2 overflow-y-auto max-h-[calc(100vh-64px)]" style={{ background: 'var(--navbar-bg)', borderTop: '1px solid var(--navbar-border)' }}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setOpen(false)}
              className="block py-4 text-[16px] font-black uppercase tracking-widest border-b"
              style={{
                color: pathname === item.path ? 'var(--navbar-active-text)' : 'var(--navbar-text)',
                opacity: pathname === item.path ? 1 : 0.7,
                borderColor: 'var(--navbar-border)',
              }}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-6 flex items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            {session ? (
              <Link
                href={session.role === 'ADMIN' || session.role === 'VOCAL' ? '/admin' : '/perfil'}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 pl-1 pr-5 py-1.5 rounded-full bg-black/50 hover:bg-black border border-white/10 transition-all shadow-md"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-red-600 flex items-center justify-center shrink-0">
                  {session.image ? (
                    <Image src={session.image} alt={session.name || 'Perfil'} width={32} height={32} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-white font-black text-[12px]">{session.name ? session.name[0].toUpperCase() : 'E'}</span>
                  )}
                </div>
                <span className="text-[12px] font-black uppercase tracking-widest text-white mt-0.5">
                  {session.role === 'ADMIN' || session.role === 'VOCAL' ? 'PANEL' : 'PERFIL'}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 text-[14px] font-black uppercase rounded-full tracking-widest shadow-md"
                style={{ background: '#000', color: '#fff' }}
              >
                {t.nav.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}