import { prisma } from '@/lib/prisma';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { AdminEditEventModal } from '@/components/AdminEditEventModal';
import { DownloadEventSummaryBtn } from '@/components/DownloadEventSummaryBtn';
import { CreateEventForm } from '@/components/CreateEventForm';

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    where: { date: { gte: new Date() } }, // Solo próximos eventos
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <header>
        <h1 className="text-5xl font-black text-red-600 uppercase tracking-tighter italic">Gestión de Eventos</h1>
        <p className="text-gray-400 mt-3 text-lg font-medium">Planificación de calendario, reuniones y festivos institucionales.</p>
        <div className="w-20 h-1 bg-red-600 mt-6" />
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        
        {/* Formulario Crear Evento */}
        <div className="xl:col-span-1">
          <div className="bg-neutral-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl p-8 sticky top-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-600/20">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Nuevo Evento</h2>
            </div>

            <CreateEventForm />
          </div>
        </div>

        {/* Lista de Eventos */}
        <div className="xl:col-span-2 space-y-8">
          <h2 className="text-xl font-black text-white uppercase tracking-widest italic mb-2">Próximos Eventos</h2>
          <div className="h-0.5 w-full bg-white/5 mb-8" />
          
          {events.length === 0 ? (
            <div className="p-16 text-center bg-white/5 border border-white/10 rounded-[2.5rem] text-gray-500 font-medium italic">
              No hay eventos próximos programados.
            </div>
          ) : (
            <div className="grid gap-6">
              {events.map(event => (
                <div key={event.id} className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] hover:bg-white/[0.02] transition-colors group shadow-lg">
                  <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg ${event.color || 'bg-red-600'} text-white`}>
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-80">{event.date.toLocaleDateString('es-ES', { month: 'short' })}</span>
                    <span className="font-black text-3xl leading-none">{event.date.getDate()}</span>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center gap-4 justify-center sm:justify-start mb-2">
                      <h3 className="text-2xl font-black text-white group-hover:text-red-600 transition-colors uppercase tracking-tight italic">{event.title}</h3>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 bg-white/5 text-gray-500">
                        {event.type}
                      </span>
                    </div>
                    {event.description && <p className="text-gray-500 font-medium text-sm mt-1">{event.description}</p>}
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2 mt-4">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {event.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h
                    </p>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                     <DownloadEventSummaryBtn eventId={event.id} iconOnly />
                     <AdminEditEventModal eventId={event.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
