'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteEventAction } from '@/app/actions/events';

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('¿Seguro que quieres borrar este evento?')) {
      startTransition(async () => {
        await deleteEventAction(eventId);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending}
      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
      title="Eliminar Evento"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
