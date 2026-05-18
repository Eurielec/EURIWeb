import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import UserPollsClient from './UserPollsClient';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default async function UserVotacionesPage() {
  const session = await getUserSession();
  if (!session) {
    redirect('/login');
  }

  if (!['USER', 'VOCAL', 'ADMIN'].includes(session.role)) {
    redirect('/perfil');
  }

  // Obtener todas las votaciones activas
  const activePolls = await prisma.poll.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: {
      attendees: {
        where: { userId: session.userId }
      },
      votes: {
        where: { userId: session.userId }
      }
    }
  });

  return (
    <main className="min-h-screen bg-black text-white p-8 pt-24 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 -translate-1/2 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-900/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl gap-4">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
              <CheckCircle2 className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-red-600 uppercase tracking-tighter italic">
                Asamblea
              </h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Sala de Votaciones</p>
            </div>
          </div>
          <Link href="/perfil" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest text-gray-300">
            Volver al Perfil
          </Link>
        </header>

        <section className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-xl min-h-[50vh]">
          <UserPollsClient polls={activePolls} />
        </section>
      </div>
    </main>
  );
}
