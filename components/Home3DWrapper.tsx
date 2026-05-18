'use client';

import dynamic from 'next/dynamic';

// Cargamos el componente 3D dinámicamente desactivando el SSR
// para evitar los errores de next/dynamic en el servidor y los hydration mismatches
const Home3DSequence = dynamic(() => import('./Home3DSequence'), { ssr: false });

export default function Home3DWrapper({ dictionary }: { dictionary: any }) {
  return <Home3DSequence dictionary={dictionary} />;
}
