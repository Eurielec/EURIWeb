import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDictionaryServer } from '@/lib/i18n-server';
import Home3DWrapper from '@/components/Home3DWrapper';
import Footer from '@/components/Footer';

export default async function Home() {
  const t = await getDictionaryServer();

  return (
    <main className="min-h-screen w-full flex flex-col" style={{ background: 'var(--red)' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-24 overflow-hidden"
        style={{ minHeight: '90vh' }}
      >
        {/* Subtle dark vignette at corners */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%)' }} />

        {/* Tag — white on dark pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10 label"
          style={{ background: 'var(--surface-inv)', color: '#fff', border: '1px solid var(--border)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          {t.home.tag}
        </div>

        {/* Headline BLACK (matches Helvetica specimen left column) */}
        <div className="w-full mb-10 flex flex-col items-center justify-center px-2 sm:px-4">
          <h1
            className="font-black leading-none tracking-tighter w-full text-center"
            style={{ color: 'var(--foreground)', fontSize: 'clamp(4rem, 15vw, 25rem)', letterSpacing: '-0.04em' }}
          >
            EURIELEC
          </h1>
          <div 
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4"
            style={{ transform: 'translateX(-1.5rem)' }} // Shifts everything left so the shield aligns better to the center
          >
            <h2
              className="font-black leading-none tracking-tighter"
              style={{ color: 'var(--foreground)', fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.035em' }}
            >
              ETSIT
            </h2>
            <img 
              src="https://www.madrid.es/assets/images/logo-madrid.png" 
              alt="Madrid" 
              className="object-contain h-10 sm:h-14 lg:h-16"
              style={{ filter: 'var(--logo-filter, brightness(0))' }} 
            />
          </div>
        </div>

        {/* Subtitle WHITE */}
        <p
          className="max-w-2xl mx-auto mt-4 mb-10 text-xl font-light"
          style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.7 }}
        >
          {t.home.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Black CTA = "hero primary" on red bg */}
          <Link
            href="/register"
            className="btn btn-black inline-flex items-center gap-2"
          >
            {t.home.join} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/conocenos"
            className="btn btn-outline-white inline-flex items-center gap-2"
          >
            {t.nav.about}
          </Link>
        </div>
      </section>

      {/* ── 3D GLOBE SCROLL SEQUENCE ──────────────────────────── */}
      <section className="w-full">
        <Home3DWrapper dictionary={t} />
      </section>

      <Footer />
    </main>
  );
}