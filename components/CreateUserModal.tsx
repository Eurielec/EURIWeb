'use client';

import { useState, useTransition } from 'react';
import { User, X, Mail, Phone, MapPin, Building2, Map, ShieldAlert, GraduationCap, Calendar } from 'lucide-react';
import { createUserAction } from '@/app/actions/users';

export default function CreateUserModal({ 
  onClose 
}: { 
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('USER');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await createUserAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 font-sans">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in cursor-pointer"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-white/5 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-10 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <User className="text-white w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                Nuevo <span className="text-orange-600">Socio</span>
              </h2>
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-60">
                Alta Manual en el Sistema
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-red-600 hover:text-white rounded-2xl text-gray-500 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-neutral-900/40 backdrop-blur-3xl">
          <form id="create-user-form" onSubmit={handleSubmit} className="space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Información Personal */}
              <div className="space-y-8">
                <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-[0.2em] italic border-b border-white/5 pb-2">Identidad y Rol</h3>
                
                <div className="space-y-6 bg-orange-600/5 p-6 rounded-2xl border border-orange-600/10">
                  <div className="relative">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Rango del Miembro</label>
                    <div className="relative">
                      <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600" />
                      <select 
                        name="role" 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full bg-black/60 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 appearance-none font-bold text-sm"
                      >
                        <option value="GUEST">Invitado</option>
                        <option value="USER">Socio</option>
                        <option value="ALUMNI">Alumni</option>
                        <option value="VOCAL">Vocal</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </div>
                  </div>

                  {selectedRole === 'VOCAL' && (
                    <div className="relative animate-in slide-in-from-top-2">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Vocalía</label>
                      <select 
                        name="vocalia" 
                        required
                        className="w-full bg-black/60 border border-white/5 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 appearance-none font-bold text-sm"
                      >
                        <option value="">Selecciona Vocalía...</option>
                        <option value="it">IT</option>
                        <option value="electronica">Electrónica</option>
                        <option value="demos">Demos</option>
                        <option value="sudaderas">Sudaderas</option>
                        <option value="piruletas">Piruletas</option>
                        <option value="cena-navidad">Cena de Navidad</option>
                        <option value="pr">PR</option>
                        <option value="cr">CR</option>
                        <option value="hr">HR</option>
                        <option value="nevera">Nevera</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" name="name" required placeholder="Ej: Juan Pérez" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="email" name="email" required placeholder="socio@eurielec.etsit.upm.es" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="tel" name="phone" required placeholder="+34 600 000 000" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                </div>
              </div>

              {/* Localización y Estudios */}
              <div className="space-y-8">
                <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-[0.2em] italic border-b border-white/5 pb-2">Ubicación y Perfil Académico</h3>
                
                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Dirección</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" name="address" required placeholder="Calle, Número, Piso" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Ciudad</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input type="text" name="city" required placeholder="Madrid" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                    </div>
                  </div>
                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Provincia</label>
                  <div className="space-y-4">
                    <div className="relative">
                      <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <select 
                        name="province_select" 
                        required 
                        onChange={(e) => {
                          const val = e.target.value;
                          const customInput = document.getElementById('custom-province-container');
                          if (customInput) customInput.style.display = val === 'Otro' ? 'block' : 'none';
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 appearance-none font-bold"
                      >
                        <option value="">Selecciona...</option>
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
                        <option value="A Coruña">A Coruña</option>
                        <option value="Cuenca">Cuenca</option>
                        <option value="Girona">Girona</option>
                        <option value="Granada">Granada</option>
                        <option value="Guadalajara">Guadalajara</option>
                        <option value="Guipúzcoa">Guipúzcoa</option>
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
                        <option value="Santa Cruz de Tenerife">Santa Cruz de Tenerife</option>
                        <option value="Segovia">Segovia</option>
                        <option value="Sevilla">Sevilla</option>
                        <option value="Soria">Soria</option>
                        <option value="Tarragona">Tarragona</option>
                        <option value="Teruel">Teruel</option>
                        <option value="Toledo">Toledo</option>
                        <option value="Valencia">Valencia</option>
                        <option value="Valladolid">Valladolid</option>
                        <option value="Vizcaya">Vizcaya</option>
                        <option value="Zamora">Zamora</option>
                        <option value="Zaragoza">Zaragoza</option>
                        <option value="Ceuta">Ceuta</option>
                        <option value="Melilla">Melilla</option>
                        <option value="Otro">Otro (Especificar país/provincia...)</option>
                      </select>
                    </div>
                    
                    <div id="custom-province-container" style={{ display: 'none' }} className="animate-in slide-in-from-top-2">
                       <input 
                        type="text" 
                        name="province_custom" 
                        placeholder="Escribe tu provincia..." 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" 
                      />
                    </div>
                  </div>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Código Postal</label>
                    <input type="text" name="zipCode" required className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 font-black text-center" />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Año Académico</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <select name="academicYear" required className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 appearance-none font-bold">
                        <option value="1">1º Grado</option>
                        <option value="2">2º Grado</option>
                        <option value="3">3º Grado</option>
                        <option value="4">4º Grado</option>
                        <option value="5">Máster</option>
                        <option value="Doctorado">Doctorado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Universidad / Centro</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" name="university" defaultValue="ETSIT - UPM" required className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-600 text-xs font-black uppercase tracking-widest text-center animate-bounce">
                ADVERTENCIA: {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-black/60 flex justify-end gap-6 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="create-user-form"
            disabled={isPending}
            className="px-12 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
          >
            {isPending ? 'Creando Miembro...' : 'Dar de Alta Socio'}
          </button>
        </div>
      </div>
    </div>
  );
}
