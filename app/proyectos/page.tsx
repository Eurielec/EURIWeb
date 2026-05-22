import { prisma } from '@/lib/prisma';
import { getDictionaryServer } from '@/lib/i18n-server';
import { vocalias } from '@/data/vocalias';
import { cookies } from 'next/headers';
import ClientProjects from './ClientProjects';

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
    <main className="min-h-screen py-28 px-6 sm:px-10 relative overflow-clip bg-black">
      {/* Elementos Decorativos de fondo comunes en Eurielec */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[var(--red)]/20 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-900/30 blur-[150px] rounded-full pointer-events-none -z-10" />

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
    </main>
  );
}
