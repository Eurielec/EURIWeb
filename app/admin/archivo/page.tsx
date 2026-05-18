'use server';

import { getDocuments } from '@/app/actions/archivo';
import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ArchivoClient from './ArchivoClient';

export default async function AdminArchivoPage() {
  const session = await getUserSession();
  
  if (!session || session.role !== 'ADMIN') {
    redirect('/admin');
  }

  const documents = await getDocuments();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
          Gestión de <span className="text-red-600">Archivo</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">Control panel de transparencia y documentos oficiales.</p>
      </div>

      <ArchivoClient initialDocuments={JSON.parse(JSON.stringify(documents))} />
    </div>
  );
}
