import { prisma } from '@/lib/prisma';
import ProjectForm from './ProjectForm';
import { vocalias } from '@/data/vocalias';
import { Folder } from 'lucide-react';

export default async function AdminProjectsPage() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ['USER', 'VOCAL', 'ADMIN']
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: 'asc'
    }
  });

  const projects = await prisma.project.findMany({
    include: {
      members: {
        select: { name: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">Gestor de Proyectos</h1>
        <p className="text-gray-400 font-medium">Administra los desarrollos técnicos o actividades impulsadas por las vocalías.</p>
        <div className="w-16 h-1 bg-red-500 rounded-full mt-6" />
      </header>

      {/* Formulario */}
      <ProjectForm users={users} vocalias={vocalias} />

      {/* Listado de proyectos existentes (solo visual) */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2">
          <Folder className="text-red-500 w-6 h-6" /> Proyectos Exitosos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.length === 0 && (
            <p className="text-white/40 col-span-2">No hay proyectos creados aún.</p>
          )}
          {projects.map(p => (
             <div key={p.id} className="border border-white/10 p-6 font-sans hover:bg-white/5 transition-colors">
               <h3 className="font-bold text-xl text-red-500 mb-1 leading-tight">{p.title}</h3>
               <p className="text-white/60 text-sm mb-4 line-clamp-2">{p.description}</p>
               
               <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                 <div className="flex justify-between text-xs">
                    <span className="text-white/40 uppercase font-bold tracking-wider">Duración:</span>
                    <span className="text-white font-medium">{p.duration || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-white/40 uppercase font-bold tracking-wider">Vocalía:</span>
                    <span className="text-white font-medium">{vocalias.find(v => v.id === p.vocaliaId)?.name.es || p.vocaliaId}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-white/40 uppercase font-bold tracking-wider">Autores:</span>
                    <span className="text-white font-medium text-right max-w-[200px] truncate">
                      {p.members.map(m => m.name).join(', ') || 'Nadie vinculado'}
                    </span>
                 </div>
                 {p.pdfUrl && (
                   <a href={p.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-red-400 hover:text-red-300 underline mt-2 block w-full text-right">Ver Informe PDF</a>
                 )}
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
