import { getUserSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { User, LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import InteractiveCalendar from '@/components/Calendar';
import EditProfileSection from '@/components/EditProfileSection';
import IMWPaymentSection from '@/components/IMWPaymentSection';
import MembershipPaymentSection from '@/components/MembershipPaymentSection';
import { prisma } from '@/lib/prisma';
import { getDictionaryServer } from '@/lib/i18n-server';

export default async function PerfilPage() {
  const t = await getDictionaryServer();
  const session = await getUserSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ 
    where: { id: session.userId },
    include: {
      pointTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });
  if (user && !user.province) redirect('/completar-perfil');

  // Redirigir a Socios (y Junta) si no han rellenado las preferencias de eventos clave
  if (user && user.role !== 'GUEST' && !user.tShirtSize) {
    redirect('/preferencias-socio');
  }

  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    where: {
      date: { gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1) },
      attendances: { some: { userId: session.userId } }
    }
  });

  const userAttendances = events.map(e => e.id);

  return (
    <main className="panel-wrapper min-h-screen bg-black text-white px-6 pb-6 pt-32 sm:px-10 sm:pb-10 sm:pt-48 relative overflow-hidden font-sans">
      {/* Luces de fondo premium - Red Theme */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/5 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16">
        
        {/* HEADER GIGANTE (Ocupa 12 columnas) */}
        <header className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-10">
          <div className="flex items-end gap-6">
            <div className="w-20 h-20 bg-red-600 flex items-center justify-center">
              <User className="text-black w-10 h-10" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-red-600 uppercase tracking-tighter leading-none italic">
                {t.profile.title}
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-white text-xs font-black uppercase tracking-[0.2em]">{session.role}</span>
                <div className="w-1 h-1 bg-white/30 rounded-full" />
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">{t.profile.id} {session.userId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-8 md:mt-0">
            {(session.role === 'ADMIN' || session.role === 'VOCAL') && (
              <Link href="/admin" className="flex items-center gap-2 px-6 py-4 bg-white hover:bg-gray-200 text-black transition-colors font-black text-[10px] uppercase tracking-[0.2em] leading-none">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.profile.adminPanel}</span>
              </Link>
            )}
            <form action={async () => {
               'use server';
               await deleteSession();
               redirect('/login');
            }}>
              <button className="flex items-center gap-2 px-6 py-4 border border-white/20 hover:bg-white/5 transition-colors font-black text-[10px] uppercase tracking-[0.2em] leading-none">
                <LogOut className="w-4 h-4" />
                <span>{t.profile.logout}</span>
              </button>
            </form>
          </div>
        </header>

        {/* COLUMNA IZQUIERDA (Info rápida, Puntos, Pagos) */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Asamblea General Votaciones */}
          {['USER', 'VOCAL', 'ADMIN'].includes(session.role) && (
            <section className="border-l-4 border-red-600 pl-6 py-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">{t.profile.assembly}</h2>
              <p className="text-gray-400 text-sm font-medium mb-6 leading-relaxed">{t.profile.assemblyDesc}</p>
              <Link href="/perfil/votaciones" className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white transition-colors font-black text-xs uppercase tracking-[0.2em]">
                {t.profile.enterVoting}
              </Link>
            </section>
          )}

          {/* Gamificación */}
          <section className="bg-white/5 border border-white/10 p-8">
            <h2 className="text-[10px] font-black mb-6 text-gray-500 uppercase tracking-[0.3em]">{t.profile.memberLevel}</h2>
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-7xl font-black text-red-600 leading-none">{user?.points || 0}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{t.profile.totalPoints}</span>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-8">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">{t.profile.recentHistory}</h3>
              {user?.pointTransactions && user.pointTransactions.length > 0 ? (
                <div className="space-y-4">
                  {user.pointTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-start justify-between group">
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">{tx.reason}</p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mt-1">
                          {new Date(tx.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                      <span className={`font-black text-lg ${tx.amount > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-xs uppercase tracking-widest font-black">{t.profile.noHistory}</p>
              )}
            </div>
          </section>

          {/* Pagos */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Estado Financiero</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <MembershipPaymentSection
                membershipPrice={user?.membershipPrice ?? null}
                membershipPaymentStatus={user?.membershipPaymentStatus ?? null}
              />
              <IMWPaymentSection 
                imwPrice={user?.imwPrice ?? null} 
                imwPaymentStatus={user?.imwPaymentStatus ?? null} 
              />
            </div>
          </section>

        </div>

        {/* COLUMNA PRINCIPAL (Detalles y Calendario) */}
        <div className="lg:col-span-8 space-y-16">
          <EditProfileSection user={user} />
          
          <section className="border-t border-white/10 pt-16">
            <div className="mb-10">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">{t.profile.calendarTitle}</h2>
              <p className="text-gray-400 text-sm font-medium mt-4">{t.profile.calendarDesc}</p>
            </div>
            <InteractiveCalendar 
              events={events} 
              allowRSVP={true} 
              userAttendances={userAttendances} 
            />
          </section>
        </div>

      </div>
    </main>
  );
}
