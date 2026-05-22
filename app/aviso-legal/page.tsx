import { getDictionaryServer } from '@/lib/i18n-server';
import Footer from '@/components/Footer';

export default async function AvisoLegal() {
  const t = await getDictionaryServer();

  return (
    <main className="min-h-screen w-full flex flex-col bg-white text-black font-sans">
      <section className="max-w-4xl mx-auto px-6 py-32 space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
            {t.legal.titlePart1} <span className="text-red-600">{t.legal.titlePart2}</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
            {t.legal.subtitle}
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-10 text-lg leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">{t.legal.s1Title}</h2>
            <p>{t.legal.s1Desc}</p>
            <ul className="list-none space-y-2 font-bold">
              <li><span className="text-red-600">{t.legal.s1Entity}</span> {t.legal.s1EntityVal}</li>
              <li><span className="text-red-600">{t.legal.s1HQ}</span> {t.legal.s1HQVal}</li>
              <li><span className="text-red-600">{t.legal.s1Email}</span> {t.legal.s1EmailVal}</li>
              <li><span className="text-red-600">{t.legal.s1Scope}</span> {t.legal.s1ScopeVal}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">{t.legal.s2Title}</h2>
            <p>{t.legal.s2Desc}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">{t.legal.s3Title}</h2>
            <p>{t.legal.s3Desc}</p>
          </section>

          <section className="space-y-4 border-t border-black/5 pt-10">
            <p className="text-sm text-gray-500 italic">
              {t.legal.lastUpdate}
            </p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
