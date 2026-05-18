'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll, ScrollControls, Scroll, Float, Text, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function FolderContent({ scroll }: { scroll: number }) {
  const frontRef = useRef<THREE.Group>(null);
  const papersRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Definimos rangos basados en el progreso 0-1
    const r1 = Math.min(1, Math.max(0, scroll * 3)); // Abre rápido al inicio
    
    if (frontRef.current) {
      frontRef.current.rotation.x = THREE.MathUtils.lerp(0, -Math.PI / 1.4, r1);
    }

    if (papersRef.current) {
      papersRef.current.position.y = THREE.MathUtils.lerp(0, 0.8, r1);
      papersRef.current.position.z = THREE.MathUtils.lerp(0, 0.3, r1);
    }

    if (groupRef.current) {
      // Movimiento más sutil
      groupRef.current.rotation.y = THREE.MathUtils.lerp(-Math.PI / 12, Math.PI / 12, scroll);
      groupRef.current.position.y = THREE.MathUtils.lerp(0.5, -0.2, scroll);
      groupRef.current.position.x = THREE.MathUtils.lerp(0.5, -0.5, scroll);
    }
  });

  return (
    <group ref={groupRef} scale={1.2}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Carpeta - Parte Trasera (Sleek Black) */}
        <mesh position={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[4, 3, 0.05]} />
          <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.9} />
        </mesh>
        {/* Bordes iluminados traseros */}
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[4.05, 3.05, 0.02]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.2} />
        </mesh>

        {/* Papeles internos (Minimalistas) */}
        <group ref={papersRef} position={[0, 0, 0.02]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, -i * 0.05, -i * 0.05]} rotation={[0, 0, i * 0.02]} castShadow>
              <boxGeometry args={[3.7, 2.7, 0.01]} />
              <meshStandardMaterial 
                color={i === 0 ? "#ffffff" : "#111111"} 
                emissive={i === 0 ? "#ffffff" : "#000000"}
                emissiveIntensity={i === 0 ? 0.1 : 0}
              />
            </mesh>
          ))}
        </group>

        {/* Tapa Frontal con bisagra (Minimalist) */}
        <group ref={frontRef} position={[0, -1.5, 0.05]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[4, 3, 0.05]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.8} />
          </mesh>
          {/* Logo Eurielec Estilo Wireframe/Glow en la tapa */}
          <mesh position={[0, 1.5, 0.03]}>
            <planeGeometry args={[1.2, 1.2]} />
            <meshBasicMaterial color="#ff0000" transparent opacity={0.4} wireframe />
          </mesh>
          {/* Línea de acento roja */}
          <mesh position={[-1.95, 1.5, 0.03]}>
            <boxGeometry args={[0.05, 2.8, 0.01]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
        </group>
      </Float>

      {/* Luces cinematográficas */}
      <spotLight position={[5, 10, 5]} intensity={100} color="#ff0000" angle={0.5} penumbra={1} castShadow />
      <pointLight position={[-5, 5, 2]} intensity={50} color="#ffffff" />
      <rectAreaLight position={[0, 5, 0]} width={10} height={10} intensity={2} color="#ff0000" />
    </group>
  );
}

export default function Archive3D({ scroll = 0 }: { scroll: number }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 40 }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 20]} />
        <ambientLight intensity={0.2} />
        <FolderContent scroll={scroll} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
