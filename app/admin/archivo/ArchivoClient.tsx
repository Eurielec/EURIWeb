'use client';

import { useState } from 'react';
import { FileText, Plus, Trash2, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import { createDocumentAction, deleteDocumentAction } from '@/app/actions/archivo';

interface Document {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  category: string;
  createdAt: string;
}

export default function ArchivoClient({ initialDocuments }: { initialDocuments: Document[] }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createDocumentAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      // Simplificado: En un caso real revalidaríamos los datos. 
      // Aquí recargamos la página o actualizamos el estado local.
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este documento?')) return;
    
    setLoading(true);
    const result = await deleteDocumentAction(id);
    if (!result.error) {
      setDocuments(documents.filter(d => d.id !== id));
    }
    setLoading(false);
  }

  const categories = ["transparencia", "actas", "protocolos", "cuentas", "personal", "otros"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulario de Subida */}
      <div className="lg:col-span-1">
        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-8 sticky top-24">
          <div className="flex items-center gap-3 mb-8">
            <Plus className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Añadir Documento</h2>
          </div>

          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Título del Documento</label>
              <input 
                name="title" 
                required 
                placeholder="Ej: Balance de Cuentas 2023"
                className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Categoría</label>
              <select 
                name="category" 
                required 
                className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold appearance-none uppercase text-xs tracking-widest"
              >
                {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Adjuntar Documento (Local)</label>
              <div className="relative group">
                <input 
                  name="file" 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const fileName = e.target.files?.[0]?.name;
                    const label = e.target.parentElement?.querySelector('.file-label');
                    if (label && fileName) label.textContent = fileName;
                  }}
                />
                <div className="file-label w-full bg-black/40 border border-dashed border-white/10 rounded-2xl py-6 px-5 text-gray-400 text-center font-bold text-xs group-hover:border-red-600/50 group-hover:bg-red-600/5 transition-all">
                  Click para seleccionar archivo...
                </div>
              </div>
            </div>

            <div className="text-center">
               <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">— O —</span>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Enlace / URL (Externo)</label>
              <input 
                name="fileUrl" 
                type="url" 
                placeholder="https://drive.google.com/..."
                className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold text-xs" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descripción (Opcional)</label>
              <textarea 
                name="description" 
                rows={3}
                placeholder="Breve explicación del contenido..."
                className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold text-xs resize-none" 
              />
            </div>

            {error && (
              <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Subiendo...' : 'Publicar Documento'}
            </button>
          </form>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="lg:col-span-2">
        <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-black/20 flex justify-between items-center">
             <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Documentos en Archivo</h2>
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
              Total: {documents.length}
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {documents.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <Info className="w-12 h-12 text-white/5 mx-auto" />
                <p className="text-gray-500 font-black uppercase text-xs tracking-widest">No hay documentos en el archivo</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="p-8 hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 shrink-0 group-hover:border-red-600/30 transition-colors">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">{doc.title}</h3>
                          <span className="text-[9px] font-black bg-red-600/10 text-red-600 px-2 py-0.5 rounded border border-red-600/20 uppercase tracking-tighter">
                            {doc.category}
                          </span>
                        </div>
                        {doc.description && <p className="text-gray-500 text-sm">{doc.description}</p>}
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                           <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3 h-3 text-green-500/50" />
                            <span>Verificado</span>
                          </div>
                          <span>{new Date(doc.createdAt).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                       <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                        title="Ver Documento"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="p-3 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
