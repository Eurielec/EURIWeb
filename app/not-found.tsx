'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Terminal as TerminalIcon, AlertTriangle } from 'lucide-react';
import TerminalBackground from '@/components/TerminalBackground';
import { dictionaries, Locale } from '@/lib/i18n';

export default function NotFound() {
  const [text, setText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [t, setT] = useState(dictionaries.es);
  
  useEffect(() => {
    // Intentar obtener el idioma de las cookies
    const getLocale = () => {
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
        if (match) return match[2] as Locale;
      }
      return 'es';
    };

    const locale = getLocale();
    const dict = dictionaries[locale] || dictionaries.es;
    setT(dict);

    const fullText = [
      ...dict.error.terminal,
      `> TARGET: ${window.location.pathname}`,
      `> STATUS: 404_NOT_FOUND`
    ];

    let currentLine = 0;
    let currentChar = 0;
    let timer: NodeJS.Timeout;

    const typeWriter = () => {
      if (currentLine < fullText.length) {
        const line = fullText[currentLine];
        if (currentChar < line.length) {
          const char = line[currentChar];
          if (char !== undefined) {
            setText(prev => prev + char);
          }
          currentChar++;
          timer = setTimeout(typeWriter, 20);
        } else {
          setText(prev => prev + '\n');
          currentLine++;
          currentChar = 0;
          timer = setTimeout(typeWriter, 350);
        }
      } else {
        setShowButton(true);
      }
    };

    timer = setTimeout(typeWriter, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black font-sans">
      {/* Matrix Background */}
      <TerminalBackground scroll={1.5} />

      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

      {/* Scanner Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-20 w-full animate-scan" />

      <div className="relative z-10 max-w-2xl w-full px-6">
        <div className="bg-black/80 backdrop-blur-md border border-red-600/30 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(232,22,27,0.15)] animate-in fade-in zoom-in-95 duration-700">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(232,22,27,0.4)] animate-pulse">
              <AlertTriangle className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
                Access <span className="text-red-600">Denied</span>
              </h1>
              <p className="text-red-600/50 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                {t.error.subtitle}
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6 mb-10 min-h-[180px] flex flex-col">
            <pre className="text-red-500/90 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-all overflow-hidden">
              {text}
              <span className="inline-block w-2 h-5 bg-red-600 ml-1 animate-pulse" />
            </pre>
          </div>

          <div className={`transition-all duration-700 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link 
              href="/"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(232,22,27,0.3)]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t.error.back}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          from { transform: translateY(-100vh); }
          to { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </main>
  );
}
