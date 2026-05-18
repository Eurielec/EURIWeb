'use client';

import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// -------------------------------------------------------------
// Lerp helper
// -------------------------------------------------------------
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// -------------------------------------------------------------
// Earth Mesh (reads shared scrollProgress ref)
// -------------------------------------------------------------
function EarthScene({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const earthRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  // Camera keyframes: position lerped from "space" → "Europe" → "Madrid surface"
  const camPositions = [
    new THREE.Vector3(0, 0, 18),   // phase 0: start (global view, centered)
    new THREE.Vector3(1, 3, 12),   // phase 1: zoomed to Europe
    new THREE.Vector3(3.5, 5, 8),  // phase 2: almost on Madrid
  ];

  const [colorMap, normalMap, specularMap] = useTexture([
    '/earth/earth-blue-marble.jpg',
    '/earth/earth-topology.png',
    '/earth/earth-water.png',
  ]);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0005;

    const p = scrollProgress.current; // 0 → 1

    // Map p to camera keyframes
    let camTarget: THREE.Vector3;
    if (p < 0.5) {
      // Phase 0→1
      const t = p / 0.5;
      camTarget = camPositions[0].clone().lerp(camPositions[1], t);
    } else {
      // Phase 1→2
      const t = (p - 0.5) / 0.5;
      camTarget = camPositions[1].clone().lerp(camPositions[2], t);
    }

    camera.position.lerp(camTarget, 0.05);

    // Rotate camera to look slightly left towards Madrid (lon≈-3.7°)
    const targetQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(lerp(0, -0.3, p), lerp(-0.4, 0.1, p), 0)
    );
    camera.quaternion.slerp(targetQuat, 0.05);
  });

  return (
    <group>
      {/* Earth */}
      <group ref={earthRef}>
        <mesh>
          <sphereGeometry args={[8, 64, 64]} />
          <meshPhongMaterial
            map={colorMap}
            normalMap={normalMap}
            specularMap={specularMap}
            specular={new THREE.Color('grey')}
            shininess={50}
          />
        </mesh>
        {/* Madrid pin (lat≈40.4°N lon≈-3.7°W → spherical coords) */}
        <mesh position={[3.9, 5.15, 4.6]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[3.9, 5.15, 4.6]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// Fallback Globe (shown while textures load)
// -------------------------------------------------------------
function FallbackGlobe() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.005; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[8, 32, 32]} />
      <meshStandardMaterial color="#1e3a8a" wireframe />
    </mesh>
  );
}

// -------------------------------------------------------------
// Main Component
// -------------------------------------------------------------

interface Dictionary {
  home: {
    sequence: Array<{ title: string; description: string }>;
  };
}

export default function Home3DSequence({ dictionary }: { dictionary: Dictionary }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Shared scroll progress (0→1) readable from inside Canvas
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=3000',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    // Text animations via standard GSAP + ScrollTrigger
    const tlText = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=3000',
        scrub: 1,
      },
    });

    // Card 1 (0% → 33%)
    tlText
      .fromTo('.seq-text-1',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.15 })
      .to('.seq-text-1',
        { opacity: 0, y: -30, duration: 0.15 }, 0.25);

    // Card 2 (33% → 66%)
    tlText
      .fromTo('.seq-text-2',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.15 }, 0.35)
      .to('.seq-text-2',
        { opacity: 0, y: -30, duration: 0.15 }, 0.6);

    // Card 3 (66% → end)
    tlText
      .fromTo('.seq-text-3',
        { opacity: 0, scale: 0.9, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.2 }, 0.72);

    return () => {
      trigger.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-black" style={{ height: '100vh' }}>

      {/* Canvas fills the full pinned viewport */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 18], fov: 55 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[20, 10, 20]} intensity={4.5} />
          <pointLight position={[-20, 0, 20]} intensity={2.5} color="#ffffff" />
          <Suspense fallback={<FallbackGlobe />}>
            <EarthScene scrollProgress={scrollProgress} />
          </Suspense>
          <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
        {/* bottom vignette */}
        <div className="absolute bottom-0 w-full h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, black, transparent)' }} />
      </div>

      {/* Text overlay – absolutely centered, swapped by GSAP */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4">

        {/* Card 1 */}
        <div className="seq-text-1 absolute max-w-2xl w-full text-center opacity-0
          bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 drop-shadow-lg">
            {dictionary.home.sequence[0].title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)' }} className="text-xl font-light">
            {dictionary.home.sequence[0].description}
          </p>
        </div>

        {/* Card 2 */}
        <div className="seq-text-2 absolute max-w-2xl w-full text-center opacity-0
          bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 drop-shadow-lg">
            {dictionary.home.sequence[1].title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)' }} className="text-xl font-light">
            {dictionary.home.sequence[1].description}
          </p>
        </div>

        {/* Card 3 */}
        <div className="seq-text-3 absolute max-w-2xl w-full text-center opacity-0
          bg-black/60 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8
          shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <div className="flex justify-center mb-4">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] inline-block animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            {dictionary.home.sequence[2].title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)' }} className="text-xl font-medium">
            {dictionary.home.sequence[2].description}
          </p>
        </div>

      </div>
    </div>
  );
}
