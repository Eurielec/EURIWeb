import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "EURIELEC - EESTEC LC MADRID - Asociación de electrónica y software libre",
    template: "%s | Eurielec"
  },
  description: "Web oficial de Eurielec, Asociación de electrónica y software libre y comité local EESTEC LC Madrid. Comunidad, tecnología e ingeniería en la ETSIT UPM.",
  keywords: [
    "Eurielec", "EESTEC", "EESTEC LC Madrid", "eestec lc madrid", "ETSIT", "UPM", "ETSII", 
    "Ingeniería", "ingenieros", "Electrónica", "electronica etsit", "software libre", "software etsit", 
    "Asociación de estudiantes", "Madrid", "Tecnología", "clubes etsit", "clubes", "club", 
    "patrocinio", "patrocinador", "euri"
  ],
  metadataBase: new URL('https://eurielec.etsit.upm.es'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
  },
  openGraph: {
    title: 'EURIELEC - EESTEC LC MADRID - Asociación de electrónica y software libre',
    description: 'Web oficial de Eurielec, comité local de EESTEC en Madrid. Únete a la mayor comunidad tecnológica de la ETSIT UPM.',
    url: 'https://eurielec.etsit.upm.es',
    siteName: 'Eurielec',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 1024,
        alt: 'EURIELEC - EESTEC LC MADRID',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EURIELEC - EESTEC LC MADRID - Asociación de electrónica y software libre',
    description: 'Innovación, tecnología y comunidad en la ETSIT UPM.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const locale = (localeCookie?.value === 'en' ? 'en' : 'es') as Locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider initialLocale={locale}>
            {/* Aquí va el menú fijo para todas las páginas */}
            <Navbar />
            
            {/* Aquí se carga el contenido de cada página */}
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}