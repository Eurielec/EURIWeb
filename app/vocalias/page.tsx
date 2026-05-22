import { prisma } from '@/lib/prisma';
import { getDictionaryServer } from '@/lib/i18n-server';
import { vocalias } from '@/data/vocalias';
import { cookies } from 'next/headers';

export default async function VocaliasPage() {
  const t = await getDictionaryServer();
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';

  // Buscar usuarios en la DB. Mapeamos por rol VOCAL, o por fallback de su vocalEmail si están sin migrar
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { role: 'VOCAL' },
        { email: { in: vocalias.map(v => v.vocalEmail) } }
      ]
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      vocalia: true
    }
  });

  // Mapear vocalias con sus respectivos usuarios
  const vocaliasWithUsers = vocalias.map(vocaliaItem => {
    // Primero buscamos por el nuevo sistema: rol VOCAL y asignación de vocalía
    let user = users.find((u) => u.role === 'VOCAL' && u.vocalia === vocaliaItem.id);
    // Si no encontramos, usamos fallback por correo
    if (!user) {
      user = users.find((u) => u.email === vocaliaItem.vocalEmail);
    }
    return { ...vocaliaItem, user };
  });

  return (
    <main className="min-h-screen py-28 px-6 sm:px-10 relative overflow-clip" style={{ background: 'var(--red)' }}>
      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex justify-center mb-4">
             <span
              className="inline-block label px-4 py-1.5 rounded-full"
              style={{ background: 'var(--surface-inv)', color: '#fff', border: '1px solid var(--border)' }}
            >
              ESTRUCTURA
            </span>
          </div>

          <h1 style={{ color: 'var(--foreground)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.04em', fontWeight: 900 }}>
            {t.vocalias.title}
          </h1>

          <p className="max-w-2xl mx-auto text-lg opacity-70" style={{ color: 'var(--foreground)', fontWeight: 500 }}>
            {t.vocalias.subtitle}
          </p>

          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: '#fff' }} />
        </header>

        {/* Vocalías Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {vocaliasWithUsers.map((item, idx) => (
            <div 
              key={item.id}
              className="group relative rounded-4xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)]"
              style={{ 
                background: 'var(--surface-inv)', 
                border: '1px solid var(--border)',
                animationDelay: `${idx * 0.1}s`
              }}
            >
              {/* Background Reference Image (placeholder for now) */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                {/* Usamos un degradado de color si no hay imagen real */}
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                  style={{ 
                    backgroundImage: `url(${item.image})`,
                    backgroundColor: 'var(--muted)'
                  }} 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
              </div>

              <div className="relative p-10 h-full flex flex-col justify-between min-h-[380px]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-white/20 group-hover:w-12 transition-all duration-500" />
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                      {locale === 'es' ? item.name.es : item.name.en}
                    </h3>
                  </div>
                  
                  <p className="text-white/60 text-base leading-relaxed font-light text-balance">
                    {locale === 'es' ? item.description.es : item.description.en}
                  </p>
                </div>

                {/* Vocal/Responsible Info Area */}
                <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-5">
                  <div className="relative group/avatar">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl bg-black/40 transition-transform duration-500 group-hover/avatar:scale-105">
                      {item.user?.image ? (
                        <img src={item.user.image} alt={item.user.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-lg font-black uppercase">
                          {item.user?.name ? item.user.name.charAt(0) : '?'}
                        </div>
                      )}
                    </div>
                    {/* Status Glow */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#121212] shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span 
                      className="label text-[0.6rem] font-black uppercase tracking-[0.25em] leading-none mb-1 shadow-sm"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {t.vocalias.vocalLabel}
                    </span>
                    <span className="text-white font-black text-lg uppercase tracking-tight leading-none group-hover:text-red-500 transition-colors duration-300">
                      {item.user?.name || t.vocalias.noVocal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative accent for the card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>


      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-black/5 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full pointer-events-none -z-10" />
    </main>
  );
}
