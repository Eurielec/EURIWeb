'use client';

import { useState } from 'react';
import { toggleProductStatusAction, deleteProductAction } from './actions';
import { Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';

export function ToggleStatusButton({ id, active }: { id: string; active: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!confirm(`¿Estás seguro de que quieres ${active ? 'desactivar' : 'activar'} este producto?`)) return;
    setLoading(true);
    await toggleProductStatusAction(id, !active);
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
        active 
          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20' 
          : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/10'
      }`}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : active ? <Eye size={12} /> : <EyeOff size={12} />}
      {active ? 'Visible' : 'Oculto'}
    </button>
  );
}

export function DeleteProductButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('¿Estás seguro de que quieres ELIMINAR este producto? Esta acción no se puede deshacer.')) return;
    setLoading(true);
    try {
      const res = await deleteProductAction(id);
      if (res && !res.success) {
        alert(res.error);
      }
    } catch (err) {
      alert('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      Eliminar
    </button>
  );
}
