'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

interface Member {
  name: string;
  role: string;
  description: string;
  img: string;
}

function CarouselCard({ 
  member, 
  idx, 
  total, 
  radius, 
  rotation, 
  isSelected, 
  onClick 
}: { 
  member: Member; 
  idx: number; 
  total: number; 
  radius: number; 
  rotation: any; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const angleRad = (360 / total) * idx * (Math.PI / 180);

  // Posición X y Z puras en el círculo
  const x = useTransform(rotation, (rot: number) => Math.sin(rot * (Math.PI / 180) + angleRad) * radius);
  const z = useTransform(rotation, (rot: number) => Math.cos(rot * (Math.PI / 180) + angleRad) * radius);

  // Efectos visuales basados en la profundidad Z
  // Cuando Z = -radius (al fondo), Z = radius (al frente)
  const opacity = useTransform(z, [-radius, radius], [0.15, 1]);
  const scale = useTransform(z, [-radius, radius], [0.75, 1.05]);
  const filter = useTransform(z, [-radius, radius], ['blur(5px) brightness(0.3)', 'blur(0px) brightness(1)']);
  const zIndex = useTransform(z, (zVal: number) => Math.round(zVal));

  return (
    <motion.div
      onClick={onClick}
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{
        x,
        z,
        rotateX: '10deg', // Contrarresta el tilt de la escena para hacer Billboarding perfecto
        opacity,
        scale,
        filter,
        zIndex,
      }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <div className="relative w-64 md:w-72 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 p-4 pb-6 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors group-hover:border-red-600/40">
        
        {/* Glow de fondo de la carta */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Contenedor de la foto */}
        <div className="relative w-full h-80 rounded-2xl bg-white/5 overflow-hidden mb-5 border border-white/5 flex items-end justify-center">
          <motion.img
            src={member.img}
            alt={member.name}
            className="w-[110%] object-contain object-bottom"
            style={{ height: '110%' }}
            draggable={false}
          />
        </div>

        {/* Info */}
        <div className="text-center relative z-10 px-2">
          <h3 className="font-black text-white text-xl uppercase tracking-tighter leading-none mb-1">
            {member.name}
          </h3>
          <p className="font-black text-red-500 text-[10px] uppercase tracking-[0.2em]">
            {member.role}
          </p>
        </div>

        {/* Borde activo si está seleccionada */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 border-2 border-red-600 rounded-3xl pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


export default function JuntaCarousel({ members }: { members: Member[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Rotación global (en grados)
  const rotation = useMotionValue(0);
  const targetRotation = useRef(0);
  const isDraggingOrScrolling = useRef(false);
  
  const total = members.length;
  // Ajuste del radio: dependiente del número de miembros para que no choquen.
  const radius = Math.max(350, (350 * total) / (2 * Math.PI));

  // Animación continua (Auto-giro e inercia del scroll)
  useAnimationFrame((time, delta) => {
    if (selected !== null) return; // Parar totalmente si hay alguien seleccionado

    if (isDraggingOrScrolling.current) {
      // Movimiento manual (scroll)
      const diff = targetRotation.current - rotation.get();
      // Interpolación suave hacia el target
      rotation.set(rotation.get() + diff * 0.1);
      
      // Si ya está muy cerca del target, terminamos el "arrastre"
      if (Math.abs(diff) < 0.1) {
        isDraggingOrScrolling.current = false;
        targetRotation.current = rotation.get();
      }
    } else {
      // Auto-giro constante si no está en hover
      if (!isHovered) {
        // Velocidad moderada-lenta
        rotation.set(rotation.get() + (0.02 * delta));
        targetRotation.current = rotation.get();
      }
    }
  });

  // Manejo pasivo de la rueda del ratón (Scroll)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // Bloquea el scroll vertical de la página al orbitar
      isDraggingOrScrolling.current = true;
      targetRotation.current -= e.deltaY * 0.3;
    };
    
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div 
      className="relative w-full overflow-hidden select-none" 
      style={{ height: '75vh', minHeight: '650px', background: '#030303' }}
    >
      {/* ── TEXTOS VERTICALES (BACKGROUND) ── */}
      <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-4 md:px-12 z-0">
        <h2 
          className="font-black text-red-600 opacity-5"
          style={{ writingMode: 'vertical-rl', transform: 'scale(-1, -1)', fontSize: 'clamp(8rem, 15vw, 18rem)', lineHeight: 0.8 }}
        >
          JUNTA
        </h2>
        <h2 
          className="font-black text-red-600 opacity-5"
          style={{ writingMode: 'vertical-rl', fontSize: 'clamp(8rem, 15vw, 18rem)', lineHeight: 0.8 }}
        >
          JUNTA
        </h2>
      </div>

      {/* ── VIÑETA Y DEGRADADOS FONDOS ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div style={{ background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.04) 0%, transparent 65%)', height: '100%' }} />
        <div style={{ background: 'linear-gradient(to bottom, #030303 0%, transparent 15%, transparent 85%, #030303 100%)', height: '100%', position: 'absolute', inset: 0 }} />
      </div>

      {/* ── ESCENARIO ORBITAL 3D ── */}
      <div 
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{ perspective: '1400px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center"
          // Inclinamos el escenario hacia atrás (-10deg) para dar efecto de profundidad vista desde arriba.
          style={{ transform: 'rotateX(-10deg)', transformStyle: 'preserve-3d' }}
        >
          {members.map((member, idx) => (
            <CarouselCard 
              key={idx}
              member={member}
              idx={idx}
              total={total}
              radius={radius}
              rotation={rotation}
              isSelected={selected === idx}
              onClick={() => setSelected(selected === idx ? null : idx)}
            />
          ))}
        </div>
      </div>

      {/* ── PANEL DE DETALLES DEL MIEMBRO (BOTTOM) ── */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute bottom-6 left-0 right-0 z-50 mx-auto px-4 md:px-8 max-w-3xl pointer-events-none"
          >
            <div className="bg-black/90 backdrop-blur-2xl border border-red-600/30 p-6 md:p-8 rounded-3xl shadow-[0_20px_60px_rgba(220,38,38,0.2)] pointer-events-auto relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              <div className="relative z-10">
                <p className="text-red-500 font-black uppercase tracking-[0.2em] text-xs mb-3">
                  {members[selected].role}
                </p>
                <h3 className="text-white font-black text-3xl md:text-5xl uppercase tracking-tighter mb-4 leading-none">
                  {members[selected].name}
                </h3>
                <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base border-l-2 border-red-600/50 pl-4">
                  {members[selected].description}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white bg-white/5 hover:bg-red-600/20 p-2.5 rounded-full transition-all"
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
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-5 h-8 border-2 border-red-600/40 rounded-full flex justify-center pt-1.5 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                <motion.div 
                  className="w-1 h-2 bg-red-600 rounded-full"
                  animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <p className="font-black text-red-600/60 uppercase tracking-[0.3em] text-[9px] drop-shadow-md">
                {t.board.selectMember || "Scroll / Gira"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
