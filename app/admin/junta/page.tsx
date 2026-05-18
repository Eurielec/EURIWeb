import { getJuntaMembersAction } from '@/app/actions/junta';
import JuntaAdminClient from './JuntaAdminClient';
import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function JuntaAdminPage() {
  const session = await getUserSession();

  if (session?.role !== 'ADMIN') {
    redirect('/admin');
  }

  const members = await getJuntaMembersAction();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <header>
        <h1 className="text-5xl font-black text-red-600 uppercase tracking-tighter italic">
          Gestión de la Junta
        </h1>
        <p className="text-gray-400 mt-3 text-lg font-medium">
          Administra los miembros que aparecen en el carrusel de la página pública.
        </p>
        <div className="w-20 h-1 bg-red-600 mt-6" />
      </header>

      <JuntaAdminClient initialMembers={members} />
    </div>
  );
}
