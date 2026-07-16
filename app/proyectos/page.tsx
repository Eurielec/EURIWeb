import { prisma } from '@/lib/prisma';
import { getDictionaryServer } from '@/lib/i18n-server';
import { vocalias } from '@/data/vocalias';
import { cookies } from 'next/headers';
import ClientProjects from './ClientProjects';
import KineticTypography from '@/components/KineticTypography';

export default async function ProjectsPage() {
  const t = await getDictionaryServer();
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';

  // Obtener proyectos de Db asegurando que trae a los miembros
  const dbProjects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      members: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });

  // Mapear vocalias con sus respectivos proyectos
  const vocaliasWithProjects = vocalias.map(vocalia => {
    const projects = dbProjects.filter((p) => p.vocaliaId === vocalia.id);
    return { ...vocalia, projects };
  }).filter(v => v.projects.length > 0); // Opcional: solo mostrar vocalias que tengan proyectos

  return (
    <main className="projects-page relative overflow-clip" style={{ backgroundColor: 'var(--projects-bg)' }}>

      {/* ══════════════════════════════════════════════════════
          SINGLE CONTINUOUS kinetic typography background
          Fixed behind everything, reacts to scroll
          ══════════════════════════════════════════════════════ */}
      <KineticTypography
        text="EURIELEC"
        columnCount={9}
        fixedBackground
        scrollParallax={0.6}
      />

      {/* ══════════════════════════════════════════════════════
          HERO — Full-screen overlay on the kinetic typography
          ══════════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen z-10">

        {/* Centered overlay title */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <div
            className="projects-hero-card px-8 py-6 rounded-2xl"
          >
            <span
              className="inline-block label px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border mb-4 projects-hero-label"
            >
              NUESTRO TRABAJO
            </span>
            <h1
              className="font-sans text-center projects-hero-title"
            >
              {t.projects?.title || 'PROYECTOS'}
            </h1>
            <p
              className="max-w-2xl mx-auto text-base font-sans font-medium mt-3 text-center projects-hero-subtitle"
            >
              {t.projects?.subtitle || 'Descubre las iniciativas y desarrollos impulsados por cada una de las vocalías y socios.'}
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="mt-10 flex flex-col items-center gap-2 animate-bounce">
            <div
              className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5 projects-scroll-ring"
            >
              <div
                className="w-1.5 h-1.5 rounded-full projects-scroll-dot"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTINUOUS FADE TRANSITION — progressive blur/dark
          overlay that gradually intensifies as you scroll down
          ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen">
        {/* Progressive darkening + blur overlay over the fixed kinetic background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none projects-fade-overlay"
        />

        {/* Projects content */}
        <div className="relative z-10 py-28 px-6 sm:px-10">
          <div className="max-w-7xl mx-auto relative z-10 space-y-16">
            
            {/* Header de Proyectos */}
            <header className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                 <span
                  className="inline-block label px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border"
                  style={{ color: 'var(--text-brand)', borderColor: 'var(--text-brand)' }}
                >
                  NUESTRO TRABAJO
                </span>
              </div>

              <h1 className="font-sans" style={{ color: 'var(--text-brand)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em', fontWeight: 900 }}>
                {t.projects?.title || 'PROYECTOS'}
              </h1>

              <p className="max-w-2xl mx-auto text-lg font-sans font-medium opacity-80" style={{ color: 'var(--text-brand)' }}>
                {t.projects?.subtitle || 'Descubre las iniciativas y desarrollos impulsados por cada una de las vocalías y socios.'}
              </p>

              <div className="w-20 h-1.5 mx-auto rounded-full mt-8" style={{ background: 'var(--text-brand)' }} />
            </header>

            {/* Componente Cliente para interactividad 3D y filtrado o layout */}
            <ClientProjects vocalias={vocaliasWithProjects} locale={locale} />
            
          </div>
        </div>
      </section>
    </main>
  );
}
