'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { joinPollAction, voteAction } from '@/app/actions/polls';
import { ThumbsUp, ThumbsDown, Minus, Activity, ShieldCheck } from 'lucide-react';

export default function UserPollsClient({ polls }: { polls: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Auto-refresh para ver si hay nuevas votaciones o si se cierran
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 4000);
    return () => clearInterval(interval);
  }, [router]);

  const handleJoin = (pollId: string) => {
    setError(null);
    startTransition(async () => {
      const res = await joinPollAction(pollId);
      if (res.error) setError(res.error);
    });
  };

  const handleVote = (pollId: string, choice: string) => {
    setError(null);
    startTransition(async () => {
      const res = await voteAction(pollId, choice);
      if (res.error) setError(res.error);
    });
  };

  if (polls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Activity className="w-10 h-10 text-gray-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
          No hay votaciones activas
        </h2>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
          Espera a que la Junta abra una nueva votación
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="p-4 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-black tracking-widest uppercase rounded-xl text-center">
          {error}
        </div>
      )}

      {polls.map((poll) => {
        const hasJoined = poll.attendees.length > 0;
        const currentVote = poll.votes.length > 0 ? poll.votes[0].choice : null;

        return (
          <div key={poll.id} id={poll.id} className="relative bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden scroll-mt-32">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
            
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tight mb-2">{poll.title}</h2>
              {poll.description && (
                <p className="text-gray-400 font-medium">{poll.description}</p>
              )}
              <div className="mt-4 inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 font-black tracking-widest uppercase">
                {poll.type === 'SIMPLE' ? 'Mayoría Simple' : poll.type === 'ABSOLUTE' ? 'Mayoría Absoluta' : 'Dos Tercios'}
              </div>
            </div>

            {!hasJoined ? (
              <div className="flex flex-col items-center justify-center bg-black/40 border border-white/5 p-8 rounded-2xl text-center">
                <ShieldCheck className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Control de Asistencia</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md">
                  Para participar en esta votación debes confirmar tu presencia. Si no votas tras confirmar, contará como voto en blanco.
                </p>
                <button
                  onClick={() => handleJoin(poll.id)}
                  disabled={isPending}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-red-600/20"
                >
                  {isPending ? 'Activando...' : 'Activar Modo Votación'}
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex justify-between items-end">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Emite tu voto</h3>
                  {currentVote && (
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full">
                      Voto Registrado
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleVote(poll.id, 'FAVOR')}
                    disabled={isPending}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                      currentVote === 'FAVOR' 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                        : 'bg-black/40 border-white/5 text-gray-400 hover:bg-emerald-500/5 hover:border-emerald-500/30 hover:text-emerald-500'
                    }`}
                  >
                    <ThumbsUp className="w-8 h-8 mb-3" />
                    <span className="font-black uppercase tracking-widest text-xs">A Favor</span>
                  </button>

                  <button
                    onClick={() => handleVote(poll.id, 'CONTRA')}
                    disabled={isPending}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                      currentVote === 'CONTRA' 
                        ? 'bg-red-500/20 border-red-500 text-red-400' 
                        : 'bg-black/40 border-white/5 text-gray-400 hover:bg-red-500/5 hover:border-red-500/30 hover:text-red-500'
                    }`}
                  >
                    <ThumbsDown className="w-8 h-8 mb-3" />
                    <span className="font-black uppercase tracking-widest text-xs">En Contra</span>
                  </button>

                  <button
                    onClick={() => handleVote(poll.id, 'ABSTENCION')}
                    disabled={isPending}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                      currentVote === 'ABSTENCION' 
                        ? 'bg-gray-500/20 border-gray-400 text-white' 
                        : 'bg-black/40 border-white/5 text-gray-400 hover:bg-gray-500/10 hover:border-gray-500/30 hover:text-white'
                    }`}
                  >
                    <Minus className="w-8 h-8 mb-3" />
                    <span className="font-black uppercase tracking-widest text-xs">Abstención</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
