'use client';

import { useActionState } from 'react';
import { completeProfileAction, logoutAction } from '@/app/actions/auth';
import { LogOut } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function CompletarPerfilPage() {
  const [state, formAction, pending] = useActionState(completeProfileAction, null);
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex items-start justify-center bg-brand overflow-y-auto relative pt-24 pb-12 px-4 font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl p-8 sm:p-10 card-light m-4 my-12 shadow-2xl backdrop-blur-2xl">
        <div className="text-center mb-8 relative">
          <form action={logoutAction} className="absolute top-0 right-0">
             <button type="submit" title={t.auth.completeProfile.logoutTitle} className="p-2 text-black/60 hover:text-black bg-white/40 hover:bg-white/60 rounded-xl transition-all shadow-sm">
                <LogOut className="w-5 h-5" />
             </button>
          </form>
          <h1 className="text-3xl font-black text-black uppercase tracking-tighter italic mb-2">{t.auth.completeProfile.titlePart1} <span className="text-white">{t.auth.completeProfile.titlePart2}</span></h1>
          <p className="text-black/60 text-xs font-bold tracking-widest uppercase mt-2">{t.auth.completeProfile.subtitle}</p>
        </div>

        <form action={formAction} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black text-black/70 uppercase tracking-widest mb-1.5 ml-1">{t.auth.register.phone}</label>
              <input type="tel" name="phone" required className="w-full px-5 py-4 bg-white/40 border border-white/30 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-black/40 font-bold backdrop-blur-sm" placeholder={t.auth.register.phonePlaceholder} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-black/70 uppercase tracking-widest mb-1.5 ml-1">{t.auth.register.zipCode}</label>
              <input type="text" name="zipCode" required className="w-full px-5 py-4 bg-white/40 border border-white/30 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-black/40 font-bold backdrop-blur-sm" placeholder={t.auth.register.zipCodePlaceholder} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black text-black/70 uppercase tracking-widest mb-1.5 ml-1">{t.auth.register.university}</label>
              <select name="university" required className="w-full px-5 py-4 bg-white/40 border border-white/30 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all font-bold backdrop-blur-sm">
                <option value="">{t.auth.register.universityPlaceholder}</option>
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
              <label className="block text-[10px] font-black text-black/70 uppercase tracking-widest mb-1.5 ml-1">{t.auth.register.year}</label>
              <select name="academicYear" required className="w-full px-5 py-4 bg-white/40 border border-white/30 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all font-bold backdrop-blur-sm">
                <option value="">{t.auth.register.yearPlaceholder}</option>
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
             <label className="block text-[10px] font-black text-black/70 uppercase tracking-widest mb-1.5 ml-1">{t.auth.register.address}</label>
             <input type="text" name="address" required className="w-full px-5 py-4 bg-white/40 border border-white/30 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-black/40 font-bold backdrop-blur-sm" placeholder={t.auth.register.addressPlaceholder} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black text-black/70 uppercase tracking-widest mb-1.5 ml-1">{t.auth.register.city}</label>
              <input type="text" name="city" required className="w-full px-5 py-4 bg-white/40 border border-white/30 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-black/40 font-bold backdrop-blur-sm" placeholder={t.auth.register.cityPlaceholder} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-black/70 uppercase tracking-widest mb-1.5 ml-1">{t.auth.register.province}</label>
              <select name="province" required className="w-full px-5 py-4 bg-white/40 border border-white/30 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-black transition-all font-bold backdrop-blur-sm">
                <option value="">{t.auth.register.provincePlaceholder}</option>
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
            <p className="text-white text-[10px] font-black uppercase tracking-widest bg-black/80 p-4 rounded-xl border border-black text-center animate-bounce">
               {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-5 mt-4 bg-black hover:bg-neutral-800 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-black/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? t.auth.completeProfile.submitPending : t.auth.completeProfile.submit}
          </button>
        </form>
      </div>
    </main>
  );
}
