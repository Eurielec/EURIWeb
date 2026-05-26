'use client';

import { useState, useTransition, useEffect } from 'react';
import { createPollAction, closePollAction, deletePollAction } from '@/app/actions/polls';
import { useRouter } from 'next/navigation';
import { Plus, X, BarChart3, Users, Trash2, Share2, Check } from 'lucide-react';

export default function AdminPollsClient({ initialPolls }: { initialPolls: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  // Polling para mantener los resultados en tiempo real
  useEffect(() => {
    const activePolls = initialPolls.filter(p => p.isActive);
    if (activePolls.length > 0) {
      const interval = setInterval(() => {
        router.refresh();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [initialPolls, router]);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createPollAction(formData);
      if (res.error) setError(res.error);
      else setShowCreateForm(false);
    });
  };

  const handleClose = (pollId: string) => {
    if (!confirm('¿Estás seguro de cerrar esta votación? Se asignarán votos en BLANCO a los asistentes que no hayan votado.')) return;
    startTransition(async () => {
      const res = await closePollAction(pollId);
      if (res.error) alert(res.error);
    });
  };

  const handleDelete = (pollId: string) => {
    if (!confirm('¿Eliminar esta votación de forma permanente?')) return;
    startTransition(async () => {
      await deletePollAction(pollId);
    });
  };

  const handleCopyLink = (pollId: string) => {
    const url = `${window.location.origin}/perfil/votaciones#${pollId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(pollId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const calculateResults = (poll: any) => {
    const totalVotes = poll.votes.length;
    const favor = poll.votes.filter((v: any) => v.choice === 'FAVOR').length;
    const contra = poll.votes.filter((v: any) => v.choice === 'CONTRA').length;
    const abstencion = poll.votes.filter((v: any) => v.choice === 'ABSTENCION').length;
    const blanco = poll.votes.filter((v: any) => v.choice === 'BLANCO').length;

    let resultMsg = 'Pendiente';
    if (!poll.isActive && totalVotes > 0) {
      if (poll.type === 'SIMPLE') {
        resultMsg = favor > contra ? 'APROBADO (Mayoría Simple)' : 'RECHAZADO';
      } else if (poll.type === 'ABSOLUTE') {
        resultMsg = favor > (totalVotes / 2) ? 'APROBADO (Mayoría Absoluta)' : 'RECHAZADO';
      } else if (poll.type === 'TWO_THIRDS') {
        resultMsg = favor >= (totalVotes * 2 / 3) ? 'APROBADO (Dos Tercios)' : 'RECHAZADO';
      }
    } else if (!poll.isActive) {
      resultMsg = 'Sin votos';
    }

    return { favor, contra, abstencion, blanco, totalVotes, resultMsg };
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" />
          Nueva Votación
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="border border-white/10 p-6 space-y-6 font-sans">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black text-white italic uppercase">Crear Votación</h3>
            <button type="button" onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Título</label>
              <input name="title" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:ring-2 focus:ring-red-600 outline-none" placeholder="Ej: Aprobación de Presupuestos" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Escrutinio</label>
              <select name="scrutinyType" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:ring-2 focus:ring-red-600 outline-none">
                <option value="SIMPLE">Mayoría Simple (Más a favor que en contra)</option>
                <option value="ABSOLUTE">Mayoría Absoluta (&gt; 50% de los votos)</option>
                <option value="TWO_THIRDS">Dos Tercios (&gt;= 66.6% de los votos)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Descripción (Opcional)</label>
            <textarea name="description" rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-medium focus:ring-2 focus:ring-red-600 outline-none"></textarea>
          </div>
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <button disabled={isPending} className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all disabled:opacity-50">
            {isPending ? 'Creando...' : 'Iniciar Votación'}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {initialPolls.map((poll) => {
          const stats = calculateResults(poll);
          const percent = (val: number) => stats.totalVotes > 0 ? Math.round((val / stats.totalVotes) * 100) : 0;
          
          return (
            <div key={poll.id} className={`p-6 border ${poll.isActive ? 'bg-red-600/5 border-red-600/20' : 'border-white/10'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-black text-white italic uppercase">{poll.title}</h2>
                    {poll.isActive ? (
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black tracking-widest uppercase animate-pulse">
                        ACTIVA
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-[10px] font-black tracking-widest uppercase">
                        CERRADA
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{poll.description}</p>
                  <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
                    <span className="text-gray-500 border border-gray-700 px-2 py-1 rounded-lg">
                      {poll.type === 'SIMPLE' ? 'M. Simple' : poll.type === 'ABSOLUTE' ? 'M. Absoluta' : '2/3'}
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <Users className="w-4 h-4" /> {poll.attendees.length} Asistentes
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <BarChart3 className="w-4 h-4" /> {stats.totalVotes} Votos
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {poll.isActive ? (
                    <>
                      <button 
                        onClick={() => handleCopyLink(poll.id)}
                        className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
                        title="Copiar Enlace"
                      >
                        {copiedId === poll.id ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => handleClose(poll.id)}
                        disabled={isPending}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 transition-all"
                      >
                        Cerrar Votación
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleDelete(poll.id)}
                      disabled={isPending}
                      className="p-3 bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Statistics Panel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-black/40 p-4 rounded-2xl border border-emerald-500/20">
                  <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">A Favor</div>
                  <div className="text-2xl font-black text-white">{stats.favor}</div>
                  <div className="text-xs text-emerald-500/70">{percent(stats.favor)}%</div>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-red-500/20">
                  <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">En Contra</div>
                  <div className="text-2xl font-black text-white">{stats.contra}</div>
                  <div className="text-xs text-red-500/70">{percent(stats.contra)}%</div>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-gray-500/20">
                  <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Abstención</div>
                  <div className="text-2xl font-black text-white">{stats.abstencion}</div>
                  <div className="text-xs text-gray-500/70">{percent(stats.abstencion)}%</div>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-blue-500/20">
                  <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">Blanco</div>
                  <div className="text-2xl font-black text-white">{stats.blanco}</div>
                  <div className="text-xs text-blue-500/70">{percent(stats.blanco)}%</div>
                </div>
              </div>

              {!poll.isActive && (
                <div className="mt-4 p-4 bg-black/60 rounded-2xl border border-white/5 text-center">
                  <span className={`font-black uppercase tracking-[0.2em] ${stats.resultMsg.startsWith('APROBADO') ? 'text-emerald-500' : 'text-red-500'}`}>
                    Resultado: {stats.resultMsg}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        {initialPolls.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest text-sm">
            No hay votaciones registradas
          </div>
        )}
      </div>
    </div>
  );
}
