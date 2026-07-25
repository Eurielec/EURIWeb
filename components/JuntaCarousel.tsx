'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

interface Member {
  name: string;
  role: string;
  description: string;
  img: string;
}

function FUTCard({ 
  member, 
  offset,
  onClick 
}: { 
  member: Member; 
  offset: number;
  onClick: () => void;
}) {
  const isCenter = offset === 0;
  const absOffset = Math.abs(offset);
  
  // Posiciones y escalas según la distancia al centro
  let scale = 1;
  let x = '0%';
  let zIndex = 10;
  let opacity = 1;
  let brightness = 1;

  if (isCenter) {
    scale = 1.15;
    x = '0%';
    zIndex = 50;
    opacity = 1;
    brightness = 1;
  } else if (absOffset === 1) {
    scale = 0.9;
    x = offset > 0 ? '90%' : '-90%'; // Se solapan un 10%
    zIndex = 40;
    opacity = 0.8;
    brightness = 0.5;
  } else if (absOffset === 2) {
    scale = 0.75;
    x = offset > 0 ? '160%' : '-160%';
    zIndex = 30;
    opacity = 0.4;
    brightness = 0.3;
  } else {
    // Si hay más de 5 miembros, se esconden por los lados
    scale = 0.5;
    x = offset > 0 ? '200%' : '-200%';
    zIndex = 0;
    opacity = 0;
    brightness = 0;
  }

  return (
    <motion.div
      onClick={onClick}
      className="absolute flex flex-col items-center cursor-pointer origin-center"
      animate={{
        scale,
        x,
        zIndex,
        opacity,
        filter: `brightness(${brightness})`,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 25,
      }}
      whileHover={isCenter ? { scale: 1.2 } : {}}
      style={{
        width: '260px',
        height: '400px',
      }}
    >
      {/* ── DISEÑO CARTA ESTILO FIFA FUT ── */}
      <div className={`relative w-full h-full rounded-b-2xl overflow-hidden transition-all duration-300
        ${isCenter 
          ? 'drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]' 
          : 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]'
        }`}
      >
        {/* Forma poligonal de la carta (Clip-path estilo escudo) */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-red-950"
          style={{
            clipPath: 'polygon(10% 0, 90% 0, 100% 10%, 100% 85%, 50% 100%, 0 85%, 0 10%)',
            border: isCenter ? '2px solid rgba(220,38,38,0.8)' : '1px solid rgba(255,255,255,0.1)',
          }}
        />

        {/* Decoración del borde interno brillante */}
        {isCenter && (
          <div 
            className="absolute inset-[3px] pointer-events-none opacity-50"
            style={{
              clipPath: 'polygon(10% 0, 90% 0, 100% 10%, 100% 85%, 50% 100%, 0 85%, 0 10%)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, rgba(220,38,38,0.4) 100%)',
            }}
          />
        )}

        {/* Imagen del miembro asomando desde abajo */}
        <div className="absolute top-[10%] bottom-[25%] inset-x-0 flex items-end justify-center">
          <img
            src={member.img}
            alt={member.name}
            className="w-[120%] object-contain object-bottom pointer-events-none drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            draggable={false}
          />
        </div>

        {/* Línea separadora brillante */}
        <div className="absolute bottom-[23%] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />

        {/* Textos inferiores */}
        <div className="absolute bottom-[5%] inset-x-0 flex flex-col items-center justify-end pb-2">
          <h3 className="font-black text-white text-xl uppercase tracking-tighter leading-none mb-1 text-center w-[90%] truncate">
            {member.name}
          </h3>
          <p className="font-bold text-red-500 text-[10px] uppercase tracking-[0.1em] text-center w-[90%] truncate">
            {member.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}


export default function JuntaCarousel({ members }: { members: Member[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  
  const total = members.length;

  // Lógica para ir al siguiente / anterior
  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Manejo pasivo de la rueda del ratón (Scroll manual)
  useEffect(() => {
    let lastWheelTime = 0;
    
    const handleWheel = (e: WheelEvent) => {
      if (!isHovered) return;
      e.preventDefault(); // Bloquear scroll vertical de la página
      
      const now = Date.now();
      if (now - lastWheelTime < 400) return; // 400ms throttle
      
      if (e.deltaY > 20) {
        next();
        lastWheelTime = now;
      } else if (e.deltaY < -20) {
        prev();
        lastWheelTime = now;
      }
    };
    
    // Add event listener a nivel global pero solo actúa si isHovered es true
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isHovered, next, prev]);

  return (
    <div 
      className="relative w-full overflow-hidden select-none flex flex-col items-center justify-center" 
      style={{ height: '70vh', minHeight: '600px', background: '#050505' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── TEXTOS VERTICALES (BACKGROUND) ── */}
      <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-4 md:px-12 z-0">
        <h2 
          className="font-black text-red-600 opacity-[0.03]"
          style={{ writingMode: 'vertical-rl', transform: 'scale(-1, -1)', fontSize: 'clamp(8rem, 15vw, 18rem)', lineHeight: 0.8 }}
        >
          JUNTA
        </h2>
        <h2 
          className="font-black text-red-600 opacity-[0.03]"
          style={{ writingMode: 'vertical-rl', fontSize: 'clamp(8rem, 15vw, 18rem)', lineHeight: 0.8 }}
        >
          JUNTA
        </h2>
      </div>

      {/* ── VIÑETA Y DEGRADADOS FONDOS ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(220, 38, 38, 0.05) 0%, transparent 70%)', height: '100%' }} />
        <div style={{ background: 'linear-gradient(to bottom, #050505 0%, transparent 15%, transparent 85%, #050505 100%)', height: '100%', position: 'absolute', inset: 0 }} />
      </div>

      {/* ── CARRUSEL COVERFLOW ── */}
      <div className="relative w-full flex items-center justify-center z-10" style={{ height: '400px' }}>
        {members.map((member, idx) => {
          // Calcular la distancia más corta teniendo en cuenta el wrap circular
          let offset = idx - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          return (
            <FUTCard 
              key={idx}
              member={member}
              offset={offset}
              onClick={() => setActiveIndex(idx)}
            />
          );
        })}
      </div>

      {/* ── PANEL DE DESCRIPCIÓN (BOTTOM) ── */}
      <div className="absolute bottom-8 left-0 right-0 z-50 mx-auto px-4 md:px-8 max-w-2xl pointer-events-none flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed drop-shadow-md">
              {members[activeIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── HINT DE SCROLL / FLECHAS ── */}
      <div className="absolute left-4 right-4 md:left-20 md:right-20 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-40">
        <button 
          onClick={prev}
          className="pointer-events-auto p-4 bg-black/40 hover:bg-red-600/20 rounded-full border border-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button 
          onClick={next}
          className="pointer-events-auto p-4 bg-black/40 hover:bg-red-600/20 rounded-full border border-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
