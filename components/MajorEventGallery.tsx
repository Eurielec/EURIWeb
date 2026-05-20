'use client';

import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

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
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
  ],
  'motivational-days': [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531545517296-16816f6ad239?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop',
  ],
  'ssa': [
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop',
  ],
};

function GalleryOverlay({
  onClose,
  eventTitle,
  images,
}: {
  onClose: () => void;
  eventTitle: string;
  images: string[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isTransitioning = useRef(false);
  const touchStartY = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= images.length || isTransitioning.current) return;
      isTransitioning.current = true;
      setActiveIndex(index);
      // Debounce: prevent rapid scroll from skipping images
      setTimeout(() => {
        isTransitioning.current = false;
      }, 500);
    },
    [images.length]
  );

  // Wheel navigation
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning.current) return;
      if (e.deltaY > 30) goTo(activeIndex + 1);
      else if (e.deltaY < -30) goTo(activeIndex - 1);
    };
    window.addEventListener('wheel', handler, { passive: false });
    return () => window.removeEventListener('wheel', handler);
  }, [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goTo(activeIndex + 1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, goTo, onClose]);

  // Touch/swipe navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(deltaY) < 50) return; // Minimum swipe distance
      if (deltaY > 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeIndex, goTo]);

  return (
    <div
      className="fixed inset-0 bg-black"
      style={{ zIndex: 9999, animation: 'fadeIn 0.3s ease-out' }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* All images layered on top of each other */}
      {images.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            transform: i === activeIndex ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <Image
            src={src}
            alt={`${eventTitle} — foto ${i + 1}`}
            fill
            className="object-cover"
            style={{ opacity: 0.7 }}
            unoptimized
            priority={i === 0}
          />
        </div>
      ))}

      {/* Dark gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 flex items-center gap-2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-red-500 transition-all group"
        aria-label="Cerrar galería"
      >
        <span className="text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pr-1">
          Cerrar
        </span>
        <X size={24} strokeWidth={2.5} />
      </button>

      {/* Centred title */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-center px-8">
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tighter mix-blend-difference select-none">
          {eventTitle}
        </h2>
      </div>

      {/* Image counter */}
      <div className="absolute top-6 left-6 z-10 text-white/60 text-xs font-bold tracking-widest uppercase select-none">
        {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </div>

      {/* Nav arrows */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <button
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Foto anterior"
        >
          <ChevronUp size={20} />
        </button>
        <button
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === images.length - 1}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Foto siguiente"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 inset-x-0 z-10 flex justify-center items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir a foto ${i + 1}`}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: i === activeIndex ? 28 : 8,
              backgroundColor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* Scroll hint (only on first image) */}
      {activeIndex === 0 && (
        <div
          className="absolute bottom-20 inset-x-0 z-10 flex flex-col items-center text-white/40 text-xs font-bold tracking-widest uppercase select-none pointer-events-none"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        >
          <style>{`@keyframes pulse { 0%,100% { opacity: 0.4; transform: translateY(0); } 50% { opacity: 0.8; transform: translateY(4px); } }`}</style>
          <span>Scroll</span>
          <ChevronDown size={16} className="mt-1" />
        </div>
      )}
    </div>
  );
}

// ─── Portal wrapper ────────────────────────────────────────────────────────────
export default function MajorEventGallery({
  isOpen,
  onClose,
  eventTitle,
  eventId,
}: GalleryProps) {
  const images = galleryData[eventId] ?? galleryData['imw'];
  const [mounted, setMounted] = useState(false);

  // Client-only portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock page scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <GalleryOverlay onClose={onClose} eventTitle={eventTitle} images={images} />,
    document.body
  );
}
