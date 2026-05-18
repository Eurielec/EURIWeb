import { getDictionaryServer } from '@/lib/i18n-server';
import Footer from '@/components/Footer';

export default async function Privacidad() {
  const t = await getDictionaryServer();

  return (
    <main className="min-h-screen w-full flex flex-col bg-white text-black font-sans">
      <section className="max-w-4xl mx-auto px-6 py-32 space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
            Políticas de <span className="text-red-600">Privacidad</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
            Tratamiento de Datos y Protección al Socio
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-10 text-lg leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">Información Básica sobre Protección de Datos</h2>
            <p>
              De acuerdo con el Reglamento General de Protección de Datos (RGPD), le informamos de que <strong>LC Madrid (Eurielec ETSIT Madrid)</strong> es el responsable del tratamiento de sus datos personales.
            </p>
            <div className="bg-neutral-50 p-8 rounded-3xl border border-black/5 font-medium">
              <p className="mb-4">
                La finalidad del tratamiento de sus datos es la administración de los eventos, actividades y procesos de registro a los que usted se inscriba. Este tratamiento se basa en el <strong>Artículo 6.1 a) del RGPD de la UE</strong>: el interesado dio su consentimiento para el tratamiento de sus datos personales para uno o más fines específicos.
              </p>
              <p>
                Le informamos que los datos serán cedidos a terceros como la universidad <strong>"Universidad Politécnica de Madrid" (UPM)</strong>, la <strong>ETSI de Telecomunicación UPM</strong>, socios y patrocinadores, la asociación europea <strong>EESTEC (Electrical Engineering STudents European assoCiation)</strong> y a la justicia si estuviésemos legalmente obligados a ello.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">Sus Derechos</h2>
            <p>
              Usted puede acceder, rectificar y cancelar sus datos, así como ejercer otros derechos detallados en los términos y con las limitaciones indicadas en la información adicional. El cumplimiento de cualquier formulario en este sitio web implica que usted acepta todos los términos de la política de RGPD de Eurielec ETSIT Madrid.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight">Información Adicional</h2>
            <p>
              Para consultar la información detallada y completa sobre nuestra política de protección de datos, puede acceder al siguiente documento oficial:
            </p>
            <a 
              href="https://drive.google.com/file/d/1WhcSVqjFQ72kuCCHyVra6uqN7PcTXf1Z/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline"
            >
              Consultar Política de Privacidad Extendida (PDF)
            </a>
          </section>

          <section className="space-y-4 border-t border-black/5 pt-10">
            <p className="text-xs text-gray-400">
              Última actualización: Abril de 2026.
            </p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
