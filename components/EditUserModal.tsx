'use client';

import { useState, useTransition } from 'react';
import { User, X, Mail, Phone, MapPin, Building2, Map, ShieldAlert } from 'lucide-react';
import { updateUserAction } from '@/app/actions/users';

export default function EditUserModal({ 
  user, 
  onClose,
  isAdmin = false,
  mode = 'all'
}: { 
  user: any; 
  onClose: () => void;
  isAdmin?: boolean;
  mode?: 'all' | 'personal' | 'logistics';
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>(user.role || 'GUEST');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateUserAction(user.id, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 font-sans">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in cursor-pointer"
        onClick={onClose}
      />
      
      <div className="relative w-full h-full max-w-[98vw] max-h-[98dvh] bg-neutral-900 border border-white/5 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
              <User className="text-white w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                {isAdmin ? 'Gestión de' : (mode === 'logistics' ? 'Logística de' : 'Mi Perfil')} <span className="text-red-600">Socio</span>
              </h2>
              <p className="text-gray-600 text-[14px] font-black uppercase tracking-[0.2em] mt-1 opacity-60">
                System Reference: {user.id.substring(0, 8)}
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
        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-neutral-900/40 backdrop-blur-3xl">
          <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Información Personal */}
              <div className="space-y-8">
                {(isAdmin && mode === 'all') && (
                  <div className="space-y-6">
                    <h3 className="text-red-600 font-black text-[14px] uppercase tracking-[0.2em] italic border-b border-white/5 pb-2">Privilegios</h3>
                    <div className="space-y-4 bg-red-600/5 p-6 rounded-2xl border border-red-600/10">
                      <div className="relative">
                        <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Rango del Miembro</label>
                        <div className="relative">
                          <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                          <select 
                            name="role" 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full bg-black/60 border border-white/5 rounded-xl py-5 pl-14 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none font-bold text-lg"
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
                          <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Vocalía</label>
                          <select 
                            name="vocalia" 
                            defaultValue={user.vocalia || ''}
                            required
                            className="w-full bg-black/60 border border-white/5 rounded-xl py-5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none font-bold text-lg"
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
                  </div>
                )}

                {(mode === 'all' || mode === 'personal') && (
                  <>
                    <h3 className="text-red-600 font-black text-[14px] uppercase tracking-[0.2em] italic border-b border-white/5 pb-2 text-right">Ficha Personal</h3>
                    
                    <div className="relative">
                      <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Nombre Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="text" name="name" defaultValue={user.name || ''} required className="w-full bg-black/40 border border-white/10 rounded-xl py-5 pl-14 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg" />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Correo Eurielec</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="email" name="email" defaultValue={user.email} required readOnly={!isAdmin} className={`w-full bg-black/40 border border-white/10 rounded-xl py-5 pl-14 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg ${!isAdmin && 'opacity-50 grayscale cursor-not-allowed'}`} />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Terminal de Contacto</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="tel" name="phone" defaultValue={user.phone || ''} required className="w-full bg-black/40 border border-white/10 rounded-xl py-5 pl-14 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Localización y/o Logística */}
              <div className="space-y-8">
                {(mode === 'all' || mode === 'personal') && (
                  <>
                
                <div className="relative">
                  <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Dirección Residencial</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" name="address" defaultValue={user.address || ''} required className="w-full bg-black/40 border border-white/10 rounded-xl py-5 pl-14 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Núcleo Urbano</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input type="text" name="city" defaultValue={user.city || ''} required className="w-full bg-black/40 border border-white/10 rounded-xl py-5 pl-14 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg" />
                    </div>
                  </div>
                  <div className="relative w-1/3">
                    <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">C.P.</label>
                    <input type="text" name="zipCode" defaultValue={user.zipCode || ''} required className="w-full bg-black/40 border border-white/10 rounded-xl py-5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-center text-lg" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Provincia</label>
                  <div className="space-y-4">
                    <div className="relative">
                      <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <select 
                        name="province_select" 
                        required 
                        defaultValue={['Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'A Coruña', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'].includes(user.province) ? user.province : 'Otro'}
                        onChange={(e) => {
                          const val = e.target.value;
                          const customInput = document.getElementById('edit-custom-province-container');
                          if (customInput) customInput.style.display = val === 'Otro' ? 'block' : 'none';
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-5 pl-14 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none font-black text-lg"
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
                    
                    <div 
                      id="edit-custom-province-container" 
                      style={{ display: ['Madrid', 'A Coruña', 'Valencia', 'Barcelona', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Baleares', 'Las Palmas', 'Vizcaya', 'Alicante', 'Burgos'].includes(user.province) ? 'none' : 'block' }} 
                      className="animate-in slide-in-from-top-2"
                    >
                       <input 
                        type="text" 
                        name="province_custom" 
                        defaultValue={user.province}
                        placeholder="Escribe tu provincia..." 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg" 
                      />
                    </div>
                  </div>
                </div>
                </>
                )}

                {(mode === 'all' || mode === 'logistics') && (
                  <div className="space-y-6 pt-4">
                    <h3 className="text-red-600 font-black text-[14px] uppercase tracking-[0.2em] italic border-b border-white/5 pb-2">Vectores Logísticos</h3>
                    
                    <div className="relative">
                      <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Preferencias Alimentarias</label>
                      <input type="text" name="dietary" defaultValue={user.dietary || ''} placeholder="Ej: Vegano, Vegetariano, Omnívoro..." className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg" />
                    </div>

                    <div className="relative">
                      <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Alergias e Intolerancias</label>
                      <input type="text" name="allergies" defaultValue={user.allergies || ''} placeholder="Ej: Gluten, Lactosa, Ninguna..." className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg" />
                    </div>

                    <div className="relative">
                      <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Bebida Frecuente (Eventos)</label>
                      <input type="text" name="alcohol" defaultValue={user.alcohol || ''} placeholder="Ej: Cerveza, Refresco, Agua..." className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg" />
                    </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Talla</label>
                      <select name="tShirtSize" defaultValue={user.tShirtSize || ''} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg">
                        <option value="">N/A</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Vehículo</label>
                      <select name="hasCar" defaultValue={user.hasCar ? "true" : "false"} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg">
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                  </div>
                </div>
                )}

                {(mode === 'all' || mode === 'personal') && (
                  <div className="space-y-6">
                    <h3 className="text-red-600 font-black text-[14px] uppercase tracking-[0.2em] italic border-b border-white/5 pb-2">Vectores Académicos</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Año Académico</label>
                        <select name="academicYear" defaultValue={user.academicYear || '1'} required className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg">
                          <option value="1">1º Grado</option>
                          <option value="2">2º Grado</option>
                          <option value="3">3º Grado</option>
                          <option value="4">4º Grado</option>
                          <option value="5">Máster</option>
                          <option value="Doctorado">Doctorado</option>
                        </select>
                      </div>
                      <div className="relative">
                        <label className="block text-[14px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Universidad</label>
                        <input type="text" name="university" defaultValue={user.university || 'UPM'} required className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-black text-lg" />
                      </div>
                    </div>
                  </div>
                )}
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
            className="px-10 py-5 rounded-2xl text-[14px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
          >
            Abortar
          </button>
          <button
            type="submit"
            form="edit-user-form"
            disabled={isPending}
            className="px-14 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[14px] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
          >
            {isPending ? 'Sincronizando...' : 'Publicar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
