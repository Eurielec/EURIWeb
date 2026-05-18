'use client';

import React, { useEffect, useRef } from 'react';

export default function TerminalBackground({ scroll = 0 }: { scroll: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(scroll);

  // Actualizamos el ref de scroll sin reiniciar el efecto de animación
  useEffect(() => {
    scrollRef.current = scroll;
  }, [scroll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Caracteres técnicos
    const charset = "01010101XY77##//\\--++";
    const fontSize = 16;
    // Aumentamos la densidad en un 200% (reduciendo el espacio entre columnas a la mitad del anterior)
    const spacing = fontSize * 1.75;
    const columns = Math.ceil(width / spacing); 
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);

    let animationId: number;

    const draw = () => {
      // Fondo negro con rastro muy sutil
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Usamos el valor del ref para no reiniciar la animación
      const speedMultiplier = 0.4 + scrollRef.current * 3.5; 

      for (let i = 0; i < drops.length; i++) {
        const char = charset[Math.floor(Math.random() * charset.length)];
        
        // Opacidad al 40% como solicitado
        ctx.fillStyle = `rgba(215, 0, 0, 0.9)`; 
        ctx.font = `bold ${fontSize}px monospace`;
        
        ctx.fillText(char, (i * spacing), drops[i]);

        // Movimiento puramente vertical
        drops[i] += fontSize * 0.4 * speedMultiplier;

        // Reinicio
        if (drops[i] > height && Math.random() > 0.985) {
          drops[i] = 0;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []); // El efecto de dibujo solo se ejecuta UNA VEZ

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none bg-black"
    />
  );
}
