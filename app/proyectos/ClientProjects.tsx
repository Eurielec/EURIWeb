'use client';

import { useState } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface ClientProjectsProps {
  vocalias: Array<{
    id: string;
    name: { es: string; en: string };
    image: string;
    projects: Array<{
      id: string;
      title: string;
      description: string | null;
      content: string | null;
      imageUrl: string | null;
      duration: string | null;
      pdfUrl: string | null;
      members: Array<{
        id: string;
        name: string | null;
        image: string | null;
      }>;
    }>;
  }>;
  locale: string;
}

export default function ClientProjects({ vocalias, locale }: ClientProjectsProps) {
  const [activeVocaliaId, setActiveVocaliaId] = useState<string>('all');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  if (vocalias.length === 0) {
    return (
      <div className="py-24 text-center border-t border-white/10 mt-12">
        <h3 className="text-2xl font-bold text-red-500! opacity-80 uppercase tracking-widest font-sans">Aún no hay proyectos públicos</h3>
        <p className="text-red-400! opacity-80 mt-4">Nuestros socios están cocinando ideas impresionantes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 mt-12">
      {vocalias.map((vocalia) => (
        <section key={vocalia.id} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="flex items-center gap-6 border-b border-white/10 pb-4">
            <h2 className="text-4xl font-black text-red-500! uppercase tracking-tighter shadow-sm font-sans flex items-center gap-3">
              <span className="text-red-600">/</span> {locale === 'es' ? vocalia.name.es : vocalia.name.en}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-red-500/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {vocalia.projects.map((project) => {
              const isExpanded = expandedProject === project.id;
              
              return (
                <div 
                  key={project.id}
                  className="group relative rounded-3xl overflow-hidden bg-black/40 border border-white/5 transition-all duration-500 hover:border-red-500/30 flex flex-col"
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Outer container so accordion can push content down naturally */}
                  <div className="relative transition-transform duration-700 ease-out group-hover:rotate-x-1 group-hover:-rotate-y-1">
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {project.imageUrl && (
                      <div className="h-64 w-full overflow-hidden relative border-b border-white/5">
                        <div 
                          className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                          style={{ backgroundImage: `url(${project.imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      </div>
                    )}

                    <div className="p-8 flex flex-col justify-between flex-1">
                      <div className="space-y-4 relative z-10">
                        <h3 className="text-2xl font-black text-red-500! uppercase tracking-tight leading-none group-hover:text-red-400! transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className={`text-red-400! text-sm leading-relaxed font-sans font-medium ${!isExpanded ? 'line-clamp-3' : ''}`}>
                          {project.description || 'Sin descripción disponible.'}
                        </p>
                      </div>

                      <div className="mt-8 flex justify-between items-center relative z-10 w-full border-t border-white/5 pt-4">
                        <button 
                          onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                          className="flex items-center gap-2 text-sm font-bold text-red-500! tracking-widest uppercase hover:text-red-400! transition-colors focus:outline-none"
                        >
                          {isExpanded ? 'Ocultar info' : 'Saber más'} 
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                        </button>
                      </div>

                      {/* Expandable Content Area */}
                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] mt-6 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}
                      >
                        <div className="space-y-6 pt-2 border-t border-red-500/20">
                          {/* Duration info */}
                          {project.duration && (
                            <div>
                              <p className="text-[10px] font-black uppercase text-red-500/80 tracking-widest mb-1">Duración del desarrollo</p>
                              <p className="text-white font-medium">{project.duration}</p>
                            </div>
                          )}

                          {/* Members / Socios implicados */}
                          {project.members && project.members.length > 0 && (
                            <div>
                              <p className="text-[10px] font-black uppercase text-red-500/80 tracking-widest mb-3">Personas implicadas</p>
                              <div className="flex flex-wrap gap-2">
                                {project.members.map(member => (
                                  <div key={member.id} className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10 shadow-sm">
                                    <div className="w-5 h-5 rounded-full overflow-hidden bg-red-500/20 shrink-0">
                                      {member.image ? (
                                        <img src={member.image} alt={member.name || ''} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-red-500">
                                          {member.name ? member.name.charAt(0) : '?'}
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-xs font-semibold text-white/90">{member.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Download PDF button */}
                          {project.pdfUrl && (
                            <div className="pt-4">
                              <a 
                                href={project.pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                              >
                                Ver Informe del Proyecto
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </section>
      ))}
    </div>
  );
}
