'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Sparkles,
  Clock,
  ExternalLink,
  CheckCircle2,
  Code2,
  Cpu,
  Brain,
  Rocket,
  Gift,
  HelpCircle,
  Award,
  Share2
} from 'lucide-react';
import TypewriterCodeBlock, { CodeToken, RunOutputConfig } from './TypewriterCodeBlock';
import TerminalBackground from '@/components/TerminalBackground';
import { useTheme } from '@/components/ThemeProvider';

const REGISTRATION_URL = 'https://eurichallenge.fillout.com/2026';

// ── CODE SNIPPETS DEFINITIONS ──
const heroCodeTokens: CodeToken[][] = [
  [{ text: '// EURI.CHALLENGE 2026 — Edición Oficial', color: 'text-white/40' }],
  [
    { text: 'function ', color: 'text-[#FF5722]', bold: true },
    { text: 'hackathon', color: 'text-yellow-400', bold: true },
    { text: '() {', color: 'text-white' }
  ],
  [
    { text: '  evento = ', color: 'text-purple-300' },
    { text: '"EURI.CHALLENGE"', color: 'text-emerald-400' },
    { text: ';', color: 'text-white' }
  ],
  [
    { text: '  tipo = ', color: 'text-purple-300' },
    { text: '"HACKATHON"', color: 'text-emerald-400' },
    { text: ';', color: 'text-white' }
  ],
  [
    { text: '  fecha = ', color: 'text-purple-300' },
    { text: '"13, 14, 15 NOVIEMBRE 2026"', color: 'text-emerald-400' },
    { text: ';', color: 'text-white' }
  ],
  [
    { text: '  unirse', color: 'text-yellow-400' },
    { text: '(', color: 'text-white' },
    { text: 'EESTEC_EURI', color: 'text-blue-300' },
    { text: ');', color: 'text-white' }
  ],
  [
    { text: '  crea_algo_increible', color: 'text-yellow-400' },
    { text: '();', color: 'text-white' }
  ],
  [{ text: '}', color: 'text-white' }],
  [{ text: 'hackathon();', color: 'text-yellow-400' }],
  [{ text: '', color: 'text-white' }],
  [{ text: '// ETSIT UPM — Nueva Etapa', color: 'text-white/40' }],
  [
    { text: 'public static void ', color: 'text-[#FF5722]', bold: true },
    { text: 'main', color: 'text-yellow-400', bold: true },
    { text: '(String[] args) {', color: 'text-white' }
  ],
  [
    { text: '  System.out.println(', color: 'text-blue-300' },
    { text: '"EURIChallenge toma el relevo de EESTech Challenge"', color: 'text-emerald-400' },
    { text: ');', color: 'text-white' }
  ],
  [
    { text: '  System.out.println(', color: 'text-blue-300' },
    { text: '"LLEVA TU CREATIVIDAD E INGENIO AL LÍMITE"', color: 'text-[#FFA000]', bold: true },
    { text: ');', color: 'text-white' }
  ],
  [{ text: '}', color: 'text-white' }]
];

const challengeCodeTokens: CodeToken[][] = [
  [
    { text: 'const ', color: 'text-[#FF5722]', bold: true },
    { text: 'TEMA_EURI_CHALLENGE_2026', color: 'text-blue-300', bold: true },
    { text: ' = {', color: 'text-white' }
  ],
  [
    { text: '  tema: ', color: 'text-purple-300' },
    { text: '"gamificando la fisioterapia con ia"', color: 'text-emerald-400', bold: true },
    { text: ',', color: 'text-white' }
  ],
  [
    { text: '  mision: ', color: 'text-purple-300' },
    { text: '"convertir ideas en soluciones"', color: 'text-emerald-400' },
    { text: ',', color: 'text-white' }
  ],
  [
    { text: '  herramientas: ', color: 'text-purple-300' },
    { text: '["python", "typescript"]', color: 'text-yellow-300' },
    { text: ',', color: 'text-white' }
  ],
  [
    { text: '  conocimientos_que_aprenderas: [', color: 'text-purple-300' }
  ],
  [
    { text: '    "computer vision",', color: 'text-yellow-300' }
  ],
  [
    { text: '    "biomecánica",', color: 'text-yellow-300' }
  ],
  [
    { text: '    "programación"', color: 'text-yellow-300' }
  ],
  [
    { text: '  ]', color: 'text-purple-300' }
  ],
  [{ text: '};', color: 'text-white' }],
  [{ text: '', color: 'text-white' }],
  [
    { text: 'if ', color: 'text-[#FF5722]', bold: true },
    { text: '(EURI_CHALLENGE_2026.tema) {', color: 'text-white' }
  ],
  [{ text: '  explorar();', color: 'text-yellow-400' }],
  [{ text: '  imaginar();', color: 'text-yellow-400' }],
  [{ text: '  diseñar();', color: 'text-yellow-400' }],
  [{ text: '  crear();', color: 'text-yellow-400' }],
  [{ text: '}', color: 'text-white' }],
  [
    { text: 'ready_to_create = ', color: 'text-emerald-400' },
    { text: 'true', color: 'text-[#FFA000]', bold: true },
    { text: ';', color: 'text-white' }
  ]
];

