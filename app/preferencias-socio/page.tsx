'use client';

import { useActionState } from 'react';
import { updatePreferencesAction } from './actions';

export default function PreferenciasSocioPage() {
  const [state, formAction, pending] = useActionState(updatePreferencesAction, null);

  return (
    <main className="min-h-screen flex items-start justify-center bg-black overflow-y-auto relative pt-24 pb-12 px-4 font-sans">
      {/* Luces estéticas base rojo/negro Eurielec */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl p-12 bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-[3rem] shadow-2xl">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-600/30 text-red-600 bg-red-600/5 mb-6">
            Logística Institucional
          </span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic">
            Preferencias de <span className="text-red-600">Socio</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium leading-relaxed px-4">Como socio de Eurielec, necesitamos sincronizar estos detalles finales para la logística oficial de eventos.</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Preferencias Alimentarias</label>
              <select name="dietary" required className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors">
                <option value="">Selecciona opción...</option>
                <option value="Ninguna">Ninguna (Como de todo)</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Vegano">Vegano</option>
                <option value="Halal">Halal</option>
                <option value="Kosher">Kosher</option>
                <option value="Otro">Otro (Especificar en Alergias)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Talla de Camiseta</label>
              <select name="tShirtSize" required className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors">
                <option value="">Selecciona talla...</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Alergias o Intolerancias</label>
             <input type="text" name="allergies" className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-700" placeholder="Ej: Cacahuetes, Lactosa, Polen... (Opcional)" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Alcohol de Mezcla Preferido</label>
              <select name="alcohol" required className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors">
                <option value="">Selecciona bebida...</option>
                <option value="No bebo alcohol">No bebo alcohol / Cerveza sin</option>
                <option value="Cerveza">Cerveza</option>
                <option value="Ron">Ron (Añejo/Blanco)</option>
                <option value="Vodka">Vodka</option>
                <option value="Ginebra Blanca">Ginebra Blanca</option>
                <option value="Ginebra Rosa">Ginebra Rosa</option>
                <option value="Whisky">Whisky</option>
                <option value="Tequila">Tequila</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">¿Dispones de Coche?</label>
              <select name="hasCar" required className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors">
                <option value="false">No tengo vehículo</option>
                <option value="true">Sí (Lo puedo aportar para eventos)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1.5 ml-1 leading-snug">Ayuda para cuadrar la logística de IMWs e Idas a Eventos.</p>
            </div>
          </div>

          {state?.error && (
            <p className="text-red-400 text-sm bg-red-500/10 p-3.5 rounded-xl border border-red-500/20 text-center font-bold">
               {state.error}
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={pending}
              className="w-full py-4 px-4 bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest rounded-xl transition-all focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {pending ? 'Actualizando Perfil...' : 'Confirmar Datos Logísticos'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
