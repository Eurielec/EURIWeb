'use client';

import { motion, Variants } from 'framer-motion';
import { Sparkles, Trophy, GraduationCap, Users2, ArrowRight, Globe, Brain } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useState } from 'react';
import MajorEventGallery from './MajorEventGallery';

interface MajorEvent {
  id: string;
  title: string;
  desc: string;
}

export default function MajorEvents() {
  const { t } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<MajorEvent | null>(null);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 100 
      }
    }
  };

  return (
    <section className="space-y-16 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/10 pb-8">
        <div className="space-y-2 text-foreground">
          <div className="flex items-center gap-2 text-foreground/60 mb-2">
            <Sparkles size={16} />
            <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase">Excelencia Eurielec</span>
          </div>
          <h2 className="text-foreground text-4xl md:text-5xl font-black uppercase tracking-tighter">
            {t.calendar.majorTitle}
          </h2>
          <p className="text-foreground/60 font-light text-lg italic uppercase tracking-tight">
            {t.calendar.majorSubtitle}
          </p>
        </div>
        <div className="hidden md:block">
           <span className="text-[0.6rem] font-bold tracking-[0.3em] text-foreground/40 uppercase">
             Eventos Anuales &middot; Eurielec
           </span>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-6"
      >
        {t.calendar.majorEvents.map((event: MajorEvent, index: number) => (
          <motion.div
            key={event.id}
            variants={item}
            onClick={() => setSelectedEvent(event)}
            className="group relative overflow-hidden rounded-4xl bg-black border border-white/5 hover:border-white transition-all duration-500 shadow-2xl cursor-pointer"
          >
            <div className="flex flex-col md:flex-row items-stretch min-h-[160px]">
              {/* Index number / side accent */}
              <div className="md:w-32 flex items-center justify-center p-8 bg-white/2 border-r border-white/5 relative overflow-hidden">
                 <span className="text-6xl font-black text-white/5 group-hover:text-red-600/30 transition-colors duration-700">
                   0{index + 1}
                 </span>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   {event.id === 'imw' && <Globe className="text-red-600" size={32} />}
                   {event.id === 'workshop' && <GraduationCap className="text-red-600" size={32} />}
                   {event.id === 'eurichallenge' && <Trophy className="text-red-600" size={32} />}
                   {event.id === 'motivational-days' && <Users2 className="text-red-600" size={32} />}
                   {event.id === 'ssa' && <Brain className="text-red-600" size={32} />}
                 </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center space-y-3 relative overflow-hidden">
                 <div className="flex items-center gap-3">
                   <h3 
                     className="text-xl md:text-2xl font-black uppercase tracking-tight transition-colors"
                     style={{ color: 'var(--text-brand)' }}
                   >
                     {event.title}
                   </h3>
                </div>
                <p 
                  className="text-sm md:text-base font-light leading-relaxed max-w-4xl transition-colors opacity-80"
                  style={{ color: 'var(--text-brand)' }}
                >
                  {event.desc}
                </p>
                
                {/* Arrow decor */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 hidden lg:block">
                   <ArrowRight className="text-red-600" size={40} strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Subtle background glow on hover */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-600/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </motion.div>
        ))}
      </motion.div>

      {/* Gallery Modal Overlay */}
      <MajorEventGallery 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)}
        eventTitle={selectedEvent?.title || ''}
        eventId={selectedEvent?.id || ''}
      />
    </section>
  );
}
