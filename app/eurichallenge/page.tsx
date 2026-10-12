import type { Metadata } from 'next';
import EurichallengeClient from './EurichallengeClient';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'EURIChallenge 2026 | Hackathon de Tecnología e Innovación ETSIT UPM',
  description: 'Participa en el EURIChallenge 2026 del 13 al 15 de Noviembre en la ETSIT UPM. Hackathon oficial de Eurielec y EESTEC LC Madrid. Reto: Gamificando la Fisioterapia con IA. Más de 1.500€ en premios. ¡Inscripciones abiertas!',
  keywords: [
    'EURIChallenge', 'Eurichallenge 2026', 'Hackathon ETSIT', 'Hackathon Madrid',
    'Eurielec', 'EESTEC', 'EESTech Challenge', 'UPM', 'Fisioterapia IA',
    'Inteligencia Artificial Hackathon', 'Programación', 'Estudiantes UPM'
  ],
  openGraph: {
    title: 'EURIChallenge 2026 | Hackathon ETSIT UPM',
    description: 'Hackathon de tecnología e innovación: 13, 14 y 15 de Noviembre. Reto: Gamificando la Fisioterapia con IA. +1.500€ en premios.',
    url: 'https://eurielec.etsit.upm.es/eurichallenge',
    siteName: 'Eurielec',
    images: [
      {
        url: '/eurichallenge/slide-01-hero.png',
        width: 1200,
        height: 630,
        alt: 'EURIChallenge 2026 Hackathon',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EURIChallenge 2026 | Hackathon ETSIT UPM',
    description: '13-15 Noviembre en ETSIT UPM. Reto de Fisioterapia con IA. +1.500€ en premios.',
    images: ['/eurichallenge/slide-01-hero.png'],
  },
};

export default function EurichallengePage() {
  return (
    <main className="w-full min-h-screen bg-[#08090A]">
      <EurichallengeClient />
      <Footer />
    </main>
  );
}
