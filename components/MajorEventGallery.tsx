'use client';

import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from 'framer-motion';
import { X } from 'lucide-react';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

interface GalleryProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventId: string;
}

const galleryData: Record<string, string[]> = {
  'imw': [
    'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
  ],
  'workshop': [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
  ],
  'eurichallenge': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071823991-b5ae72647ac9?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop'
  ],
  'motivational-days': [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531545517296-16816f6ad239?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop'
  ]
};

function GalleryFrame({ 
  src, 
  index, 
  total, 
  scrollYProgress, 
  title 
}: { 
  src: string, 
  index: number, 
  total: number, 
  scrollYProgress: MotionValue<number>,
  title: string
}) {
  const opacity = useTransform(
    scrollYProgress,
    [
      (index - 0.5) / total,
      index / total,
      (index + 0.5) / total
    ],
    [0, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [
      (index - 0.5) / total,
      index / total,
      (index + 0.5) / total
    ],
    [1.1, 1, 1.1]
  );

  return (
    <section className="h-screen w-full sticky top-0 bg-black snap-start overflow-hidden">
      <motion.div style={{ opacity, scale }} className="absolute inset-0">
        <Image 
          src={src} 
          alt={`${title} frame ${index + 1}`}
          fill
          className="object-cover opacity-60 filter grayscale-[0.2]"
          unoptimized={src.startsWith('http')}
        />
      </motion.div>
    </section>
  );
}

function ProgressDot({ i, total, scrollYProgress }: { i: number, total: number, scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(
    scrollYProgress,
    [(i-0.5)/total, i/total, (i+0.5)/total],
    [0.2, 1, 0.2]
  );

  const width = useTransform(
    scrollYProgress,
    [(i-0.5)/total, i/total, (i+0.5)/total],
    [4, 24, 4]
  );

  return (
    <motion.div
      style={{ opacity, width }}
      className="h-1 bg-white rounded-full"
    />
  );
}

function GalleryContent({ onClose, eventTitle, images }: { onClose: () => void, eventTitle: string, images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 bg-black flex flex-col overflow-hidden font-sans"
    >
      {/* Minimalist Close Button */}
      <button 
        onClick={onClose}
        className="fixed top-8 right-8 z-110 p-4 text-white hover:text-red-600 transition-colors uppercase font-black text-xs tracking-widest flex items-center gap-2 group"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Cerrar</span>
        <X size={32} strokeWidth={3} />
      </button>

      {/* Floating Title (Always white, always center-ish) */}
      <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none z-105 text-center px-10">
         <motion.h2 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mix-blend-difference"
         >
           {eventTitle}
         </motion.h2>
      </div>

      {/* Scrollable Container (The engine) */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scroll-smooth"
        style={{ height: '100vh' }}
      >
         <div style={{ height: `${images.length * 100}vh` }}>
           {images.map((src, index) => (
              <GalleryFrame 
                key={index} 
                src={src} 
                index={index} 
                total={images.length} 
                scrollYProgress={scrollYProgress} 
                title={eventTitle}
              />
           ))}
         </div>
      </div>

      {/* Bottom Progress Indicator */}
      <div className="fixed bottom-12 inset-x-0 flex justify-center gap-4 z-110">
         {images.map((_, i) => (
           <ProgressDot 
             key={i} 
             i={i} 
             total={images.length} 
             scrollYProgress={scrollYProgress} 
           />
         ))}
      </div>
    </motion.div>
  );
}

export default function MajorEventGallery({ isOpen, onClose, eventTitle, eventId }: GalleryProps) {
  const images = galleryData[eventId] || galleryData['imw'];
  
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <GalleryContent 
          onClose={onClose} 
          eventTitle={eventTitle} 
          images={images} 
        />
      )}
    </AnimatePresence>
  );
}
