import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RankingClient from './RankingClient';

export default async function RankingPage() {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    redirect('/');
  }

  // Obtenemos todos los usuarios (excepto invitados pendientes si se prefiere)
  // Ordenados por puntos de mayor a menor
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: 'GUEST' // Excluir a los invitados no verificados del ranking oficial
      }
    },
    orderBy: {
      points: 'desc'
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      points: true,
      image: true,
      imwPrice: true,
      imwPaymentStatus: true
    }
  });

  const initialPriorityLists = await prisma.priorityList.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <header>
        <h1 className="text-5xl font-black text-emerald-500 uppercase tracking-tighter italic">Ranking, IMW y CP</h1>
        <p className="text-gray-400 mt-3 text-lg font-medium">Clasificación por puntos de gamificación y cálculo de precios para el IMW.</p>
        <div className="w-20 h-1 bg-emerald-500 mt-6" />
      </header>

      <RankingClient initialUsers={users} initialPriorityLists={initialPriorityLists} />
    </div>
  );
}
