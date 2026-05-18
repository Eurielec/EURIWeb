'use client';

import { useState, useEffect } from 'react';
import { updateShopSettingAction, getShopSettingsAction } from './actions';
import { Power, Lock, Unlock, Loader2 } from 'lucide-react';

export default function StoreControls() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const s = await getShopSettingsAction();
      setSettings(s);
      setLoading(false);
    }
    load();
  }, []);

  async function toggleSetting(key: string, currentValue: string) {
    const newValue = currentValue === 'open' ? 'closed' : 'open';
    setUpdating(key);
    await updateShopSettingAction(key, newValue);
    setSettings(prev => ({ ...prev, [key]: newValue }));
    setUpdating(null);
  }

  if (loading) return <div className="h-24 animate-pulse bg-neutral-900/40 rounded-[2rem] border border-white/5" />;

  const categories = [
    { key: 'hoodies_status', label: 'Sudaderas', statusLabel: 'Campaña' },
    { key: 'merch_status', label: 'Merchandising', statusLabel: 'Permanente' }
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
      {categories.map(cat => {
        const isOpen = settings[cat.key] === 'open';
        const isUpdating = updating === cat.key;

        return (
          <div key={cat.key} className="bg-neutral-900/40 p-10 rounded-[3rem] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-xl shadow-2xl group transition-all hover:border-red-600/20 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] transition-opacity duration-500 ${isOpen ? 'bg-green-500/20 opacity-100' : 'bg-red-600/10 opacity-0'}`} />
            
            <div className="flex items-center gap-6 relative z-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isOpen ? 'bg-red-600 text-white' : 'bg-black text-gray-700'}`}>
                {isOpen ? <Unlock size={28} /> : <Lock size={28} />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-2 italic">{cat.statusLabel}</p>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{cat.label}</h3>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-600'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isOpen ? 'text-green-500' : 'text-red-700'}`}>
                    {isOpen ? 'Venta Activa' : 'Logística Cerrada'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleSetting(cat.key, settings[cat.key] || 'closed')}
              disabled={isUpdating}
              className={`relative z-10 flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-2xl min-w-[200px] ${
                isOpen 
                  ? 'bg-red-600/10 text-red-600 border border-red-600/20 hover:bg-red-600/20' 
                  : 'bg-white text-black hover:bg-gray-100 shadow-white/10'
              }`}
            >
              {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
              {isOpen ? 'Cerrar Canal' : 'Apertura'}
            </button>
          </div>
        );
      })}
    </section>
  );
}
