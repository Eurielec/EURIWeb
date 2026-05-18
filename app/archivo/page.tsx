import { getDocuments } from '@/app/actions/archivo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArchivoView from './ArchivoView';

export const metadata = {
  title: 'Archivo y Transparencia | Eurielec',
  description: 'Portal de transparencia y archivos oficiales de la asociación Eurielec.',
};

export default async function ArchivoPublicPage() {
  const documents = await getDocuments();

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <Navbar />
      <ArchivoView documents={JSON.parse(JSON.stringify(documents))} />
      <Footer />
    </div>
  );
}
