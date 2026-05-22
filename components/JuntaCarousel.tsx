'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

interface Member {
  name: string;
  role: string;
  description: string;
  img: string;
}

export default function JuntaCarousel({ members }: { members: Member[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const { t } = useLanguage();

  const activeIdx = selected !== null ? selected : hovered;

  return (
    <div className="relative w-full" style={{ height: '50vh', minHeight: '320px' }}>

      {/* ── DARK STAGE BACKGROUND ─────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep black base */}
        <div className="absolute inset-0" style={{ background: '#08090a' }} />

        {/* Grid scanlines — fighting-game feel */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Horizontal scanlines overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 4px)',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 100%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.9) 100%)',
          }}
        />

        {/* Active member background glow */}
        <AnimatePresence>
          {activeIdx !== null && (
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 60% 80% at ${15 + activeIdx * 18}% 100%, rgba(232,22,27,0.18) 0%, transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── CHARACTERS ROW ───────────────────────────────────── */}
      <div className="absolute inset-0 flex items-end justify-center pb-10 px-4">
        <div className="flex items-end justify-center w-full max-w-7xl gap-0">
          {members.map((member, idx) => {
            const isActive = activeIdx === idx;
            const isSelected = selected === idx;

            return (
              <motion.div
                key={idx}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(isSelected ? null : idx)}
                className="relative flex flex-col items-center cursor-pointer select-none"
                style={{ flex: 1, minWidth: 0 }}
                initial={{ opacity: 0, y: 60 }}
                animate={{
                  opacity: 1,
                  y: isActive ? -12 : 0,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: idx * 0.08 }}
              >
                {/* ── CHARACTER IMAGE ── */}
                <div className="relative w-full flex justify-center">
                  {/* Active highlight beam from below */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key="beam"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        exit={{ scaleY: 0, opacity: 0 }}
                        style={{ transformOrigin: 'bottom' }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full"
                      >
                        <div
                          className="w-full"
                          style={{
                            height: '500px',
                            background: 'linear-gradient(to top, rgba(232,22,27,0.35) 0%, rgba(232,22,27,0.08) 40%, transparent 100%)',
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Character PNG — full height, bottom-aligned */}
                  <motion.img
                    src={member.img}
                    alt={member.name}
                    animate={{
                      filter: isActive
                        ? 'brightness(1.05) drop-shadow(0 0 30px rgba(232,22,27,0.5))'
                        : 'brightness(0.55) grayscale(0.3)',
                      scale: isActive ? 1.04 : 1,
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="relative z-10 w-full object-contain object-bottom"
                    style={{
                      height: 'clamp(280px, 50vh, 520px)',
                      maxWidth: '220px',
                    }}
                    draggable={false}
                  />
                </div>

                {/* ── SELECTION BRACKET ── */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none z-20"
                    >
                      {/* Corner brackets (top-left) */}
                      <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-white" />
                      <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-white" />
                      <div className="absolute bottom-10 left-4 w-5 h-5 border-b-2 border-l-2 border-white" />
                      <div className="absolute bottom-10 right-4 w-5 h-5 border-b-2 border-r-2 border-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── NAME PLATE ── */}
                <motion.div
                  className="relative z-20 w-full text-center pb-3"
                  animate={{ opacity: isActive ? 1 : 0.3 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="px-2">
                    <p
                      className="font-black uppercase leading-none tracking-tight"
                      style={{ fontSize: 'clamp(0.55rem, 1.1vw, 0.9rem)', letterSpacing: '-0.01em', color: 'var(--text-brand)' }}
                    >
                      {member.name}
                    </p>
                    <p
                      className="font-bold uppercase mt-0.5 opacity-50"
                      style={{ fontSize: 'clamp(0.4rem, 0.7vw, 0.6rem)', letterSpacing: '0.12em', color: 'var(--text-brand)' }}
                    >
                      {member.role}
                    </p>
                  </div>
                  {/* Active bar */}
                  {isActive && (
                    <motion.div
                      layoutId="active-bar"
                      className="w-8 h-[2px] mx-auto mt-1 rounded-full"
                      style={{ background: 'var(--red)' }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── MEMBER DETAIL PANEL (bottom) ── */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="absolute bottom-0 left-0 right-0 z-30 mx-auto px-6 pb-6 max-w-2xl"
          >
            <div
              className="rounded-2xl p-5 backdrop-blur-2xl shadow-2xl"
              style={{
                background: 'rgba(10,10,10,0.85)',
                border: '1px solid rgba(232,22,27,0.25)',
                boxShadow: '0 -2px 40px rgba(232,22,27,0.12), 0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-start gap-4">

                {/* Divider red left */}
                <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: 'var(--red)' }} />

                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block font-black uppercase mb-1"
                    style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)' }}
                  >
                    {members[selected].role}
                  </span>
                  <h3
                    className="font-black leading-none mb-3"
                    style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.03em', color: '#fff' }}
                  >
                    {members[selected].name}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: '1.6', fontWeight: 300 }}>
                    {members[selected].description}
                  </p>
                </div>

                {/* Close */}
                <button
                  onClick={() => setSelected(null)}
                  className="text-white/30 hover:text-white transition-colors shrink-0 mt-1"
                  aria-label="Cerrar"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PRESS TO SELECT HINT ── */}
      <AnimatePresence>
        {selected === null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <p
              className="font-black uppercase text-center"
              style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(232,22,27,0.45)' }}
            >
              {t.board.selectMember}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
