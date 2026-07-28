import JuntaCarousel from '@/components/JuntaCarousel';
import { prisma } from '@/lib/prisma';
import { juntaMembers as fallbackMembers } from '@/data/juntaMembers';
import { getDictionaryServer } from '@/lib/i18n-server';

export default async function Page() {
  const t = await getDictionaryServer();
  const dbMembers = await prisma.juntaMember.findMany({
    orderBy: { order: 'asc' }
  });

  const members = dbMembers.length > 0 ? dbMembers.map(m => ({
    name: m.name,
    role: m.role,
    description: m.description,
    img: m.imageUrl || '/junta/member1.png' // Default image if none
  })) : fallbackMembers;

  return (
    <main className="min-h-screen" style={{ background: '#08090a' }}>

      {/* ── CHARACTER SELECT — ocupa toda la pantalla menos la navbar ── */}
      <div style={{ paddingTop: '64px' }}>
        <JuntaCarousel members={members} />
      </div>

      {/* ── GOVERNANCE SECTION — debajo del character select ── */}
      <section className="px-6 sm:px-10 py-20 relative" style={{ background: 'var(--red)' }}>
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Header */}
          <header className="text-center space-y-4">
            <span
              className="inline-block label px-4 py-1.5 rounded-full mb-2"
              style={{ background: 'var(--surface-inv)', color: '#fff', border: '1px solid var(--border)' }}
            >
              {t.board.team}
            </span>
            <h2
              className="font-black text-white uppercase"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}
            >
              {t.board.title}
            </h2>
            <div className="w-16 h-1 mx-auto rounded-full" style={{ background: '#000' }} />
          </header>

          {/* Description card */}
          <div
            className="max-w-3xl mx-auto rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl"
            style={{ background: 'var(--surface-inv)', border: '1px solid var(--border)' }}
          >
            <p className="text-lg leading-relaxed text-white/80 font-light">
              {t.board.description}
            </p>

            <div className="pt-4 flex justify-center gap-3 flex-wrap">
              {t.board.tags.map((tag: string) => (
                <div
                  key={tag}
                  className="px-3 py-1 rounded-full border text-[0.6rem] font-bold uppercase tracking-widest"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}