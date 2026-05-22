'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Globe, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();
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
                {t.footer.subtitle}
              </p>
            </div>
            <p className="max-w-md text-gray-400 text-lg font-medium leading-relaxed">
              {t.footer.desc}
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
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] italic border-b border-white/5 pb-4">{t.footer.sections}</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
              {[
                { name: t.nav.home, href: '/' },
                { name: t.nav.about, href: '/conocenos' },
                { name: t.nav.board, href: '/junta' },
                { name: t.nav.vocalias ?? 'Vocalías', href: '/vocalias' },
                { name: t.nav.projects ?? 'Proyectos', href: '/proyectos' },
                { name: t.nav.events, href: '/calendario' },
                { name: t.nav.shop ?? 'Tienda', href: '/tienda' },
                { name: t.nav.archive ?? 'Archivo', href: '/archivo' },
                { name: t.nav.contact, href: '/contacto' }
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
              <Link href="/aviso-legal" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">{t.footer.legal}</Link>
              <Link href="/privacidad" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">{t.footer.privacy}</Link>
            </div>
          </div>
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} Eurielec. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
