import { getDictionaryServer } from '@/lib/i18n-server';
import Footer from '@/components/Footer';

export default async function Privacidad() {
  const t = await getDictionaryServer();

  return (
    <main className="min-h-screen w-full flex flex-col bg-white text-black font-sans">
      <section className="max-w-4xl mx-auto px-6 py-32 space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
            {t.privacyPage.titlePart1} <span className="text-red-600">{t.privacyPage.titlePart2}</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
            {t.privacyPage.subtitle}
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-10 text-lg leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">{t.privacyPage.s1Title}</h2>
            <p dangerouslySetInnerHTML={{ __html: t.privacyPage.s1Desc }} />
            <div className="bg-neutral-50 p-8 rounded-3xl border border-black/5 font-medium">
              <p className="mb-4" dangerouslySetInnerHTML={{ __html: t.privacyPage.s1Box1 }} />
              <p dangerouslySetInnerHTML={{ __html: t.privacyPage.s1Box2 }} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">{t.privacyPage.s2Title}</h2>
            <p>{t.privacyPage.s2Desc}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">{t.privacyPage.s3Title}</h2>
            <p>{t.privacyPage.s3Desc}</p>
            <a 
              href="https://drive.google.com/file/d/1WhcSVqjFQ72kuCCHyVra6uqN7PcTXf1Z/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline"
            >
              {t.privacyPage.s3Link}
            </a>
          </section>

          <section className="space-y-4 border-t border-black/5 pt-10">
            <p className="text-xs text-gray-400">
              {t.privacyPage.lastUpdate}
            </p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
