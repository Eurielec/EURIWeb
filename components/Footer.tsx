'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-32 pb-20 px-6 font-sans relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-red-600 uppercase tracking-tighter italic leading-none">
                Eurielec
              </h2>
              <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                Comité Local de EESTEC en la ETSI Telecomunicación
              </p>
            </div>
            <p className="max-w-md text-gray-400 text-lg font-medium leading-relaxed">
              La asociación de estudiantes donde la tecnología cobra vida. Formamos a los ingenieros del futuro mediante práctica, comunidad y aprendizaje compartido.
            </p>
            <div className="flex gap-4">
               <a href="https://instagram.com/eesteclcmadrid" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 hover:bg-red-600 text-white rounded-2xl transition-all border border-white/10 group">
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://eestec.net" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 hover:bg-red-600 text-white rounded-2xl transition-all border border-white/10 group">
                <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div className="lg:col-span-2 space-y-10">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] italic border-b border-white/5 pb-4">Secciones</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
              {[
                { name: 'Inicio', href: '/' },
                { name: 'Conócenos', href: '/conocenos' },
                { name: 'La Junta', href: '/junta' },
                { name: 'Vocalías', href: '/vocalias' },
                { name: 'Proyectos', href: '/proyectos' },
                { name: 'Eventos', href: '/calendario' },
                { name: 'Tienda', href: '/tienda' },
                { name: 'Archivo', href: '/archivo' },
                { name: 'Contacto', href: '/contacto' }
              ].map(link => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-gray-400 hover:text-red-500 font-bold text-lg transition-colors flex items-center justify-between group"
                >
                  {link.name}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all font-black text-red-600" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex items-center gap-6">
               <img 
                  src="/logo-eurielec.png" 
                  alt="Eurielec" 
                  className="h-6 w-auto bg-white px-1 py-0.5 opacity-85 hover:opacity-100 transition-all object-contain" 
                />
               <div className="w-px h-4 bg-white/10" />
               <img src="/logo-eestec.png" alt="EESTEC" className="h-4 w-auto grayscale opacity-50" />
            </div>
            <div className="flex gap-6">
              <Link href="/aviso-legal" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Aviso Legal</Link>
              <Link href="/privacidad" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacidad</Link>
            </div>
          </div>
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} Eurielec. Built for Future Engineers.
          </p>
        </div>
      </div>
    </footer>
  );
}
