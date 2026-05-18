'use client';

import { useActionState } from 'react';
import { registerAction } from '@/app/actions/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl p-6 sm:p-8 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl m-4 my-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2 leading-tight">
            Crear Cuenta
          </h1>
          <p className="text-gray-400 text-sm">Únete a la asociación Eurielec</p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre Completo</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-gray-600"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-gray-600"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Teléfono</label>
              <input type="tel" name="phone" required className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600" placeholder="+34 600..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Código Postal</label>
              <input type="text" name="zipCode" required className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600" placeholder="28001" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Escuela (UPM)</label>
              <select name="university" required className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all">
                <option value="">Selecciona tu escuela...</option>
                <option value="ETSI Telecomunicación (ETSIT)">ETSI Telecomunicación (ETSIT)</option>
                <option value="ETSI Sistemas de Telecomunicación (ETSIST)">ETSI Sistemas de Telecomunicación (ETSIST)</option>
                <option value="ETSI Informáticos (ETSIINF)">ETSI Informáticos (ETSIINF)</option>
                <option value="ETSI Sistemas Informáticos (ETSISI)">ETSI Sistemas Informáticos (ETSISI)</option>
                <option value="ETSI Industriales (ETSII)">ETSI Industriales (ETSII)</option>
                <option value="ETSI Diseño Industrial (ETSIDI)">ETSI Diseño Industrial (ETSIDI)</option>
                <option value="ETSI Aeronáutica y del Espacio (ETSIAE)">ETSI Aeronáutica y del Espacio (ETSIAE)</option>
                <option value="ETS Arquitectura (ETSAM)">ETS Arquitectura (ETSAM)</option>
                <option value="ETS Edificación (ETSEM)">ETS Edificación (ETSEM)</option>
                <option value="ETSI Agronómica (ETSIAAB)">ETSI Agronómica (ETSIAAB)</option>
                <option value="ETSI Caminos (ETSICCP)">ETSI Caminos (ETSICCP)</option>
                <option value="ETSI Minas y Energía (ETSIME)">ETSI Minas y Energía (ETSIME)</option>
                <option value="ETSI Montes">ETSI Montes</option>
                <option value="ETSI Navales (ETSIN)">ETSI Navales (ETSIN)</option>
                <option value="ETSI Civil (ETSIC)">ETSI Civil (ETSIC)</option>
                <option value="ETSI Topografía (ETSITGC)">ETSI Topografía (ETSITGC)</option>
                <option value="INEF">INEF (Ciencias del Deporte)</option>
                <option value="Otra Escuela UPM">Otra Escuela UPM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Curso</label>
              <select name="academicYear" required className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all">
                <option value="">Selecciona tu curso...</option>
                <option value="1º">1º</option>
                <option value="2º">2º</option>
                <option value="3º">3º</option>
                <option value="4º">4º</option>
                <option value="Máster">Máster</option>
                <option value="Doctorado">Doctorado</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-300 mb-1.5">Dirección Completa (Calle, Piso, Puerta)</label>
             <input type="text" name="address" required className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600" placeholder="C/ Falsa 123, 4º Derecha" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Ciudad</label>
              <input type="text" name="city" required className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600" placeholder="Madrid" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Provincia</label>
              <select name="province" required className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all">
                <option value="">Selecciona tu provincia...</option>
                <option value="A Coruña">A Coruña</option>
                <option value="Álava">Álava</option>
                <option value="Albacete">Albacete</option>
                <option value="Alicante">Alicante</option>
                <option value="Almería">Almería</option>
                <option value="Asturias">Asturias</option>
                <option value="Ávila">Ávila</option>
                <option value="Badajoz">Badajoz</option>
                <option value="Baleares">Baleares</option>
                <option value="Barcelona">Barcelona</option>
                <option value="Burgos">Burgos</option>
                <option value="Cáceres">Cáceres</option>
                <option value="Cádiz">Cádiz</option>
                <option value="Cantabria">Cantabria</option>
                <option value="Castellón">Castellón</option>
                <option value="Ciudad Real">Ciudad Real</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Cuenca">Cuenca</option>
                <option value="Girona">Girona</option>
                <option value="Granada">Granada</option>
                <option value="Guadalajara">Guadalajara</option>
                <option value="Gipuzkoa">Gipuzkoa</option>
                <option value="Huelva">Huelva</option>
                <option value="Huesca">Huesca</option>
                <option value="Jaén">Jaén</option>
                <option value="La Rioja">La Rioja</option>
                <option value="Las Palmas">Las Palmas</option>
                <option value="León">León</option>
                <option value="Lleida">Lleida</option>
                <option value="Lugo">Lugo</option>
                <option value="Madrid">Madrid</option>
                <option value="Málaga">Málaga</option>
                <option value="Murcia">Murcia</option>
                <option value="Navarra">Navarra</option>
                <option value="Ourense">Ourense</option>
                <option value="Palencia">Palencia</option>
                <option value="Pontevedra">Pontevedra</option>
                <option value="Salamanca">Salamanca</option>
                <option value="Segovia">Segovia</option>
                <option value="Sevilla">Sevilla</option>
                <option value="Soria">Soria</option>
                <option value="Tarragona">Tarragona</option>
                <option value="Santa Cruz de Tenerife">Santa Cruz de Tenerife</option>
                <option value="Teruel">Teruel</option>
                <option value="Toledo">Toledo</option>
                <option value="Valencia">Valencia</option>
                <option value="Valladolid">Valladolid</option>
                <option value="Bizkaia">Bizkaia</option>
                <option value="Zamora">Zamora</option>
                <option value="Zaragoza">Zaragoza</option>
                <option value="Ceuta">Ceuta</option>
                <option value="Melilla">Melilla</option>
              </select>
            </div>
          </div>

          {state?.error && (
            <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-center animate-pulse">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {pending ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center flex flex-col gap-4">
          <Link href="/api/auth/google" className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </Link>
          <div className="text-sm text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
