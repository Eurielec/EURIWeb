'use client';

import { useEffect, useRef } from 'react';

interface KineticTypographyProps {
  text?: string;
  className?: string;
  blurred?: boolean;
  columnCount?: number;
  /** When true, the component is rendered as a fixed full-viewport background
   *  and the columns react to the page scroll position. */
  fixedBackground?: boolean;
  /** Multiplier for how much scroll affects column movement (default 0.5) */
  scrollParallax?: number;
}

// Color presets per theme
const THEME_COLORS = {
  default: {
    bg: '#000000',
    textR: 232, textG: 22, textB: 27,       // #E8161B  (brand red)
    fadeMask: '#000',
    blurBg: 'rgba(0, 0, 0, 0.6)',
  },
  'high-contrast': {
    bg: '#000000',
    textR: 255, textG: 255, textB: 255,      // white text on black
    fadeMask: '#000',
    blurBg: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

type ThemeKey = keyof typeof THEME_COLORS;

export default function KineticTypography({
  text = 'EURIELEC',
  className = '',
  blurred = false,
  fixedBackground = false,
  scrollParallax = 0.5,
}: KineticTypographyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const scrollYRef = useRef<number>(0);
  const themeRef = useRef<ThemeKey>('default');
  const containerRef = useRef<HTMLDivElement>(null);

  // Observe theme changes on <html data-theme="...">
  useEffect(() => {
    const html = document.documentElement;
    const sync = () => {
      const attr = html.getAttribute('data-theme');
      themeRef.current = (attr === 'high-contrast' ? 'high-contrast' : 'default');
      // Also update the container background immediately
      if (containerRef.current) {
        containerRef.current.style.backgroundColor = THEME_COLORS[themeRef.current].bg;
      }
      // Update all fade mask divs
      const masks = containerRef.current?.querySelectorAll<HTMLDivElement>('[data-fade-mask]');
      if (masks) {
        const c = THEME_COLORS[themeRef.current].fadeMask;
        masks.forEach(m => {
          const dir = m.dataset.fadeMask!;
          if (dir === 'top')    m.style.background = `linear-gradient(to bottom, ${c} 0%, transparent 100%)`;
          if (dir === 'bottom') m.style.background = `linear-gradient(to top, ${c} 0%, transparent 100%)`;
          if (dir === 'left')   m.style.background = `linear-gradient(to right, ${c} 0%, transparent 100%)`;
          if (dir === 'right')  m.style.background = `linear-gradient(to left, ${c} 0%, transparent 100%)`;
        });
      }
      // Blur overlay
      const blurEl = containerRef.current?.querySelector<HTMLDivElement>('[data-blur-overlay]');
      if (blurEl) {
        blurEl.style.background = THEME_COLORS[themeRef.current].blurBg;
      }
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Track scroll position without re-rendering
  useEffect(() => {
    if (!fixedBackground) return;
    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [fixedBackground]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Font size limits — narrower range for more uniform, legible text
    const FONT_MIN = 12;
    const FONT_MAX = 30;
    const FONT_RANGE = FONT_MAX - FONT_MIN;

    // Simple center-to-edge size gradient (like the reference)
    // Large readable text in the center, gradually smaller toward edges
    const getFontSize = (y: number, _colIdx: number, H: number) => {
      const centerY = H / 2;
      const dist = Math.abs(y - centerY) / (H / 2); // 0 at center, 1 at edges
      const t = Math.min(dist, 1);
      // Smooth cubic falloff — stays large near center, fades toward edges
      const scale = 1 - t * t * t;
      return FONT_MIN + FONT_RANGE * scale;
    };

    // Measure text at max font to calculate proper column spacing
    ctx.font = `900 ${FONT_MAX}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    const maxTextWidth = ctx.measureText(text).width;
    const colSpacing = maxTextWidth * 0.95;
    const dynamicColCount = Math.ceil(canvas.getBoundingClientRect().width / colSpacing) + 4;

    // UNIFORM vertical spacing — dense but readable
    const ITEM_SPACING = FONT_MAX * 1.0;

    // Speed in pixels per second — identical for all columns
    const SCROLL_SPEED = 30;

    // Column X positions and directions
    const columns = Array.from({ length: dynamicColCount }, (_, colIdx) => ({
      x: (colIdx - 2) * colSpacing + colSpacing / 2,
      dir: colIdx % 2 === 0 ? -1 : 1,
    }));

    const draw = (timestamp: number) => {
      if (!running) return;

      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      ctx.clearRect(0, 0, W, H);

      // Read current theme colors (no re-render needed, just a ref read)
      const colors = THEME_COLORS[themeRef.current];

      // Scroll-based extra offset for parallax effect
      const scrollExtra = fixedBackground ? scrollYRef.current * scrollParallax : 0;

      for (let ci = 0; ci < columns.length; ci++) {
        const col = columns[ci];

        // Continuous pixel offset — pure function of elapsed time + scroll
        const scrollContribution = scrollExtra * col.dir;
        const rawOffset = elapsed * SCROLL_SPEED * col.dir + scrollContribution;
        const offset = ((rawOffset % ITEM_SPACING) + ITEM_SPACING) % ITEM_SPACING;

        // Cover viewport with items
        const margin = 50;
        const startIdx = Math.floor(-margin / ITEM_SPACING);
        const endIdx = Math.ceil((H + margin) / ITEM_SPACING);

        for (let k = startIdx; k <= endIdx; k++) {
          const y = k * ITEM_SPACING + offset;

          if (y < -margin || y > H + margin) continue;

          const fontSize = getFontSize(y, ci, H);
          if (fontSize < 4) continue;

          // Horizontal wave — each column snakes with a unique phase
          // Amplitude scales with column spacing so columns weave into each other
          const wavePhase = ci * 1.8;
          const waveFreq = (2 * Math.PI) / H; // one full wave per viewport height
          const waveAmp = colSpacing * 0.35;
          const xOffset = Math.sin(y * waveFreq * 1.5 + wavePhase) * waveAmp;

          const sizeRatio = (fontSize - FONT_MIN) / FONT_RANGE;
          const opacity = Math.max(0.08, 0.15 + sizeRatio * 0.85);

          ctx.font = `900 ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
          ctx.fillStyle = `rgba(${colors.textR}, ${colors.textG}, ${colors.textB}, ${opacity})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, col.x + xOffset, y);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [text, fixedBackground, scrollParallax]);

  const initialColors = THEME_COLORS['default'];

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{
        width: '100%',
        backgroundColor: initialColors.bg,
        transition: 'background-color 0.5s ease',
        ...(fixedBackground
          ? { position: 'fixed', inset: 0, zIndex: 0 }
          : { position: 'relative', height: '100vh' }),
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Vertical fade masks */}
      <div
        data-fade-mask="top"
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: '15%',
          background: `linear-gradient(to bottom, ${initialColors.fadeMask} 0%, transparent 100%)`,
        }}
      />
      <div
        data-fade-mask="bottom"
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: '15%',
          background: `linear-gradient(to top, ${initialColors.fadeMask} 0%, transparent 100%)`,
        }}
      />

      {/* Horizontal fade masks */}
      <div
        data-fade-mask="left"
        className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{
          width: '8%',
          background: `linear-gradient(to right, ${initialColors.fadeMask} 0%, transparent 100%)`,
        }}
      />
      <div
        data-fade-mask="right"
        className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{
          width: '8%',
          background: `linear-gradient(to left, ${initialColors.fadeMask} 0%, transparent 100%)`,
        }}
      />

      {/* Blur overlay when used as background */}
      {blurred && (
        <div
          data-blur-overlay
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            background: initialColors.blurBg,
          }}
        />
      )}
    </div>
  );
}
