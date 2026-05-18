'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, useScroll } from 'framer-motion';
import * as THREE from 'three';
import { useLanguage } from './LanguageProvider';

// Componente Individual de un Par de Bases de ADN Cibernético
function DNABasePair({ position, rotation, index }: { position: [number,number,number]; rotation: [number,number,number]; index: number }) {
  const R = 1.4; // Radio de la hélice

  // Todos los nodos: negro puro, sin reflejos
  const nodeColor = "#000000";
  // Puentes alternando gris oscuro / gris medio
  const linkColor = index % 2 === 0 ? "#1a1a1a" : "#3a3a3a";

  return (
    <group position={position} rotation={rotation}>
      {/* Nodo izquierdo — negro plano */}
      <mesh position={[-R, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={nodeColor} />
      </mesh>

      {/* Nodo derecho — negro plano */}
      <mesh position={[R, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={nodeColor} />
      </mesh>

      {/* Enlace entre nodos */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, R * 2, 8]} />
        <meshBasicMaterial color={linkColor} />
      </mesh>

      {/* Núcleo central */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// Cadena de ADN Tecnológico Completa (Cyber DNA)
function CyberDNA({ scrollYProgress }: { scrollYProgress: any }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      const scroll = scrollYProgress.get();
      
      // La hélice de ADN gira a medida que el usuario hace scroll
      const targetRotationY = scroll * Math.PI * 4; // Da 2 vueltas completas (velocidad intermedia)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        targetRotationY + state.clock.elapsedTime * 0.2, // rotación pasiva constante
        0.05
      );
      
      // Desplazamiento sutil a lo largo del filamento de ADN
      const targetPosY = (scroll - 0.5) * 20;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y, 
        targetPosY, 
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Construímos 40 pares de bases para una doble hélice super larga */}
      {Array.from({ length: 40 }).map((_, i) => {
        // La rotación en Y incrementa en cada paso para formar el remolino de la hélice
        const twistY = i * 0.35;
        const yPos = (i - 20) * 0.8;

        return (
          <DNABasePair
            key={i}
            index={i}
            position={[0, yPos, 0]}
            rotation={[0, twistY, 0]}
          />
        );
      })}
      
      {/* Cilindro delimitador — invisible, sólo para dar volumen */}
      <mesh>
        <cylinderGeometry args={[2.5, 2.5, 40, 16]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

const sectionStyles = [
  { align: 'left',  accent: '#000000' },  // negro
  { align: 'right', accent: '#ffffff' },  // blanco
  { align: 'left',  accent: '#000000' },  // negro
];

export default function About3DSections() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Empezar animación cuando la parte superior del contenedor toca la parte superior de la pantalla
    // y acabar cuando el final del contenedor toca el fondo.
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* Capa base absoluta que abarca el 100% del alto real de las 3 secciones */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Fondo 3D Fijo interactivo */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, 0, -10]} intensity={2} color="#999999" />
            
            <CyberDNA scrollYProgress={scrollYProgress} />
            
            {/* Partículas blancas en lugar de estrellas de colores */}
            <Stars radius={80} depth={40} count={1000} factor={2} saturation={0} fade speed={0.5} />
          </Canvas>
        </div>
      </div>

      {/* Contenido en Texto superpuesto */}
      <div className="relative z-10 w-full pb-24">
        {t.about.sections.map((section, index) => {
          const style = sectionStyles[index];
          const isLeft = style.align === 'left';
          
          return (
            <div key={section.id} className="min-h-[65vh] flex items-center px-6 sm:px-10 py-16">
              <div className={`w-full max-w-7xl mx-auto flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                
                <motion.div 
                  initial={{ 
                    opacity: 0, 
                    x: isLeft ? 250 : -250, 
                    z: -300, 
                    scale: 0.2, 
                    rotateY: isLeft ? 60 : -60 
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    x: 0, 
                    z: 0, 
                    scale: 1, 
                    rotateY: 0 
                  }}
                  viewport={{ once: false, margin: "-30%" }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 70, 
                    damping: 14, 
                    mass: 1.2, 
                    delay: 0.1 
                  }}
                  style={{ perspective: 1500 }}
                  className="w-full md:w-1/2 lg:w-5/12 relative group"
                >
                  {/* Tarjeta — fondo negro semitransparente sobre rojo */}
                  <div
                    className="backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-2xl relative z-10 transition-colors"
                    style={{
                      background: isLeft ? 'rgba(0,0,0,0.78)' : 'rgba(255,255,255,0.15)',
                      border: isLeft ? '1px solid rgba(0,0,0,0.5)' : '1px solid rgba(255,255,255,0.4)',
                    }}
                  >
                    {/* Badge de sección */}
                    <div
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest mb-6 label"
                      style={{
                        background: isLeft ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)',
                        border: isLeft ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.2)',
                        color: isLeft ? '#fff' : '#000',
                      }}
                    >
                      {section.subtitle}
                    </div>
                    
                    {/* Título — blanco en card oscura, negro en card clara */}
                    <h2
                      className="text-4xl sm:text-5xl font-black mb-6 leading-none"
                      style={{
                        color: isLeft ? '#fff' : '#000',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {section.title}
                    </h2>
                    
                    {/* Barra separadora */}
                    <div
                      className="h-[2px] w-16 rounded-full mb-6"
                      style={{ background: isLeft ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
                    />
                    
                    <p
                      className="text-lg leading-relaxed font-light"
                      style={{ color: isLeft ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)' }}
                    >
                      {section.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
