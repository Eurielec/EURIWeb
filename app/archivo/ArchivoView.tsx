'use client';

import { useScroll } from 'framer-motion';
import { FileText, ChevronRight, Download, Search, Info, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import TerminalBackground from '@/components/TerminalBackground';

export default function ArchivoView({ documents }: { documents: any[] }) {
  const { scrollYProgress } = useScroll();
  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((v) => setScrollValue(v));
  }, [scrollYProgress]);

  const categories = [
    { id: 'transparencia', name: 'Portal de Transparencia', icon: ShieldCheck, color: 'text-green-500' },
    { id: 'actas', name: 'Actas de Junta', icon: FileText, color: 'text-red-500' },
    { id: 'protocolos', name: 'Protocolos y Normativa', icon: FileText, color: 'text-blue-500' },
    { id: 'cuentas', name: 'Cuentas y Presupuestos', icon: Search, color: 'text-orange-500' },
    { id: 'personal', name: 'Personal y Equipo', icon: Search, color: 'text-purple-500' },
    { id: 'otros', name: 'Otros Documentos', icon: Info, color: 'text-gray-500' },
  ];

  return (
    <>
      {/* Matrix Terminal Background */}
      <TerminalBackground scroll={scrollValue} />

      <main className="relative z-10 flex-1 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="relative mb-32 h-[40vh] flex flex-col justify-center">
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="w-10 h-px bg-red-600" />
                <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] italic">Eurielec Repository</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.9] animate-in fade-in slide-in-from-left-6 duration-1000">
                Archivo <br />
                <span className="text-red-600">& Transparencia</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                Consulta los documentos oficiales, protocolos y el estado de cuentas de la asociación. 
                Navega a través de las carpetas digitales de Eurielec.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {categories.map((category, idx) => {
              const categoryDocs = documents.filter((d: any) => d.category === category.id);
              const CatIcon = category.icon;

              return (
                <div 
                  key={category.id}
                  className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-6 backdrop-blur-md bg-black/20 p-4 rounded-t-2xl">
                    <div className="flex items-center gap-5 min-w-0">
                      <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 ${category.color}`}>
                        <CatIcon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic leading-tight">{category.name}</h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">{categoryDocs.length} Documentos</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {categoryDocs.length === 0 ? (
                      <p className="text-gray-600 text-xs font-black uppercase tracking-widest italic py-4">No hay archivos en esta sección</p>
                    ) : (
                      categoryDocs.map((doc: any) => (
                        <a 
                          key={doc.id}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block bg-neutral-900/90 hover:bg-red-600 transition-all duration-500 rounded-2xl p-6 border border-white/10 hover:border-red-600/50 hover:-translate-y-1 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                        >
                          <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-5 h-5 text-white/50" />
                          </div>
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-1 pr-8">
                               <p className="text-[10px] text-gray-500 group-hover:text-white/60 font-black uppercase tracking-widest transition-colors mb-1">
                                {new Date(doc.createdAt).toLocaleDateString('es-ES')}
                              </p>
                              <h3 className="text-lg font-black text-white group-hover:text-white transition-colors">{doc.title}</h3>
                              {doc.description && (
                                <p className="text-sm text-gray-400 group-hover:text-white/70 transition-colors line-clamp-1">{doc.description}</p>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-red-600 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-40 p-12 bg-neutral-900/40 border border-white/5 rounded-3xl relative overflow-hidden text-center max-w-4xl mx-auto backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-600 to-transparent opacity-50" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-6">¿Buscas algo específico?</h2>
            <p className="text-gray-400 font-medium mb-10 max-w-2xl mx-auto">
              Si necesitas un documento que no figura en esta lista o tienes alguna duda sobre la gestión de la asociación, 
              no dudes en contactar directamente con la Junta Directiva.
            </p>
            <a 
              href="/contacto"
              className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-neutral-200 transition-all transform hover:scale-105 active:scale-95"
            >
              Contactar con Administración
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
