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

  const inputClass = "w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all text-sm";
  const inputWithIconClass = "w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all text-sm";
  const selectClass = "w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all text-sm appearance-none";
  const selectWithIconClass = "w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all text-sm appearance-none";
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1";
  const sectionTitleClass = "text-red-500 font-bold text-sm uppercase tracking-widest border-b border-white/10 pb-2 mb-4 mt-2";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in cursor-pointer"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#111] border border-white/10 shadow-2xl shadow-red-900/20 rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
              <User className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {isAdmin ? 'Gestión de' : (mode === 'logistics' ? 'Logística de' : 'Mi Perfil')} <span className="text-red-500">Socio</span>
              </h2>
              <p className="text-gray-400 text-xs font-medium tracking-wide">
                ID Sistema: {user.id.substring(0, 8)}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-6 overflow-y-auto custom-scrollbar flex-1 bg-transparent">
          <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna Izquierda: Personal */}
              <div className="space-y-5">
                {(isAdmin && mode === 'all') && (
                  <div className="space-y-4">
                    <h3 className={sectionTitleClass}>Privilegios Administrativos</h3>
                    <div className="space-y-4 bg-red-900/10 p-5 rounded-xl border border-red-500/20">
                      <div className="relative">
                        <label className={labelClass}>Rango del Miembro</label>
                        <div className="relative">
                          <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                          <select 
                            name="role" 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className={selectWithIconClass}
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
                          <label className={labelClass}>Vocalía Asignada</label>
                          <select 
                            name="vocalia" 
                            defaultValue={user.vocalia || ''}
                            required
                            className={selectClass}
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
                  <div>
                    <h3 className={sectionTitleClass}>Ficha Personal</h3>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <label className={labelClass}>Nombre Completo</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input type="text" name="name" defaultValue={user.name || ''} required className={inputWithIconClass} />
                        </div>
                      </div>

                      <div className="relative">
                        <label className={labelClass}>Correo Eurielec</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input type="email" name="email" defaultValue={user.email} required readOnly={!isAdmin} className={`${inputWithIconClass} ${!isAdmin && 'opacity-60 cursor-not-allowed bg-black/60'}`} />
                        </div>
                      </div>

                      <div className="relative">
                        <label className={labelClass}>Teléfono de Contacto</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input type="tel" name="phone" defaultValue={user.phone || ''} required className={inputWithIconClass} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(mode === 'all' || mode === 'personal') && (
                  <div>
                    <h3 className={sectionTitleClass}>Vectores Académicos</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className={labelClass}>Año Académico</label>
                        <select name="academicYear" defaultValue={user.academicYear || '1'} required className={selectClass}>
                          <option value="1">1º Grado</option>
                          <option value="2">2º Grado</option>
                          <option value="3">3º Grado</option>
                          <option value="4">4º Grado</option>
                          <option value="5">Máster</option>
                          <option value="Doctorado">Doctorado</option>
                        </select>
                      </div>
                      <div className="relative">
                        <label className={labelClass}>Universidad</label>
                        <input type="text" name="university" defaultValue={user.university || 'UPM'} required className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Columna Derecha: Localización y Logística */}
              <div className="space-y-5">
                {(mode === 'all' || mode === 'personal') && (
                  <div>
                    <h3 className={sectionTitleClass}>Localización Residencial</h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <label className={labelClass}>Dirección Completa</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input type="text" name="address" defaultValue={user.address || ''} required className={inputWithIconClass} />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="relative flex-1">
                          <label className={labelClass}>Núcleo Urbano</label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input type="text" name="city" defaultValue={user.city || ''} required className={inputWithIconClass} />
                          </div>
                        </div>
                        <div className="relative w-1/3">
                          <label className={labelClass}>C.P.</label>
                          <input type="text" name="zipCode" defaultValue={user.zipCode || ''} required className={inputClass + ' text-center'} />
                        </div>
                      </div>

                      <div className="relative">
                        <label className={labelClass}>Provincia</label>
                        <div className="space-y-3">
                          <div className="relative">
                            <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select 
                              name="province_select" 
                              required 
                              defaultValue={['Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'A Coruña', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'].includes(user.province) ? user.province : 'Otro'}
                              onChange={(e) => {
                                const val = e.target.value;
                                const customInput = document.getElementById('edit-custom-province-container');
                                if (customInput) customInput.style.display = val === 'Otro' ? 'block' : 'none';
                              }}
                              className={selectWithIconClass}
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
                              <option value="Otro">Otro (Especificar...)</option>
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
                              placeholder="Escribe tu país o provincia..." 
                              className={inputClass} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(mode === 'all' || mode === 'logistics') && (
                  <div>
                    <h3 className={sectionTitleClass}>Vectores Logísticos de Eventos</h3>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <label className={labelClass}>Preferencias Alimentarias</label>
                        <input type="text" name="dietary" defaultValue={user.dietary || ''} placeholder="Ej: Vegano, Vegetariano, Omnívoro..." className={inputClass} />
                      </div>

                      <div className="relative">
                        <label className={labelClass}>Alergias e Intolerancias</label>
                        <input type="text" name="allergies" defaultValue={user.allergies || ''} placeholder="Ej: Gluten, Lactosa, Ninguna..." className={inputClass} />
                      </div>

                      <div className="relative">
                        <label className={labelClass}>Bebida Frecuente (Para compras)</label>
                        <input type="text" name="alcohol" defaultValue={user.alcohol || ''} placeholder="Ej: Cerveza, Refresco, Agua..." className={inputClass} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className={labelClass}>Talla Merch</label>
                          <select name="tShirtSize" defaultValue={user.tShirtSize || ''} className={selectClass}>
                            <option value="">N/A</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                          </select>
                        </div>
                        <div className="relative">
                          <label className={labelClass}>Vehículo Propio</label>
                          <select name="hasCar" defaultValue={user.hasCar ? "true" : "false"} className={selectClass}>
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {error && (
              <div className="p-4 mt-6 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-semibold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10 bg-black/60 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="edit-user-form"
            disabled={isPending}
            className="px-8 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
