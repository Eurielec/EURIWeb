'use client';

import { useState, useTransition } from 'react';
import { X, Award, PlusCircle, MinusCircle } from 'lucide-react';
import { adminAdjustPointsAction } from '@/app/actions/points';

export default function AdjustPointsModal({
  user,
  onClose
}: {
  user: any;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('userId', user.id);
    
    startTransition(async () => {
      const result = await adminAdjustPointsAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in cursor-pointer"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-neutral-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Gestión de Puntos</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.name || user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Puntos Actuales</span>
            <span className="text-4xl font-black text-white">{user.points || 0}</span>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Ajuste (Positivo o Negativo)</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setAmount(a => a - 10)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl">
                <MinusCircle className="w-6 h-6" />
              </button>
              <input 
                type="number" 
                name="amount" 
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 text-center text-white font-black text-2xl focus:outline-none focus:border-emerald-500" 
              />
              <button type="button" onClick={() => setAmount(a => a + 10)} className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl">
                <PlusCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Razón</label>
            <input 
              type="text" 
              name="reason" 
              required
              placeholder="Ej: Cargo en Junta, Ayuda extra..."
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <button 
            disabled={isPending || amount === 0}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all"
          >
            {isPending ? 'Guardando...' : 'Aplicar Ajuste'}
          </button>
        </form>
      </div>
    </div>
  );
}
