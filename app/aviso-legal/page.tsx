import { getDictionaryServer } from '@/lib/i18n-server';
import Footer from '@/components/Footer';

export default async function AvisoLegal() {
  const t = await getDictionaryServer();

  return (
    <main className="min-h-screen w-full flex flex-col bg-white text-black font-sans">
      <section className="max-w-4xl mx-auto px-6 py-32 space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
            Aviso <span className="text-red-600">Legal</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
            Transparencia y Marco Jurídico de la Asociación
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-10 text-lg leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">1. Datos Identificativos</h2>
            <p>
              En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los siguientes datos:
            </p>
            <ul className="list-none space-y-2 font-bold">
              <li><span className="text-red-600">Entidad:</span> Asociación Eurielec</li>
              <li><span className="text-red-600">Sede:</span> ETSI Industriales UPM, C/ José Gutiérrez Abascal, 2, 28006 Madrid</li>
              <li><span className="text-red-600">Email:</span> info@eurielec.etsii.upm.es</li>
              <li><span className="text-red-600">Ámbito:</span> Asociación de Estudiantes sin ánimo de lucro.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">2. Usuarios</h2>
            <p>
              El acceso y/o uso de este portal de Eurielec atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">3. Uso del Portal</h2>
            <p>
              La web proporciona acceso a multitud de informaciones, servicios, programas o datos en Internet pertenecientes a Eurielec. El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.
            </p>
          </section>

          <section className="space-y-4 border-t border-black/5 pt-10">
            <p className="text-sm text-gray-500 italic">
              Última actualización: Abril de 2026.
            </p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
