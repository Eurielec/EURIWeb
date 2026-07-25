'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

interface Member {
  name: string;
  role: string;
  description: string;
  img: string;
}

export default function JuntaCarousel({ members }: { members: Member[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Rotación global (en grados)
  const rotation = useMotionValue(0);
  const rotationVelocity = useRef(0);
  const targetRotation = useRef(0);
  const isDraggingOrScrolling = useRef(false);
  
  const total = members.length;
  // Ángulo entre cada miembro
  const angleStep = 360 / total;
  // Radio del cilindro: se calcula para que las tarjetas encajen.
  // Con 5 miembros, un radio de 450-500px da buena profundidad.
  const radius = Math.max(400, (300 * total) / (2 * Math.PI));

  // Animación continua (Auto-giro e inercia del scroll)
  useAnimationFrame((time, delta) => {
    if (selected !== null) return; // Parar totalmente si hay alguien seleccionado

    if (isDraggingOrScrolling.current) {
      // Movimiento manual (scroll)
      const diff = targetRotation.current - rotation.get();
      // Interpolación suave hacia el target
      rotation.set(rotation.get() + diff * 0.1);
      rotationVelocity.current = diff * 0.1;
      
      // Si ya está muy cerca del target, terminamos el "arrastre"
      if (Math.abs(diff) < 0.1) {
        isDraggingOrScrolling.current = false;
        targetRotation.current = rotation.get();
      }
    } else {
      // Auto-giro constante si no está en hover
      if (!isHovered) {
        rotation.set(rotation.get() - (0.015 * delta));
        targetRotation.current = rotation.get();
      }
    }
  });

  // Manejo de la rueda del ratón (Scroll)
  const handleWheel = (e: React.WheelEvent) => {
    if (selected !== null) return;
    
    // Evitar scroll de la página si estamos haciendo scroll sobre el carrusel
    e.preventDefault();
    
    isDraggingOrScrolling.current = true;
    // Multiplicador de sensibilidad de scroll
    targetRotation.current -= e.deltaY * 0.2;
  };
  
  // Efecto para hacer preventDefault real en el wheel event ya que React onWheel es pasivo
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      isDraggingOrScrolling.current = true;
      targetRotation.current -= e.deltaY * 0.2;
    };
    
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div 
      className="relative w-full overflow-hidden select-none" 
      style={{ height: '75vh', minHeight: '600px', background: '#050505' }}
    >
      {/* ── TEXTOS VERTICALES (BACKGROUND) ── */}
      <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-4 md:px-12 z-0">
        <h2 
          className="font-black text-red-600 opacity-5"
          style={{ writingMode: 'vertical-rl', transform: 'scale(-1, -1)', fontSize: 'clamp(8rem, 15vw, 16rem)', lineHeight: 0.8 }}
        >
          JUNTA
        </h2>
        <h2 
          className="font-black text-red-600 opacity-5"
          style={{ writingMode: 'vertical-rl', fontSize: 'clamp(8rem, 15vw, 16rem)', lineHeight: 0.8 }}
        >
          JUNTA
        </h2>
      </div>

      {/* ── VIÑETA Y DEGRADADOS FONDOS ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div style={{ background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.03) 0%, transparent 60%)', height: '100%' }} />
        <div style={{ background: 'linear-gradient(to bottom, #050505 0%, transparent 20%, transparent 80%, #050505 100%)', height: '100%', position: 'absolute', inset: 0 }} />
      </div>

      {/* ── ESCENARIO 3D ── */}
      <div 
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{ perspective: '1200px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ rotateY: rotation, transformStyle: 'preserve-3d' }}
        >
          {members.map((member, idx) => {
            const angle = idx * angleStep;
            const isSelected = selected === idx;
            
            return (
              <motion.div
                key={idx}
                onClick={() => setSelected(isSelected ? null : idx)}
                className="absolute flex flex-col items-center cursor-pointer transition-all duration-300 group"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* ── PERSONA ── */}
                <div className="relative w-64 md:w-80 h-96 flex items-end justify-center">
                  <motion.img
                    src={member.img}
                    alt={member.name}
                    className="absolute bottom-0 w-full object-contain pointer-events-none"
                    style={{
                      height: '110%',
                      maxWidth: '400px',
                      filter: isSelected ? 'brightness(1.1) drop-shadow(0 0 40px rgba(220,38,38,0.5))' : 'brightness(0.7) drop-shadow(0 0 10px rgba(0,0,0,0.8))',
                    }}
                    whileHover={!isSelected && selected === null ? { 
                      filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(220,38,38,0.3))',
                      scale: 1.05
                    } : {}}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Luz debajo del miembro seleccionado */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        className="absolute bottom-0 w-full h-32 bg-red-600/20 blur-2xl origin-bottom"
                        style={{ borderRadius: '50% 50% 0 0' }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* ── INFO TEXTO ── */}
                <motion.div 
                  className="mt-6 text-center"
                  animate={{ opacity: (selected === null || isSelected) ? 1 : 0.2 }}
                >
                  <h3 className="font-black text-white text-xl md:text-2xl uppercase tracking-tighter drop-shadow-md">
                    {member.name}
                  </h3>
                  <p className="font-black text-red-600 text-xs md:text-sm uppercase tracking-widest drop-shadow-md">
                    {member.role}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── PANEL DE DETALLES DEL MIEMBRO (BOTTOM) ── */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute bottom-0 left-0 right-0 z-50 mx-auto px-4 md:px-8 pb-8 max-w-3xl pointer-events-none"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-red-600/30 p-6 md:p-8 rounded-2xl shadow-[0_-10px_50px_rgba(220,38,38,0.15)] pointer-events-auto relative overflow-hidden">
              
              {/* Brillo en el fondo del panel */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              <div className="relative z-10">
                <p className="text-red-500 font-black uppercase tracking-widest text-xs mb-2">
                  {members[selected].role}
                </p>
                <h3 className="text-white font-black text-3xl md:text-4xl uppercase tracking-tighter mb-4">
                  {members[selected].name}
                </h3>
                <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">
                  {members[selected].description}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                title="Cerrar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HINT DE SCROLL ── */}
      <AnimatePresence>
        {selected === null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-8 border-2 border-red-600/40 rounded-full flex justify-center pt-1.5">
                <motion.div 
                  className="w-1 h-2 bg-red-600 rounded-full"
                  animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <p className="font-black text-red-600/50 uppercase tracking-[0.3em] text-[10px]">
                {t.board.selectMember || "Scroll / Gira"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