const scheduleCodeTokens: CodeToken[][] = [
  [
    { text: 'const ', color: 'text-[#FF5722]', bold: true },
    { text: 'horario', color: 'text-blue-300' },
    { text: ' = ', color: 'text-white' },
    { text: 'cargar', color: 'text-yellow-400' },
    { text: '(EURI_Challenge);', color: 'text-white' }
  ],
  [{ text: '', color: 'text-white' }],
  [{ text: '// VIERNES 13 NOVIEMBRE', color: 'text-white/40' }],
  [
    { text: '16:00 - 17:00 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'charla_bienvenida();', color: 'text-yellow-400' }
  ],
  [
    { text: '17:00 - 18:30 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'networking();', color: 'text-yellow-400' }
  ],
  [
    { text: '19:00 - 21:00 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'inicio_reto();', color: 'text-yellow-400' }
  ],
  [
    { text: '21:00 -> ', color: 'text-white/50', bold: true },
    { text: 'salida_cierre_sede(); // Cierre ETSIT', color: 'text-red-400' }
  ],
  [{ text: '', color: 'text-white' }],
  [{ text: '// SÁBADO 14 NOVIEMBRE', color: 'text-white/40' }],
  [
    { text: '09:00 - 14:00 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'desarrollo_reto();', color: 'text-yellow-400' }
  ],
  [
    { text: '14:00 - 15:00 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'comida();', color: 'text-yellow-400' }
  ],
  [
    { text: '15:00 - 21:00 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'continuar_reto();', color: 'text-yellow-400' }
  ],
  [
    { text: '21:00 -> ', color: 'text-white/50', bold: true },
    { text: 'salida_cierre_sede(); // Cierre ETSIT', color: 'text-red-400' }
  ],
  [{ text: '', color: 'text-white' }],
  [{ text: '// DOMINGO 15 NOVIEMBRE', color: 'text-white/40' }],
  [
    { text: '09:00 - 14:00 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'sprint_final(); // Code Freeze 14:00', color: 'text-yellow-400' }
  ],
  [
    { text: '14:00 - 15:00 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'comida();', color: 'text-yellow-400' }
  ],
  [
    { text: '15:00 - 17:30 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'exposicion_soluciones();', color: 'text-yellow-400' }
  ],
  [
    { text: '17:30 - 18:00 -> ', color: 'text-[#FFA000]', bold: true },
    { text: 'anuncio_ganadores();', color: 'text-yellow-400' }
  ]
];

const rewardsCodeTokens: CodeToken[][] = [
  [{ text: '// REWARDS UNLOCKED', color: 'text-white/40' }],
  [
    { text: 'const ', color: 'text-[#FF5722]', bold: true },
    { text: 'PRIZE_POOL', color: 'text-blue-300', bold: true },
    { text: ' = {', color: 'text-white' }
  ],
  [
    { text: '  value: ', color: 'text-purple-300' },
    { text: '"+1500€"', color: 'text-emerald-400', bold: true },
    { text: ',', color: 'text-white' }
  ],
  [
    { text: '  prizes: ', color: 'text-purple-300' },
    { text: '3', color: 'text-yellow-400' },
    { text: ',', color: 'text-white' }
  ],
  [
    { text: '  status: ', color: 'text-purple-300' },
    { text: '"READY"', color: 'text-emerald-400' }
  ],
  [{ text: '};', color: 'text-white' }],
  [{ text: 'load_prizes();', color: 'text-yellow-400' }],
  [{ text: '', color: 'text-white' }],
  [
    { text: 'const ', color: 'text-[#FF5722]', bold: true },
    { text: 'PRIZE_01', color: 'text-blue-300' },
    { text: ' = { cash: ', color: 'text-white' },
    { text: '"150€"', color: 'text-emerald-400' },
    { text: ', products: ', color: 'text-white' },
    { text: '"+100€"', color: 'text-yellow-400' },
    { text: ', level: ', color: 'text-white' },
    { text: '"TOP"', color: 'text-[#FF5722]', bold: true },
    { text: ' };', color: 'text-white' }
  ],
  [
    { text: 'const ', color: 'text-[#FF5722]', bold: true },
    { text: 'PRIZE_02', color: 'text-blue-300' },
    { text: ' = { products: ', color: 'text-white' },
    { text: '"+100€"', color: 'text-yellow-400' },
    { text: ', surprises: ', color: 'text-white' },
    { text: 'true', color: 'text-emerald-400' },
    { text: ' };', color: 'text-white' }
  ],
  [
    { text: 'const ', color: 'text-[#FF5722]', bold: true },
    { text: 'PRIZE_03', color: 'text-blue-300' },
    { text: ' = { reward: ', color: 'text-white' },
    { text: '"ROPA"', color: 'text-purple-300' },
    { text: ', style: ', color: 'text-white' },
    { text: '"UNLOCKED"', color: 'text-yellow-400' },
    { text: ' };', color: 'text-white' }
  ],
  [{ text: '', color: 'text-white' }],
  [
    { text: 'if ', color: 'text-[#FF5722]', bold: true },
    { text: '(you.have_an_idea) {', color: 'text-white' }
  ],
  [{ text: '  create(); compete(); win();', color: 'text-yellow-400' }],
  [{ text: '}', color: 'text-white' }],
  [
    { text: 'prize_pool = ', color: 'text-purple-300' },
    { text: '"+1500€"', color: 'text-emerald-400', bold: true },
    { text: ';', color: 'text-white' }
  ],
  [{ text: '// > READY TO HACK?', color: 'text-[#FFA000]', bold: true }]
];

const partnersCodeTokens: CodeToken[][] = [
  [{ text: '// POWERED BY', color: 'text-white/40' }],
  [
    { text: 'const ', color: 'text-[#FF5722]', bold: true },
    { text: 'PARTNERS', color: 'text-blue-300', bold: true },
    { text: ' = [', color: 'text-white' }
  ],
  [{ text: '  "EURIELEC",', color: 'text-emerald-400' }],
  [{ text: '  "EESTEC LC MADRID",', color: 'text-emerald-400' }],
  [{ text: '  "ETSIT UPM",', color: 'text-emerald-400' }],
  [{ text: '  "COLABORADORES_2026"', color: 'text-emerald-400' }],
  [{ text: '];', color: 'text-white' }],
  [{ text: '', color: 'text-white' }],
  [
    { text: 'PARTNERS.forEach(partner => {', color: 'text-yellow-400' }
  ],
  [
    { text: '  support(', color: 'text-white' },
    { text: 'EURI_CHALLENGE', color: 'text-blue-300' },
    { text: ');', color: 'text-white' }
  ],
  [{ text: '});', color: 'text-yellow-400' }],
  [{ text: '', color: 'text-white' }],
  [{ text: '// > COLLABORATION MAKES IT POSSIBLE.', color: 'text-emerald-400', bold: true }]
];

// Output configurations for interactive Run execution
const heroRunOutput: RunOutputConfig = {
  title: 'hackathon() -> Salida del proceso',
  lines: [
    '> Ejecutando hackathon()...',
    '✓ Inicializando entorno ETSIT UPM (Madrid)',
    '✓ Conexión establecida con comités Eurielec & EESTEC',
    '✓ Fechas: 13, 14 y 15 de Noviembre 2026',
    '✓ Equipos: 3 participantes por grupo',
    '✓ Reto cargado: Gamificando la fisioterapia con IA',
    '✓ Pool de recompensas: +1.500€ disponible',
    '> Estado: READY_TO_HACK',
    '🚀 ¡Inscripciones abiertas! Plazas limitadas.'
  ],
  status: 'EXIT_CODE_0',
  cta: {
    text: 'Inscribirme en el Hackathon',
    href: REGISTRATION_URL
  }
};

const challengeRunOutput: RunOutputConfig = {
  title: 'eval(TEMA_EURI_CHALLENGE_2026)',
  lines: [
    '> Analizando especificación técnica del reto 2026...',
    '✓ Tema validado: Gamificando la Fisioterapia con IA',
    '✓ Stack requerido: Python, TypeScript, OpenCV, MediaPipe',
    '✓ Aprendizaje: Visión artificial, tracking biomecánico y gamificación',
    '✓ Ciclo: explorar() -> imaginar() -> diseñar() -> crear()',
    '> READY.TO.CREATE = true'
  ],
  status: 'CHALLENGE_ACTIVE'
};

const scheduleRunOutput: RunOutputConfig = {
  title: 'cargar(EURI_Challenge) -> Agenda',
  lines: [
    '> Compilando cronograma del hackathon...',
    '✓ Viernes 13: 16:00 Bienvenida | 17:00 Networking | 19:00 Inicio Reto | 21:00 Salida',
    '✓ Sábado 14: 09:00-14:00 Reto | 14:00 Comida | 15:00-21:00 Reto | 21:00 Salida',
    '✓ Domingo 15: 09:00-14:00 Reto (Code freeze) | 14:00 Comida | 15:00 Demos | 17:30 Ganadores',
    '> Cronograma 100% verificado y sincronizado.'
  ],
  status: 'SCHEDULE_VERIFIED'
};

const rewardsRunOutput: RunOutputConfig = {
  title: 'load_prizes() -> Pool de Recompensas',
  lines: [
    '> Consultando base de datos de recompensas...',
    '🏆 1º Premio (TOP): 150€ cash + 100€ tech products + trofeo',
    '🥈 2º Premio (PRO): +100€ tech products + periféricos y sorpresas',
    '🥉 3er Premio (MERCH): Ropa y merchandising oficial "UNLOCKED"',
    '🎁 Todos los equipos: Comidas, cenas, snacks, welcome pack y diploma ETSIT',
    '> Valor total acumulado: +1.500€ [REWARDS UNLOCKED]'
  ],
  status: 'PRIZES_CLAIMABLE'
};

const partnersRunOutput: RunOutputConfig = {
  title: 'PARTNERS.forEach(support) -> Alianzas',
  lines: [
    '> Sincronizando entidades y patrocinadores...',
    '✓ Eurielec ETSIT Madrid (Organizador técnico)',
    '✓ EESTEC LC Madrid (Comité Local & Red Europea)',
    '✓ ETSIT - Universidad Politécnica de Madrid (Sede y soporte)',
    '✓ Colaboradores tecnológicos 2026',
    '> COLLABORATION MAKES IT POSSIBLE.'
  ],
  status: 'PARTNERS_ACTIVE'
};

export default function EurichallengeClient() {
  const { theme } = useTheme();
  const isHC = theme === 'high-contrast';
  const [activeDay, setActiveDay] = useState<'viernes' | 'sabado' | 'domingo'>('viernes');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll for sticky CTA and animated background
  useEffect(() => {
    const handleScroll = () => {
      const scrollVal = window.scrollY;
      setScrollProgress(scrollVal / 1000);
      if (scrollVal > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scheduleData = {
    viernes: [
      { time: '16:00 - 17:00', code: 'charla_bienvenida();', title: 'Charla de Bienvenida', desc: 'Apertura oficial, bienvenida de Eurielec y presentación detallada del reto y jurado.' },
      { time: '17:00 - 18:30', code: 'networking();', title: 'Networking & Dinámica', desc: 'Encuentro entre participantes, empresas patrocinadoras y formación de equipos.' },
      { time: '19:00 - 21:00', code: 'inicio_reto();', title: 'Inicio del Reto', desc: '¡Comienza el hackathon! Acceso a especificaciones técnicas, datos y arranque de desarrollo.' },
      { time: '21:00', code: 'salida_cierre();', title: 'Cierre de Jornada (Salida)', desc: 'Cierre nocturno de instalaciones en la ETSIT UPM. Descanso hasta el sábado a las 09:00.' },
    ],
    sabado: [
      { time: '09:00 - 14:00', code: 'desarrollo_reto();', title: 'Jornada de Reto (Mañana)', desc: 'Desarrollo técnico continuo, arquitectura del modelo de IA y mentorías con expertos.' },
      { time: '14:00 - 15:00', code: 'comida();', title: 'Comida & Recarga de Energía', desc: 'Almuerzo para todos los participantes provisto por la organización para recargar pilas y comentar avances.' },
      { time: '15:00 - 21:00', code: 'continuar_reto();', title: 'Jornada de Reto (Tarde)', desc: 'Sprint intensivo de desarrollo, pulido de visión artificial y validación de prototipos.' },
      { time: '21:00', code: 'salida_cierre();', title: 'Cierre de Jornada (Salida)', desc: 'Cierre nocturno de instalaciones en la ETSIT UPM. Descanso hasta la recta final del domingo.' },
    ],
    domingo: [
      { time: '09:00 - 14:00', code: 'sprint_final();', title: 'Reto: Sprint Final (Code Freeze)', desc: 'Último bloque de hacking. A las 14:00 se congelan repositorios y entrega obligatoria del código.' },
      { time: '14:00 - 15:00', code: 'comida();', title: 'Comida de Clausura', desc: 'Almuerzo para participantes tras la entrega del reto antes de dar comienzo a las exposiciones.' },
      { time: '15:00 - 17:30', code: 'exposicion_soluciones();', title: 'Exposición de Soluciones', desc: 'Demos en directo y presentaciones de cada equipo ante el tribunal del jurado evaluador.' },
      { time: '17:30 - 18:00', code: 'anuncio_ganadores();', title: 'Anuncio de Ganadores & Premios', desc: 'Veredicto final del jurado, entrega de premios (+1.500€), diplomas y clausura oficial.' },
    ],
  };

  return (
    <div className="eurichallenge-page min-h-screen bg-[#08090A] text-white selection:bg-[#FF5722] selection:text-white font-sans relative overflow-x-hidden">
      
      {/* ── ANIMATED MATRIX BACKGROUND (Estilo Eurielec / Archivo) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 overflow-hidden">
        <TerminalBackground scroll={0} fixedSpeed={true} />
      </div>

      {/* ── AMBIENT GLOW BACKGROUNDS ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] blur-[160px] rounded-full transition-colors duration-700 ${
          isHC ? 'bg-gradient-to-b from-[#FFC107]/20 via-[#FFA000]/15 to-transparent' : 'bg-gradient-to-b from-[#E8161B]/20 via-[#FF5722]/15 to-transparent'
        }`} />
        <div className={`absolute top-1/3 -left-48 w-[600px] h-[600px] blur-[180px] rounded-full transition-colors duration-700 ${
          isHC ? 'bg-[#FFC107]/10' : 'bg-[#E8161B]/10'
        }`} />
        <div className={`absolute top-2/3 -right-48 w-[700px] h-[700px] blur-[200px] rounded-full transition-colors duration-700 ${
          isHC ? 'bg-[#FFA000]/10' : 'bg-[#FF8A00]/10'
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-[800px] h-[500px] blur-[180px] rounded-full transition-colors duration-700 ${
          isHC ? 'bg-[#FFC107]/15' : 'bg-[#E8161B]/15'
        }`} />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        
        {/* ── LOGO OFICIAL DEL HACKATHON (CENTRAL, CUBRE EL ESPACIO DEL HEADLINE) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center justify-center text-center mb-8"
        >
          {/* Accessible hidden H1 for SEO */}
          <h1 className="sr-only">EURIChallenge 2026 | Hackathon Madrid — Hackathon de Tecnología, Programación e Inteligencia Artificial en ETSIT UPM</h1>

          {/* ── LOGO OFICIAL DEL HACKATHON FLOTANTE TRANSPARENTE (OPCIÓN B) ── */}
          <div className="relative w-full group py-2 sm:py-4 flex items-center justify-center">
            {/* Resplandor ambiental cinemático detrás del logo */}
            <div className={`absolute inset-x-4 sm:inset-x-12 inset-y-0 blur-3xl opacity-60 group-hover:opacity-85 transition-opacity duration-700 -z-10 pointer-events-none ${
              isHC 
                ? 'bg-gradient-to-r from-[#FFC107]/25 via-[#FFA000]/35 to-[#FFC107]/25' 
                : 'bg-gradient-to-r from-[#E8161B]/30 via-[#FF5722]/40 to-[#E8161B]/30'
            }`} />

            {/* Contenedor proporcional del logo a máxima nitidez sin marco */}
            <div className="relative w-full aspect-[1019/370] max-h-[260px] sm:max-h-[320px] md:max-h-[390px] lg:max-h-[440px] flex items-center justify-center drop-shadow-[0_12px_30px_rgba(0,0,0,0.8)] filter">
              <Image
                src="/eurichallenge/logo-eurichallenge-dark.png"
                alt="EURIChallenge 2026 - Hackathon Madrid ETSIT UPM"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1020px"
                quality={100}
                className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Subtítulo de Edición */}
          <div className={`mt-2 sm:mt-3 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md transition-colors ${
            isHC ? 'bg-[#FFC107]/10 border-[#FFC107]/30 text-[#FFC107]' : 'bg-white/[0.04] border-white/10 text-white/90'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-ping ${isHC ? 'bg-[#FFC107]' : 'bg-[#E8161B]'}`} />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
              HACKATHON MADRID 2026 &middot; 13-15 NOVIEMBRE &middot; ETSIT UPM
            </span>
          </div>
        </motion.div>

        {/* Hero Description & CTA */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-white/80 font-normal leading-relaxed max-w-3xl mx-auto"
          >
            <strong>EURIChallenge 2026</strong> es el <strong>hackathon presencial en Madrid</strong> organizado por <strong>Eurielec</strong> y <strong>EESTEC LC Madrid</strong> en la <strong>ETSIT UPM</strong>. Un fin de semana de programación, ingeniería e inteligencia artificial donde equipos de <strong className="text-white font-bold">3 participantes</strong> resolverán un reto técnico de impacto real con más de <strong className="text-white font-bold">1.500€ en premios</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-mono text-xs sm:text-sm text-white/50 tracking-widest uppercase flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <span className={isHC ? 'text-[#FFC107]' : 'text-[#FF5722]'}>#HACKATHON_MADRID</span>
            <span>•</span>
            <span className={isHC ? 'text-[#FFD54F]' : 'text-[#FFA000]'}>#ETSIT_UPM</span>
            <span>•</span>
            <span className={isHC ? 'text-[#FFC107]' : 'text-[#E8161B]'}>#INTELIGENCIA_ARTIFICIAL</span>
            <span>•</span>
            <span className="text-emerald-400">#CODING_CHALLENGE</span>
          </motion.div>

          {/* ── MEGA BOTÓN DE INSCRIPCIÓN (DESTACADO) ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-wider transition-all duration-300 border border-white/30 hover:scale-105 active:scale-95 ${
                isHC
                  ? 'bg-gradient-to-r from-[#FFC107] via-[#FFD54F] to-[#FFA000] text-black shadow-[0_0_50px_rgba(255,193,7,0.5)] hover:shadow-[0_0_80px_rgba(255,193,7,0.8)]'
                  : 'bg-gradient-to-r from-[#E8161B] via-[#FF5722] to-[#FF8A00] text-white shadow-[0_0_50px_rgba(242,78,30,0.6)] hover:shadow-[0_0_80px_rgba(242,78,30,0.9)]'
              }`}
              id="cta-register-hero"
            >
              <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Rocket className="w-6 h-6 animate-bounce" />
              <span>¡Inscríbete Ahora!</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            <a
              href="#reto"
              className={`inline-flex items-center gap-2 px-6 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-base uppercase tracking-wider border border-white/10 transition-all ${
                isHC ? 'hover:border-[#FFC107]/40 hover:text-[#FFC107]' : 'hover:border-[#FF5722]/40 hover:text-[#FF5722]'
              }`}
            >
              <Code2 className={`w-5 h-5 ${isHC ? 'text-[#FFC107]' : 'text-[#FF5722]'}`} />
              <span>Ver Reto y Bases</span>
            </a>
          </motion.div>
        </div>

        {/* ── 4 QUICK STATS CARDS ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto"
        >
          {/* Card 1 */}
          <div className={`p-5 rounded-2xl bg-white/[0.03] border border-white/10 transition-all backdrop-blur-sm group ${
            isHC ? 'hover:border-[#FFC107]/50' : 'hover:border-[#E8161B]/50'
          }`}>
            <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-2">
              <span className={`w-2 h-2 rounded-full ${isHC ? 'bg-[#FFC107]' : 'bg-[#E8161B]'}`} />
              FECHA
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              13, 14, 15
            </div>
            <div className={`text-xs font-mono uppercase mt-1 ${isHC ? 'text-[#FFC107]' : 'text-[#FF5722]'}`}>
              Noviembre 2026
            </div>
          </div>

          {/* Card 2 */}
          <div className={`p-5 rounded-2xl bg-white/[0.03] border border-white/10 transition-all backdrop-blur-sm group ${
            isHC ? 'hover:border-[#FFD54F]/50' : 'hover:border-[#FF5722]/50'
          }`}>
            <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-2">
              <span className={`w-2 h-2 rounded-full ${isHC ? 'bg-[#FFD54F]' : 'bg-[#FF5722]'}`} />
              EQUIPOS
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              3 Personas
            </div>
            <div className="text-xs text-white/60 font-mono uppercase mt-1">
              Por equipo
            </div>
          </div>

          {/* Card 3 */}
          <div className={`p-5 rounded-2xl bg-white/[0.03] border border-white/10 transition-all backdrop-blur-sm group ${
            isHC ? 'hover:border-[#FFC107]/50' : 'hover:border-[#FFA000]/50'
          }`}>
            <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-2">
              <span className={`w-2 h-2 rounded-full ${isHC ? 'bg-[#FFC107]' : 'bg-[#FFA000]'}`} />
              PREMIOS
            </div>
            <div className={`text-xl sm:text-2xl font-black tracking-tight ${isHC ? 'text-[#FFC107]' : 'text-[#FFA000]'}`}>
              +1.500€
            </div>
            <div className="text-xs text-white/60 font-mono uppercase mt-1">
              Pool de recompensas
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 transition-all backdrop-blur-sm group">
            <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              LUGAR
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ETSIT UPM
            </div>
            <div className="text-xs text-emerald-400 font-mono uppercase mt-1">
              Madrid · Presencial
            </div>
          </div>
        </motion.div>

        {/* ── HERO CODE WINDOW WITH LIVE TYPING & INTERACTIVE RUN BUTTON ── */}
        <div className="mt-14 max-w-4xl mx-auto">
          <TypewriterCodeBlock
            fileName="eurichallenge_init.ts"
            lines={heroCodeTokens}
            tagText="HACKATHON()"
            speed={8}
            runOutput={heroRunOutput}
          />
        </div>
      </section>

      {/* ── SECTION: EL RETO 2026 (THEME & TECH SPEC) ── */}
      <section id="reto" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-widest ${
            isHC ? 'bg-[#FFC107]/10 border-[#FFC107]/30 text-[#FFC107]' : 'bg-[#E8161B]/10 border-[#E8161B]/30 text-[#FF5722]'
          }`}>
            <Brain size={14} />
            TEMÁTICA OFICIAL 2026
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            Gamificando la <span className={isHC ? 'text-[#FFC107]' : 'text-[#FF5722]'}>Fisioterapia con IA</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg">
            Un desafío de impacto real donde unimos tecnología puntera con salud y bienestar. Convierte ideas en soluciones interactivas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Code Window with Rapid Live-Typing Animation & Interactive Run */}
          <div className="lg:col-span-7">
            <TypewriterCodeBlock
              fileName="challenge_2026_spec.ts"
              lines={challengeCodeTokens}
              tagText="READY.TO.CREATE = TRUE"
              speed={7}
              runOutput={challengeRunOutput}
            />
          </div>

          {/* Right Column: 3 Pillar Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-6 rounded-2xl bg-white/[0.03] border border-white/10 transition-all ${
              isHC ? 'hover:border-[#FFC107]/50' : 'hover:border-[#FF5722]/50'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                isHC ? 'bg-[#FFC107]/20 text-[#FFC107]' : 'bg-[#E8161B]/20 text-[#FF5722]'
              }`}>
                <Cpu size={22} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Visión por Computador e IA</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Aprende y aplica modelos de pose estimation (MediaPipe, OpenCV, TensorFlow) para detectar ejercicios de rehabilitación y corregir la postura en tiempo real.
              </p>
            </div>

            <div className={`p-6 rounded-2xl bg-white/[0.03] border border-white/10 transition-all ${
              isHC ? 'hover:border-[#FFC107]/50' : 'hover:border-[#FF5722]/50'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                isHC ? 'bg-[#FFA000]/20 text-[#FFC107]' : 'bg-[#FF8A00]/20 text-[#FFA000]'
              }`}>
                <Sparkles size={22} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gamificación Dinámica</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Transforma repeticiones terapéuticas tradicionales en videojuegos y dinámicas interactivas que motiven a los pacientes a completar sus tratamientos.
              </p>
            </div>

            <div className={`p-6 rounded-2xl bg-white/[0.03] border border-white/10 transition-all ${
              isHC ? 'hover:border-[#FFC107]/50' : 'hover:border-[#FF5722]/50'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Award size={22} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Metodología & Formación</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Aprenderás a seguir el ciclo completo: <span className={`font-mono font-bold ${isHC ? 'text-[#FFC107]' : 'text-[#FFA000]'}`}>explorar() → imaginar() → diseñar() → crear()</span>, con mentores y apoyo técnico en todo momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: CRONOGRAMA & HORARIOS CON TYPING CODE TERMINAL & RUN BUTTON ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-widest ${
            isHC ? 'bg-[#FFC107]/10 border-[#FFC107]/30 text-[#FFC107]' : 'bg-[#FFA000]/10 border-[#FFA000]/30 text-[#FFA000]'
          }`}>
            <Clock size={14} />
            AGENDA COMPLETA
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            const horario = <span className={isHC ? 'text-[#FFC107]' : 'text-[#FF5722]'}>cargar(EURI.CHALLENGE);</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg">
            3 días de pura inmersión técnica, networking y trabajo en equipo del 13 al 15 de Noviembre en la ETSIT UPM.
          </p>
        </div>

        {/* Typing Code Terminal for Schedule */}
        <div className="max-w-4xl mx-auto mb-12">
          <TypewriterCodeBlock
            fileName="horario_agenda.ts"
            lines={scheduleCodeTokens}
            tagText="SCHEDULE UNLOCKED"
            speed={6}
            runOutput={scheduleRunOutput}
          />
        </div>

        {/* Day Selector Buttons */}
        <div className="flex justify-center gap-3 mb-10">
          {(['viernes', 'sabado', 'domingo'] as const).map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-6 sm:px-8 py-3.5 rounded-2xl uppercase text-xs sm:text-sm tracking-widest transition-all ${
                activeDay === day
                  ? isHC
                    ? 'bg-gradient-to-r from-[#FFC107] to-[#FFA000] text-black shadow-lg shadow-[#FFC107]/30 scale-105 font-black'
                    : 'bg-gradient-to-r from-[#E8161B] to-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30 scale-105 font-bold'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {day === 'viernes' ? 'Viernes 13' : day === 'sabado' ? 'Sábado 14' : 'Domingo 15'}
            </button>
          ))}
        </div>

        {/* Detailed Timeline Grid for Active Day */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-black/90 border border-white/15 p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2 pb-6 border-b border-white/10 text-xs font-mono text-white/50">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
            <span className="ml-2 font-bold uppercase text-white/80">
              // DETALLE DE ACTIVIDADES · {activeDay.toUpperCase()}
            </span>
          </div>

          <div className="divide-y divide-white/5 mt-6">
            {scheduleData[activeDay].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start md:items-center gap-4">
                  <div className="font-mono text-base sm:text-lg md:text-xl font-black text-[#FFA000] shrink-0 whitespace-nowrap min-w-[125px] sm:min-w-[155px]">
                    {item.time}
                  </div>
                  <div>
                    <div className="font-mono text-xs sm:text-sm text-[#FF5722] font-bold">
                      {item.code}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                      {item.title}
                    </div>
                    <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 self-end md:self-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-white/5 text-white/40 border border-white/5">
                    ETSIT UPM
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION: PREMIOS Y RECOMPENSAS (+1500€ POOL) ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#27C93F]/10 border border-[#27C93F]/30 text-emerald-400 text-xs font-mono uppercase tracking-widest">
            <Trophy size={14} />
            REWARDS UNLOCKED
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            const PRIZE_POOL = <span className="text-[#FFA000]">&quot;+1500€&quot;;</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg">
            Premiaremos las mejores soluciones con dinero en efectivo, hardware tecnológico, periféricos y merchandising exclusivo.
          </p>
        </div>

        {/* Code Terminal for Prizes Typing Out with Run Button */}
        <div className="max-w-4xl mx-auto mb-14">
          <TypewriterCodeBlock
            fileName="rewards_unlocked.ts"
            lines={rewardsCodeTokens}
            tagText="PRIZE_POOL = +1500€"
            speed={6}
            runOutput={rewardsRunOutput}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 1st Prize */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-[#FFA000]/60 p-8 flex flex-col justify-between shadow-2xl shadow-[#FFA000]/10 relative group"
          >
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#FFA000] text-black font-black text-[11px] uppercase tracking-widest rounded-bl-2xl">
              1º PREMIO · TOP
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/40 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                <span className="ml-2 font-mono text-[11px]">const PRIZE_01</span>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#FFA000]/20 text-[#FFA000] flex items-center justify-center mb-6">
                <Trophy size={32} />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                Equipo Ganador
              </h3>

              <div className="space-y-3 font-mono text-sm text-white/80 my-6">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/50">cash:</span>
                  <span className="text-emerald-400 font-black text-lg">150€</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/50">products:</span>
                  <span className="text-yellow-400 font-bold">+100€</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/50">level:</span>
                  <span className="text-[#FF5722] font-bold">&quot;TOP&quot;</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 font-mono text-xs text-white/50">
              team.claim(PRIZE_01);
            </div>
          </motion.div>

          {/* 2nd Prize */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-white/15 p-8 flex flex-col justify-between shadow-2xl relative group hover:border-[#FF5722]/50 transition-all"
          >
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-white/10 text-white font-black text-[11px] uppercase tracking-widest rounded-bl-2xl">
              2º PREMIO · PRO
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/40 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                <span className="ml-2 font-mono text-[11px]">const PRIZE_02</span>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#FF5722]/20 text-[#FF5722] flex items-center justify-center mb-6">
                <Gift size={32} />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                Segundo Puesto
              </h3>

              <div className="space-y-3 font-mono text-sm text-white/80 my-6">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/50">products:</span>
                  <span className="text-yellow-400 font-bold">+100€</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/50">surprises:</span>
                  <span className="text-emerald-400 font-bold">true</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/50">hardware:</span>
                  <span className="text-white font-bold">&quot;TECH&quot;</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 font-mono text-xs text-white/50">
              unlock(PRIZE_02);
            </div>
          </motion.div>

          {/* 3rd Prize */}
          <motion.div 
            whileHover={{ y: -6 }}
            className={`rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-white/15 p-8 flex flex-col justify-between shadow-2xl relative group transition-all ${
              isHC ? 'hover:border-[#FFC107]/50' : 'hover:border-[#E8161B]/50'
            }`}
          >
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-white/10 text-white font-black text-[11px] uppercase tracking-widest rounded-bl-2xl">
              3er PREMIO · MERCH
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/40 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                <span className="ml-2 font-mono text-[11px]">const PRIZE_03</span>
              </div>

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                isHC ? 'bg-[#FFC107]/20 text-[#FFC107]' : 'bg-[#E8161B]/20 text-[#E8161B]'
              }`}>
                <Sparkles size={32} />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                Tercer Puesto
              </h3>

              <div className="space-y-3 font-mono text-sm text-white/80 my-6">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/50">reward:</span>
                  <span className="text-purple-300 font-bold">&quot;ROPA&quot;</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/50">style:</span>
                  <span className="text-yellow-400 font-bold">&quot;UNLOCKED&quot;</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/50">swag:</span>
                  <span className="text-emerald-400 font-bold">&quot;EXCLUSIVE&quot;</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 font-mono text-xs text-white/50">
              unlock(PRIZE_03);
            </div>
          </motion.div>
        </div>

        {/* Perks for all participants */}
        <div className="mt-12 p-8 max-w-4xl mx-auto rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              Beneficios para todos los participantes
            </h4>
            <p className="text-sm text-white/60">
              Comidas, bebidas y snacks incluidos durante todo el fin de semana, welcome pack con stickers y certificado oficial.
            </p>
          </div>
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`shrink-0 px-6 py-3 rounded-xl uppercase text-xs font-black tracking-widest hover:scale-105 transition-all shadow-lg ${
              isHC
                ? 'bg-gradient-to-r from-[#FFC107] to-[#FFA000] text-black shadow-[#FFC107]/20'
                : 'bg-gradient-to-r from-[#E8161B] to-[#FF5722] text-white shadow-[#E8161B]/20'
            }`}
          >
            Asegurar Plaza →
          </a>
        </div>
      </section>

      {/* ── SECTION: PREGUNTAS FRECUENTES (FAQ) ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-mono uppercase tracking-widest">
            <HelpCircle size={14} />
            FAQ & RESOLUCIÓN DE DUDAS
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: '¿Qué es EURIChallenge y qué tipo de hackathon es en Madrid?',
              a: 'EURIChallenge 2026 es el hackathon universitario de referencia en Madrid, organizado conjuntamente por Eurielec y EESTEC LC Madrid en la ETSIT UPM. Durante 48 horas intensivas, equipos de 3 estudiantes y apasionados del software y la ingeniería compiten desarrollando una solución tecnológica innovadora aplicando Inteligencia Artificial y Visión Artificial.',
            },
            {
              q: '¿Dónde se celebra este hackathon en Madrid y cómo llegar?',
              a: 'El hackathon es 100% presencial y se celebra en la ETSI de Telecomunicación (ETSIT - UPM), situada en Av. Complutense 30, Ciudad Universitaria (28040 Madrid). Es muy accesible en Metro (Línea 6, estaciones Ciudad Universitaria o Vicente Aleixandre) y en varias líneas de autobús EMT (Líneas 82, 132, F, G, U).',
            },
            {
              q: '¿Quién puede participar en el EURIChallenge Hackathon?',
              a: 'Cualquier estudiante universitario o de formación superior (de la UPM o de cualquier otra universidad de Madrid y España) interesado en programación, inteligencia artificial, electrónica o diseño. ¡Todos los perfiles técnicos y creativos son bienvenidos!',
            },
            {
              q: '¿Qué pasa si no tengo equipo completo de 3 personas?',
              a: '¡No te preocupes! Puedes inscribirte individualmente o en pareja a través del formulario oficial. Durante la sesión de networking del viernes te ayudaremos a completar tu equipo con otros participantes.',
            },
            {
              q: '¿Es necesario tener conocimientos previos avanzados de IA?',
              a: 'No. El reto está diseñado para aprender. Proveeremos plantillas de inicio, guías y mentores expertos durante todo el hackathon que te guiarán paso a paso con Python, TypeScript y visión por computador.',
            },
            {
              q: '¿Cuánto cuesta la inscripción en el hackathon Madrid?',
              a: 'La inscripción es 100% gratuita gracias al patrocinio de nuestras empresas colaboradoras y el apoyo de ETSIT UPM y Eurielec. Incluye espacio, Wi-Fi, comidas, cenas, bebidas energéticas, snacks y welcome pack oficial.',
            },
            {
              q: '¿Cuáles son los premios del hackathon?',
              a: 'Repartimos más de 1.500€ en recompensas: 1º Premio (150€ en efectivo + 100€ en productos tecnológicos + trofeo oficial), 2º Premio (+100€ en periféricos tech y sorpresas), 3er Premio (merchandising oficial UNLOCKED) y diploma acreditativo de la ETSIT UPM para todos los participantes.',
            },
            {
              q: '¿Qué tengo que llevar?',
              a: 'Tu portátil, cargadores y muchas ganas de innovar y pasarlo en grande. Eurielec y la ETSIT facilitan la conectividad Wi-Fi de alta velocidad, espacio de trabajo y alimentación eléctrica.',
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-2"
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <span className={`font-mono font-black text-sm ${isHC ? 'text-[#FFC107]' : 'text-[#FF5722]'}`}>0{i + 1}.</span>
                {faq.q}
              </h3>
              <p className="text-sm text-white/70 pl-7 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION: PARTNERS & SPONSORS WITH TYPING TERMINAL & RUN BUTTON ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-widest ${
            isHC ? 'bg-[#FFC107]/10 border-[#FFC107]/30 text-[#FFC107]' : 'bg-[#FFA000]/10 border-[#FFA000]/30 text-[#FFA000]'
          }`}>
            <Share2 size={14} />
            POWERED BY
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            // POWERED BY <span className={isHC ? 'text-[#FFC107]' : 'text-[#FF5722]'}>PARTNERS</span>
          </h2>
          <p className="text-white/70 font-mono text-sm sm:text-base">
            &gt; COLLABORATION MAKES IT POSSIBLE.
          </p>
        </div>

        {/* Partners Code Terminal Typing Out */}
        <div className="max-w-3xl mx-auto mb-12">
          <TypewriterCodeBlock
            fileName="partners_powered_by.ts"
            lines={partnersCodeTokens}
            tagText="SPONSORS UNLOCKED"
            speed={8}
            runOutput={partnersRunOutput}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'Eurielec', sub: 'ETSIT UPM Madrid' },
            { name: 'EESTEC LC Madrid', sub: 'Red Internacional' },
            { name: 'ETSIT UPM', sub: 'Escuela de Telecomunicación' },
            { name: 'Sponsors & Tech Partners', sub: 'Colaboradores 2026' },
          ].map((partner, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center text-center space-y-2 group transition-all ${
                isHC ? 'hover:border-[#FFC107]/50' : 'hover:border-[#FFA000]/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black text-lg ${
                isHC ? 'text-[#FFC107]' : 'text-[#FFA000]'
              }`}>
                EC
              </div>
              <div className="font-bold text-white text-sm">{partner.name}</div>
              <div className="text-xs text-white/50 font-mono">{partner.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA CARD ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className={`p-8 sm:p-14 rounded-3xl border-2 shadow-2xl backdrop-blur-xl text-center space-y-6 ${
          isHC
            ? 'bg-gradient-to-r from-[#FFC107]/20 via-[#FFA000]/15 to-[#FFD54F]/20 border-[#FFC107]/50 shadow-[#FFC107]/10'
            : 'bg-gradient-to-r from-[#E8161B]/30 via-[#FF5722]/30 to-[#FF8A00]/30 border-[#FF5722]/50'
        }`}>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 font-mono text-xs uppercase tracking-widest ${
            isHC ? 'text-[#FFC107]' : 'text-[#FFA000]'
          }`}>
            &gt; READY TO HACK?
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            ¿Listo para llevar tu creatividad al límite?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Las plazas son limitadas para garantizar la mejor experiencia, mentoría y espacio a todos los equipos. ¡No te quedes sin la tuya!
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/30 ${
                isHC
                  ? 'bg-gradient-to-r from-[#FFC107] via-[#FFD54F] to-[#FFA000] text-black shadow-[0_0_50px_rgba(255,193,7,0.5)]'
                  : 'bg-gradient-to-r from-[#E8161B] via-[#FF5722] to-[#FF8A00] text-white shadow-[0_0_50px_rgba(242,78,30,0.6)]'
              }`}
              id="cta-register-bottom"
            >
              <Rocket className="w-6 h-6 animate-pulse" />
              <span>Inscribirme en EURIChallenge 2026</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── STICKY BOTTOM BAR CTA (ON SCROLL) ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-0 inset-x-0 z-40 bg-black/90 border-t backdrop-blur-xl px-4 py-3 sm:py-4 shadow-2xl ${
              isHC ? 'border-[#FFC107]/25' : 'border-white/15'
            }`}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 hidden sm:flex items-center justify-center bg-white/5 rounded-lg p-1 shadow-md border border-white/10 overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src="/eurichallenge/logo-eurichallenge-dark.png"
                      alt="EC Logo"
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="flex h-3 w-3 relative sm:hidden">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isHC ? 'bg-[#FFC107]' : 'bg-[#FF5722]'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    isHC ? 'bg-[#FFC107]' : 'bg-[#E8161B]'
                  }`} />
                </span>
                <div>
                  <div className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <span>EURIChallenge 2026</span>
                    <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                      isHC ? 'bg-[#FFC107]/20 text-[#FFC107]' : 'bg-[#FFA000]/20 text-[#FFA000]'
                    }`}>
                      13-15 NOV
                    </span>
                  </div>
                  <div className="text-xs text-white/60 hidden md:block">
                    Hackathon ETSIT UPM · Gamificando la Fisioterapia con IA · +1500€ en premios
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={REGISTRATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all ${
                    isHC
                      ? 'bg-gradient-to-r from-[#FFC107] to-[#FFA000] text-black shadow-[#FFC107]/30 hover:brightness-110'
                      : 'bg-gradient-to-r from-[#E8161B] to-[#FF5722] text-white shadow-[#FF5722]/30 hover:brightness-110'
                  }`}
                >
                  <span>Inscribirse</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
