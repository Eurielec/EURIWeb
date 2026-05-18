'use client';

import { useState, useTransition } from 'react';
import { createEventAction } from '@/app/actions/events';
import { MapPin } from 'lucide-react';

export function CreateEventForm() {
  const [isPaid, setIsPaid] = useState(false);
  const [isOpenEvent, setIsOpenEvent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (isOpenEvent) {
      formData.set('isOpenEvent', 'true');
      formData.delete('price');
    } else {
      if (!isPaid) formData.delete('price');
    }
    
    startTransition(async () => {
      await createEventAction(formData);
      (e.target as HTMLFormElement).reset();
      setIsPaid(false);
      setIsOpenEvent(false);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Título del Evento</label>
        <input type="text" name="title" required className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder:text-gray-600" placeholder="Ej: Reunión General" />
      </div>
      
      <div>
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex justify-between items-center">
          Fecha y Hora de Inicio
          <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[8px]">Requerido</span>
        </label>
        <input type="datetime-local" name="date" required className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600" />
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex justify-between items-center">
          Fecha y Hora de Fin
          {isOpenEvent ? (
            <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded text-[8px]">Requerido (Evento Continuo)</span>
          ) : (
            <span className="text-gray-500 bg-black/40 px-2 py-0.5 rounded text-[8px]">Opcional</span>
          )}
        </label>
        <input type="datetime-local" name="endDate" required={isOpenEvent} className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600" />
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 text-red-600">Deadline de Inscripción (Opcional)</label>
        <input type="datetime-local" name="registrationDeadline" className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600" />
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Tipo y Color</label>
        <div className="grid grid-cols-2 gap-3">
          <select name="type" className="bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600">
            <option value="ASSOCIATION">Asociación</option>
            <option value="EXAM">Examen</option>
            <option value="HOLIDAY">Festivo / Otro</option>
            <option value="WORKSHOP">Workshop</option>
          </select>
          <select name="color" className="bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600">
            <option value="bg-red-600">Rojo Eurielec (Recomendado)</option>
            <option value="bg-neutral-800">Gris Oscuro</option>
            <option value="bg-white">Blanco</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
          <span>Puntos que otorga (Gamificación)</span>
          <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+ Puntos</span>
        </label>
        <input type="number" name="pointsReward" defaultValue={20} min={0} required className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-emerald-400 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpenEvent(!isOpenEvent)}>
          <div>
            <p className="text-sm font-bold text-white mb-1">Evento Continuo / Abierto</p>
            <p className="text-xs text-gray-500 font-medium">No requiere pago, dura varios días y el botón dirá "Me pasaré". Ideal para Hackathons y Workshops.</p>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${isOpenEvent ? 'bg-red-600' : 'bg-neutral-800'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isOpenEvent ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      {!isOpenEvent && (
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Modalidad de Acceso</label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button 
              type="button"
              onClick={() => setIsPaid(false)}
              className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${!isPaid ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-black/50 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
            >
              Gratuito
            </button>
            <button 
              type="button"
              onClick={() => setIsPaid(true)}
              className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${isPaid ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-black/50 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
            >
              De Pago
            </button>
          </div>
          
          {isPaid && (
            <div className="relative animate-in slide-in-from-top-2 fade-in duration-200">
              <input type="number" step="0.01" min="0.01" name="price" required className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder:text-gray-600" placeholder="Precio (ej: 5.00)" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">€</span>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          <MapPin className="w-3 h-3 text-red-600" /> Coordenadas / Lugar
        </label>
        <input type="text" name="location" className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder:text-gray-600" placeholder="URL Google Maps o Aula" />
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Descripción Corta</label>
        <textarea name="description" rows={3} className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder:text-gray-600" placeholder="Detalles extra..."></textarea>
      </div>

      <button type="submit" disabled={isPending} className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50">
        {isPending ? 'Publicando...' : 'Publicar Evento'}
      </button>
    </form>
  );
}
