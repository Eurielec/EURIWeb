'use client';

import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh } from 'three';

function CuboMágico(props: ThreeElements['mesh']) {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta;
    if (active) meshRef.current.rotation.y += delta * 2;
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-[400px] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative bg-black/50 backdrop-blur-sm group">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <CuboMágico position={[0, 0, 0]} />
      </Canvas>
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        <p className="text-gray-300 text-sm font-bold tracking-widest uppercase">Interactúa (Click o Hover)</p>
      </div>
    </div>
  );
}
