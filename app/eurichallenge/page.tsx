import type { Metadata } from 'next';
import EurichallengeClient from './EurichallengeClient';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Hackathon Madrid 2026 | EURIChallenge ETSIT UPM - Hackathon de Tecnología, Programación e IA',
  description: '¿Buscas un hackathon en Madrid? Participa en el EURIChallenge 2026 (13-15 de Noviembre en ETSIT UPM, Madrid). El mayor hackathon presencial de programación, inteligencia artificial y tecnología para estudiantes y jóvenes desarrolladores. Reto de IA, +1.500€ en premios, 100% gratuito con comidas y welcome pack incluidos. ¡Inscríbete gratis!',
  keywords: [
    'hackathon madrid',
    'hackaton madrid',
    'hakathon madrid',
    'hackathones madrid',
    'hackathones madrid 2026',
    'hackathon madrid 2026',
    'hackathon estudiantes madrid',
    'hackathon universitarios madrid',
    'hackathon jovenes madrid',
    'hackathon programacion madrid',
    'hackathon software madrid',
    'hackathon ia madrid',
    'hackathon inteligencia artificial madrid',
    'hackathon etsit',
    'hackathon etsit upm',
    'hackathon upm',
    'hackaton etsit upm',
    'hackathon tecnologia madrid',
    'hackathon presencial madrid',
    'hackathon gratis madrid',
    'concurso programacion madrid',
    'concurso informatica madrid',
    'hackathons espana',
    'hackathons espana 2026',
    'proximos hackathones madrid',
    'calendario hackathones madrid',
    'eurichallenge',
    'eurichallenge 2026',
    'euri challenge',
    'eestech challenge',
    'eestech challenge madrid',
    'eurielec',
    'eestec lc madrid',
    'etsit upm',
    'ciudad universitaria madrid hackathon'
  ],
  alternates: {
    canonical: 'https://eurielec.etsit.upm.es/eurichallenge',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Hackathon Madrid 2026 | EURIChallenge ETSIT UPM - +1.500€ en Premios',
    description: 'El mayor hackathon de tecnología, programación e IA en Madrid para estudiantes. 13-15 de Noviembre en la ETSIT UPM. 100% gratuito con comidas y welcome pack.',
    url: 'https://eurielec.etsit.upm.es/eurichallenge',
    siteName: 'Eurielec - Asociación de Electrónica y Software Libre',
    images: [
      {
        url: '/eurichallenge/slide-01-hero.png',
        width: 1200,
        height: 630,
        alt: 'EURIChallenge 2026 - Hackathon Madrid ETSIT UPM',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackathon Madrid 2026 | EURIChallenge ETSIT UPM',
    description: '13-15 Noviembre en Madrid. Hackathon de IA y programación. +1.500€ en premios. Inscripciones abiertas y 100% gratuitas.',
    images: ['/eurichallenge/slide-01-hero.png'],
  },
};

const jsonLdEvent = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'EURIChallenge 2026 - Hackathon Madrid ETSIT UPM',
  alternateName: [
    'Hackathon Madrid 2026',
    'Hackathon ETSIT UPM',
    'EURIChallenge Hackathon',
    'Hackaton Madrid'
  ],
  description: 'Hackathon oficial de programación, tecnología e inteligencia artificial en Madrid organizado por Eurielec y EESTEC LC Madrid en la ETSIT UPM. 48 horas de desarrollo intensivo, mentoría técnica y más de 1.500€ en premios.',
  startDate: '2026-11-13T16:00:00+01:00',
  endDate: '2026-11-15T18:00:00+01:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'ETSI de Telecomunicación (ETSIT - UPM)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Avenida Complutense 30, Ciudad Universitaria',
      addressLocality: 'Madrid',
      postalCode: '28040',
      addressRegion: 'Comunidad de Madrid',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.4524,
      longitude: -3.7269,
    },
  },
  image: ['https://eurielec.etsit.upm.es/eurichallenge/slide-01-hero.png'],
  organizer: [
    {
      '@type': 'Organization',
      name: 'Eurielec - Asociación de Electrónica y Software Libre',
      url: 'https://eurielec.etsit.upm.es',
    },
    {
      '@type': 'Organization',
      name: 'EESTEC LC Madrid',
      url: 'https://eurielec.etsit.upm.es',
    },
  ],
  offers: {
    '@type': 'Offer',
    url: 'https://eurichallenge.fillout.com/2026',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    validFrom: '2026-01-01T00:00:00+01:00',
  },
  typicalAgeRange: '18-30',
  keywords: 'hackathon madrid, hackaton madrid, hackathones madrid, hackathon estudiantes madrid, hackathon upm, hackathon etsit, concurso programacion madrid',
};

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es EURIChallenge y qué tipo de hackathon es en Madrid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EURIChallenge es el hackathon universitario de referencia en Madrid, organizado por la asociación Eurielec y EESTEC LC Madrid en la ETSIT UPM. Durante 48 horas, equipos de 3 estudiantes y desarrolladores crean prototipos innovadores combinando inteligencia artificial, visión por computador y software.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Dónde se celebra este hackathon en Madrid y cómo llegar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Se celebra de forma 100% presencial en la ETSI de Telecomunicación (ETSIT - UPM), situada en la Av. Complutense 30, Ciudad Universitaria, 28040 Madrid. Es fácilmente accesible en Metro (Línea 6, estación Ciudad Universitaria o Vicente Aleixandre) y en autobuses de la EMT (Líneas 82, 132, F, G, U).',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta participar en el hackathon Madrid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La inscripción es 100% gratuita gracias a los patrocinadores y a la ETSIT UPM. Incluye espacio de trabajo, Wi-Fi de alta velocidad, comidas, cenas, bebidas, snacks y welcome pack sin ningún coste.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Quién puede apuntarse al hackathon EURIChallenge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cualquier estudiante universitario o recién graduado de la UPM u otras universidades de Madrid y España, con interés en programación, inteligencia artificial, electrónica o diseño. Puedes apuntarte con equipo completo, en pareja o de forma individual.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuáles son los premios del hackathon?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hay más de 1.500€ en el pool de recompensas: 1º Premio (150€ cash + 100€ tech products + trofeo), 2º Premio (+100€ tech products y periféricos), 3er Premio (merchandising oficial exclusivo) y diplomas acreditativos oficiales para todos los participantes.',
      },
    },
  ],
};

export default function EurichallengePage() {
  return (
    <main className="w-full min-h-screen bg-[#08090A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <EurichallengeClient />
      <Footer />
    </main>
  );
}
