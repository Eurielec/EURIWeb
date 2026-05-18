'use client';

import { X, Calendar as CalendarIcon } from 'lucide-react';
import { EventData } from './Calendar'; 

export default function DayModal({
  date,
  events,
  onClose,
  onSelectEvent
}: {
  date: Date;
  events: EventData[];
  onClose: () => void;
  onSelectEvent: (eventId: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#0a0a0a] border border-white/10 rounded-none w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(232,22,27,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-red-600" strokeWidth={3} />
            Agenda del Día
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-red-600/10 text-white/40 hover:text-red-600 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8">
          <p className="text-red-600/80 mb-6 font-black text-[0.65rem] uppercase tracking-[0.2em] bg-red-600/5 inline-block px-4 py-1.5 border border-red-600/20">
            {date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          {events.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hay eventos programados para este día.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(event => {
                let cssColors = 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10';
                if (event.color?.includes('red')) cssColors = 'bg-red-500/10 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/20';
                if (event.color?.includes('purple')) cssColors = 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/20';
                if (event.color?.includes('blue')) cssColors = 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/20';
                if (event.color?.includes('orange')) cssColors = 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/20';

                return (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event.id)}
                    className={`w-full text-left p-5 rounded-none border transition-all duration-300 group ${cssColors}`}
                  >
                    <div className="font-black text-white group-hover:text-red-600 transition-colors flex justify-between items-center uppercase tracking-tight">
                      <span>{event.title}</span>
                      <span className="text-[0.6rem] font-black opacity-40 bg-black/40 px-2 py-1 border border-white/5 group-hover:border-red-600/30">
                        {event.type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
