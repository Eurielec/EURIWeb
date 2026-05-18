import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminPollsClient from './AdminPollsClient';

export default async function AdminVotacionesPage() {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    redirect('/admin');
  }

  const polls = await prisma.poll.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      attendees: true,
      votes: true,
    }
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-red-600 uppercase tracking-tighter italic">
            Asambleas
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest mt-2 text-[10px]">
            Gestión de Votaciones
          </p>
        </div>
      </header>

      <AdminPollsClient initialPolls={polls} />
    </div>
  );
}
