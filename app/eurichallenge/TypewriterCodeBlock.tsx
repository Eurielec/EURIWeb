'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView, motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Terminal, CheckCircle2, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export interface CodeToken {
  text: string;
  color?: string;
  bold?: boolean;
}

export interface RunOutputConfig {
  title?: string;
  lines: string[];
  status?: string;
  cta?: {
    text: string;
    href: string;
  };
}

export interface TypewriterCodeBlockProps {
  fileName: string;
  lines: CodeToken[][];
  tagText?: string;
  speed?: number; // ms per tick (default 10)
  runOutput?: RunOutputConfig;
}

export default function TypewriterCodeBlock({
  fileName,
  lines,
  tagText,
  speed = 10,
  runOutput,
}: TypewriterCodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const [visibleChars, setVisibleChars] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const { theme } = useTheme();
  const isHC = theme === 'high-contrast';

  // Total chars across all tokens + 1 char for newline per line
  const totalChars = lines.reduce(
    (acc, line) => acc + line.reduce((lAcc, tok) => lAcc + tok.text.length, 0) + 1,
    0
  );

  useEffect(() => {
    if (!isInView) return;

    let current = 0;
    const charsPerTick = totalChars > 450 ? 3 : totalChars > 220 ? 2 : 1;

    const interval = setInterval(() => {
      current += charsPerTick;
      if (current >= totalChars) {
        setVisibleChars(totalChars);
        setIsTypingComplete(true);
        clearInterval(interval);
      } else {
        setVisibleChars(current);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isInView, totalChars, speed]);

  const handleReplay = () => {
    setIsTypingComplete(false);
    setVisibleChars(0);
    let current = 0;
    const charsPerTick = totalChars > 450 ? 3 : totalChars > 220 ? 2 : 1;
    const interval = setInterval(() => {
      current += charsPerTick;
      if (current >= totalChars) {
        setVisibleChars(totalChars);
        setIsTypingComplete(true);
        clearInterval(interval);
      } else {
        setVisibleChars(current);
      }
    }, speed);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowConsole(true);
    }, 350);
  };

  // Render tokens sliced according to visibleChars
  let charBudget = visibleChars;

  // Default output if none provided
  const activeOutput: RunOutputConfig = runOutput || {
    title: `Consola de Ejecución · ${fileName}`,
    lines: [
      `> Compilando ${fileName}...`,
      '✓ Sintaxis verificada correctamente [0 errores]',
      '✓ Conectado a servidores Eurielec ETSIT UPM',
      '✓ Estado: LISTO PARA EL HACKATHON'
    ],
    status: 'EXECUTION_SUCCESS'
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl overflow-hidden font-mono text-xs sm:text-sm transition-all duration-300 shadow-2xl ${
        isHC
          ? 'bg-black/95 border border-[#FFC107]/20 shadow-[#FFC107]/5'
          : 'bg-black/95 border border-white/15 shadow-2xl'
      }`}
    >
      {/* Mac Terminal Title Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900/95 border-b border-white/10 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm inline-block" />
          <span className="text-xs text-white/50 ml-3 font-semibold">{fileName}</span>
        </div>

        <div className="flex items-center gap-2">
          {tagText && (
            <span
              className={`hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded border mr-1 transition-colors ${
                isHC
                  ? 'text-[#FFC107] bg-[#FFC107]/10 border-[#FFC107]/25'
                  : 'text-[#FFA000] bg-[#FFA000]/10 border-[#FFA000]/20'
              }`}
            >
              {tagText}
            </span>
          )}

          {isTypingComplete && (
            <button
              onClick={handleReplay}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white text-xs transition-all"
              title="Volver a escribir"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Replay</span>
            </button>
          )}

          {/* Botón Ejecutar / Run */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50 active:scale-95 ${
              isHC
                ? 'bg-gradient-to-r from-[#FFC107] to-[#FFA000] hover:brightness-110 text-black shadow-[#FFC107]/30'
                : 'bg-gradient-to-r from-[#E8161B] to-[#FF5722] hover:brightness-110 text-white shadow-[#E8161B]/30'
            }`}
            title="Ejecutar código"
          >
            <Play size={12} fill="currentColor" className={isRunning ? 'animate-spin' : ''} />
            <span>{isRunning ? 'Compilando...' : 'Ejecutar'}</span>
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-6 sm:p-8 space-y-1.5 leading-relaxed overflow-x-auto min-h-[160px]">
        {lines.map((lineTokens, lineIdx) => {
          if (charBudget <= 0) return null;

          return (
            <div key={lineIdx} className="whitespace-pre">
              {lineTokens.map((tok, tokIdx) => {
                if (charBudget <= 0) return null;

                const tokenLength = tok.text.length;
                let textToDisplay = '';

                if (charBudget >= tokenLength) {
                  textToDisplay = tok.text;
                  charBudget -= tokenLength;
                } else {
                  textToDisplay = tok.text.slice(0, charBudget);
                  charBudget = 0;
                }

                return (
                  <span
                    key={tokIdx}
                    className={`${tok.color || 'text-white'} ${tok.bold ? 'font-bold' : ''}`}
                  >
                    {textToDisplay}
                  </span>
                );
              })}

              {/* End of line char deduction for newline */}
              {(() => {
                if (charBudget > 0) {
                  charBudget -= 1;
                }
                return null;
              })()}
            </div>
          );
        })}

        {/* Typing Blinking Cursor */}
        {!isTypingComplete && isInView && (
          <span
            className={`inline-block w-2 h-4 animate-pulse ml-0.5 align-middle shadow-sm ${
              isHC ? 'bg-[#FFC107] shadow-[#FFC107]' : 'bg-[#FF5722] shadow-[#FF5722]'
            }`}
          />
        )}
      </div>

      {/* ── TERMINAL EXECUTION OUTPUT RESPONSE ── */}
      <AnimatePresence>
        {showConsole && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`border-t bg-neutral-950/95 p-5 sm:p-6 text-xs font-mono ${
              isHC ? 'border-[#FFC107]/20' : 'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Terminal size={14} />
                <span>{activeOutput.title || 'Salida de la Consola'}</span>
                {activeOutput.status && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border font-normal ${
                      isHC
                        ? 'text-[#FFC107] bg-[#FFC107]/10 border-[#FFC107]/25'
                        : 'text-[#FFA000] bg-[#FFA000]/10 border-[#FFA000]/20'
                    }`}
                  >
                    {activeOutput.status}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowConsole(false)}
                className="text-white/40 hover:text-white p-1 rounded transition-colors"
                title="Cerrar consola"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-1.5 text-white/90 leading-relaxed">
              {activeOutput.lines.map((line, idx) => {
                const isCheck = line.startsWith('✓');
                const isCmd = line.startsWith('>');
                const isHighlight = line.includes('http') || line.includes('¡') || line.includes('🏆');
                return (
                  <div
                    key={idx}
                    className={`${
                      isCheck
                        ? 'text-emerald-400'
                        : isCmd
                        ? isHC ? 'text-[#FFC107]' : 'text-[#FFA000]'
                        : isHighlight
                        ? 'text-white font-bold'
                        : 'text-white/70'
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>

            {activeOutput.cta && (
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                <a
                  href={activeOutput.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
                    isHC
                      ? 'bg-[#FFC107] hover:bg-[#FFA000] text-black shadow-[#FFC107]/30'
                      : 'bg-[#E8161B] hover:bg-[#FF5722] text-white shadow-[#E8161B]/30'
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>{activeOutput.cta.text}</span>
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
