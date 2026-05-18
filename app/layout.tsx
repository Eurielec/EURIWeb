import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: {
    default: "Eurielec - Asociación de Electrónica Industrial",
    template: "%s | Eurielec"
  },
  description: "Asociación de Electrónica Industrial. Comunidad, tecnología e ingeniería en la ETSIT UPM.",
  metadataBase: new URL('https://eurielec.etsii.upm.es'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
  },
  openGraph: {
    title: 'Eurielec - Asociación de Electrónica Industrial',
    description: 'Web oficial de Eurielec, comité local de EESTEC en Madrid. Únete a la mayor comunidad tecnológica de la ETSII UPM.',
    url: 'https://eurielec.etsii.upm.es',
    siteName: 'Eurielec',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 1024,
        alt: 'Eurielec - Asociación de Electrónica Industrial',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eurielec - Asociación de Electrónica Industrial',
    description: 'Innovación, tecnología y comunidad en la ETSII UPM.',
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
      <body suppressHydrationWarning className="font-sans antialiased bg-red-600 text-black">
        <LanguageProvider initialLocale={locale}>
          {/* Aquí va el menú fijo para todas las páginas */}
          <Navbar />
          
          {/* Aquí se carga el contenido de cada página */}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}