import { prisma } from '@/lib/prisma';
import { SpainMap } from '@/components/SpainMap';
import MemberStats from '@/components/MemberStats';
import About3DSections from '@/components/About3DSections';
import EuropeMap from '@/components/EuropeMap';
import { getDictionaryServer } from '@/lib/i18n-server';

export default async function ConocenosPage() {
  const t = await getDictionaryServer();

  const members = await prisma.user.findMany({
    where: { role: { in: ['USER', 'ADMIN'] } },
    select: { province: true, city: true, latitude: true, longitude: true, university: true, academicYear: true }
  });

  const mappedMembers = members.filter(m => m.province && m.city);

  return (
    <main className="min-h-screen py-28 px-6 sm:px-10 relative overflow-clip" style={{ background: 'var(--red)' }}>

      <div className="max-w-6xl mx-auto relative z-10 space-y-20">

        {/* Header — black h1 on red */}
        <header className="text-center space-y-4">
          <span
            className="inline-block label px-4 py-1.5 rounded-full mb-2"
            style={{ background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid rgba(0,0,0,0.15)' }}
          >
            {t.about.title}
          </span>

          {/* h1 → BLACK (per alternating rule) */}
          <h1 style={{ color: '#000', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', fontWeight: 900 }}>
            {t.about.subtitle}
          </h1>

          {/* White accent bar */}
          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: '#fff' }} />
        </header>

        {/* 3D DNA Sections */}
        <About3DSections />

        {/* Stats + Map — dark surface panel */}
        <section className="space-y-8">
          <MemberStats members={members} />

          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(0,0,0,0.15)' }}
          >
            {/* h2 → WHITE (alternating) */}
            <h2
              className="text-2xl mb-6 font-black uppercase"
              style={{ color: '#fff', letterSpacing: '-0.01em' }}
            >
              {t.about.mapTitle}
            </h2>
            <SpainMap members={mappedMembers} />
          </div>
        </section>

        {/* EESTEC */}
        <section
          className="text-center pt-16 pb-8 relative"
          style={{ borderTop: '1px solid rgba(0,0,0,0.18)' }}
        >
          {/* EESTEC logo — white, centered */}
          <div className="flex justify-center mb-8">
            <img
              src="/logo-eestec.png"
              alt="EESTEC"
              className="h-16 w-auto"
            />
          </div>

          {/* h2 → WHITE (alternating) */}
          <h2
            className="font-black mb-4 leading-none"
            style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}
          >
            {t.about.eestecTitle}{' '}
            <span style={{ color: '#000' }}>EESTEC</span>
          </h2>

          <p
            className="max-w-2xl mx-auto text-lg mb-12"
            style={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: t.about.eestecDesc }}
          />

          {/* EESTEC History Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16 text-left">
            {t.about.eestecHistory?.map((item, idx) => (
              <div 
                key={idx}
                className="rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-[1.02] duration-300 shadow-xl"
                style={{ 
                  background: 'rgba(0,0,0,0.22)', 
                  border: '1px solid rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {/* Year tag */}
                <span className="absolute top-4 right-4 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/40 text-white tracking-widest border border-white/5">
                  {item.year}
                </span>

                <h3 className="text-white text-lg font-black uppercase tracking-tight mb-3 mt-2 pr-12">
                  {item.title}
                </h3>
                
                <p className="text-white/70 text-sm font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <EuropeMap />
        </section>
      </div>
    </main>
  );
}