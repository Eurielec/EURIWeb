'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand overflow-hidden relative font-sans px-4">
      {/* Background decorations - Brand Theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 card-light m-4 shadow-2xl backdrop-blur-2xl">
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
             <span className="text-white font-black text-3xl">E</span>
           </div>
          <h1 className="text-4xl font-black text-black mb-2 uppercase tracking-tighter italic">Acceso <span className="text-white">Socio</span></h1>
          <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mt-2">Eurielec Central Systems</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-black/70 uppercase tracking-widest mb-2 ml-1">
                Credenciales Eurielec
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-5 py-4 bg-white/40 border border-white/30 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-black/40 font-bold backdrop-blur-sm"
                placeholder="socio@eurielec.es"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-black/70 uppercase tracking-widest mb-2 ml-1">
                Código de Acceso
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-5 py-4 bg-white/40 border border-white/30 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-black/40 font-bold backdrop-blur-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {state?.error && (
            <p className="text-white text-[10px] font-black uppercase tracking-widest bg-black/80 p-4 rounded-xl border border-black text-center animate-bounce">
              ALERTA: {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-5 bg-black hover:bg-neutral-800 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-black/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? 'Autorizando...' : 'Entrar en el Sistema'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-black/10 text-center flex flex-col gap-5">
          <Link href="/api/auth/google" className="flex items-center justify-center gap-4 w-full py-4 bg-white/40 hover:bg-white/60 border border-white/50 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sincronizar con Google
          </Link>
          <div className="text-[10px] font-black text-black/70 uppercase tracking-widest">
            ¿No eres miembro? <Link href="/register" className="text-white hover:text-black transition-colors ml-1 underline decoration-2 underline-offset-4">Regístrate</Link>
          </div>
        </div>
      </div>
    </main>
  );
}