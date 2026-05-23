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

  // Aún necesitamos los IDs para que el calendario los marque como apuntados
  const userAttendances = events.map(e => e.id);

  return (
    <main className="panel-wrapper min-h-screen bg-black text-white p-8 pt-24 relative overflow-hidden font-sans">
      {/* Luces de fondo premium - Red Theme */}
      <div className="absolute top-1/4 left-1/4 -translate-1/2 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-900/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <header className="flex justify-between items-center bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
              <User className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-red-600 uppercase tracking-tighter italic">
                {t.profile.title}
              </h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">{t.profile.memberRole}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {(session.role === 'ADMIN' || session.role === 'VOCAL') && (
              <Link href="/admin" className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest leading-none shadow-lg shadow-red-600/20">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.profile.adminPanel}</span>
              </Link>
            )}
            <form action={async () => {
               'use server';
               await deleteSession();
               redirect('/login');
            }}>
              <button className="flex items-center gap-2 px-6 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-600/20 hover:border-red-600/30 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest leading-none">
                <LogOut className="w-4 h-4" />
                <span>{t.profile.logout}</span>
              </button>
            </form>
          </div>
        </header>

        {/* Asamblea General Votaciones (Solo para socios, vocales y admin) */}
        {['USER', 'VOCAL', 'ADMIN'].includes(session.role) && (
          <section className="bg-red-600/10 border border-red-600/20 p-8 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter italic">{t.profile.assembly}</h2>
              <p className="text-gray-400 text-sm font-medium mt-1">{t.profile.assemblyDesc}</p>
            </div>
            <Link href="/perfil/votaciones" className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 shrink-0">
              {t.profile.enterVoting}
            </Link>
          </section>
        )}

        <section className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-xl">
          <h2 className="text-[10px] font-black mb-4 text-gray-500 uppercase tracking-[0.2em]">{t.profile.accountStatus}</h2>
          <div className="flex flex-col gap-3">
            <p className="text-gray-300 font-medium">
              <span className="text-gray-500 mr-2 lowercase italic">{t.profile.id}</span> {session.userId}
            </p>
            <p className="text-gray-300 font-medium flex items-center">
              <span className="text-gray-500 mr-2 lowercase italic">{t.profile.role}</span>
              <span className="px-3 py-1 bg-red-600/10 text-red-600 border border-red-600/20 rounded-lg text-[10px] font-black uppercase tracking-widest ml-2">
                {session.role}
              </span>
            </p>
          </div>
        </section>

        {/* Gamificación - Puntos del Usuario y Pagos IMW */}
        <section className="bg-emerald-600/10 border border-emerald-600/20 p-8 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col md:flex-row gap-8">
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            <div className="flex flex-col items-center justify-center min-w-[200px] p-6 bg-black/40 rounded-2xl border border-emerald-500/20">
              <h2 className="text-[10px] font-black mb-2 text-emerald-500 uppercase tracking-[0.2em]">{t.profile.memberLevel}</h2>
              <div className="text-6xl font-black text-white">{user?.points || 0}</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 mt-2">{t.profile.totalPoints}</p>
            </div>
            
            <MembershipPaymentSection
              membershipPrice={user?.membershipPrice ?? null}
              membershipPaymentStatus={user?.membershipPaymentStatus ?? null}
            />

            <IMWPaymentSection 
              imwPrice={user?.imwPrice ?? null} 
              imwPaymentStatus={user?.imwPaymentStatus ?? null} 
            />
          </div>
          
          <div className="flex-1 flex flex-col min-w-[300px]">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">{t.profile.recentHistory}</h3>
            {user?.pointTransactions && user.pointTransactions.length > 0 ? (
              <div className="space-y-3">
                {user.pointTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                    <div>
                      <p className="text-sm font-medium text-gray-300">{tx.reason}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
                        {new Date(tx.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span className={`font-black text-lg ${tx.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 bg-black/20 rounded-xl border border-white/5 text-gray-500 text-xs uppercase tracking-widest font-bold text-center">
                {t.profile.noHistory}
              </div>
            )}
          </div>
        </section>

        {/* Nueva sección interactiva de información del socio */}
        <EditProfileSection user={user} />

        <section>
           <div className="flex items-end justify-between mb-8">
             <div>
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{t.profile.calendarTitle}</h2>
               <p className="text-gray-500 text-sm font-medium mt-2">{t.profile.calendarDesc}</p>
             </div>
           </div>
           <InteractiveCalendar 
             events={events} 
             allowRSVP={true} 
             userAttendances={userAttendances} 
           />
        </section>
      </div>
    </main>
  );
}
