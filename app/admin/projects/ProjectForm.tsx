'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProjectAction } from './actions';
import { Upload, X, Loader2, CheckCircle2, FileText } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Vocalia {
  id: string;
  name: { es: string; en: string };
}

interface ProjectFormProps {
  users: User[];
  vocalias: Vocalia[];
}

export default function ProjectForm({ users, vocalias }: ProjectFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [imageName, setImageName] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image') setImageName(file.name);
      else setPdfName(file.name);
    }
  };

  const clearFile = (type: 'image' | 'pdf') => {
    if (type === 'image') {
      setImageName(null);
      const input = formRef.current?.querySelector('input[name="imageFile"]') as HTMLInputElement;
      if (input) input.value = '';
    } else {
      setPdfName(null);
      const input = formRef.current?.querySelector('input[name="pdfFile"]') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setShowSuccess(false);

    const formData = new FormData(e.currentTarget);
    // Add multiple members to formData
    selectedMembers.forEach(id => {
      formData.append('members', id);
    });

    try {
      await createProjectAction(formData);
      
      // Feedback y limpieza
      setShowSuccess(true);
      setSelectedMembers([]);
      setImageName(null);
      setPdfName(null);
      formRef.current?.reset();
      
      router.refresh();
      
      // Ocultar mensaje de éxito tras 5 segundos
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      alert("Hubo un error al crear el proyecto");
    } finally {
      setIsPending(false);
    }
  };

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className="border border-white/10 p-6 space-y-6 relative overflow-hidden font-sans"
    >
      {/* Banner de Éxito */}
      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 py-3 bg-green-500 text-white text-center text-sm font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4" /> Proyecto creado y publicado correctamente
        </div>
      )}

      <h2 className={`text-xl font-black text-white transition-all ${showSuccess ? 'mt-8' : ''}`}>Añadir Nuevo Proyecto</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Título del Proyecto</label>
          <input 
            type="text" 
            name="title" 
            required
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-700"
            placeholder="Ej: Eurielec Web v3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Vocalía Responsable</label>
          <select 
            name="vocaliaId" 
            required
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
          >
            {vocalias.map((v) => (
              <option key={v.id} value={v.id}>{v.name.es}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Duración</label>
          <input 
            type="text" 
            name="duration" 
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-700"
            placeholder="Ej: 3 meses, 2 semanas..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Descripción Breve</label>
          <textarea 
            name="description" 
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all resize-none h-12 placeholder:text-gray-700"
            placeholder="Resumen del proyecto..."
          ></textarea>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-white/50 uppercase">Socios Implicados</label>
        <div className="p-4 bg-black border border-white/10 rounded-xl max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
          {users.map(u => (
            <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/20 bg-neutral-900 text-red-600 focus:ring-red-500 focus:ring-offset-black"
                checked={selectedMembers.includes(u.id)}
                onChange={() => toggleMember(u.id)}
              />
              <span className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">
                {u.name || 'Sin nombre'} <span className="text-white/30 text-xs font-normal">({u.email})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subida de Imagen */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Imagen de Portada (Opcional)</label>
          <div className="relative">
            <input 
              type="file" 
              name="imageFile" 
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'image')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full bg-black border border-dashed rounded-xl px-4 py-6 flex flex-col items-center justify-center transition-all ${
              imageName 
                ? 'border-green-500/50 text-green-500 bg-green-500/5' 
                : 'border-white/20 text-white/50 hover:border-red-500 hover:text-red-500'
            }`}>
              {imageName ? (
                <>
                  <CheckCircle2 className="w-8 h-8 mb-2" />
                  <span className="text-sm font-bold truncate max-w-full px-4">{imageName}</span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); clearFile('image'); }}
                    className="mt-2 text-[10px] uppercase font-black tracking-widest text-white/40 hover:text-red-500 transition-colors z-20"
                  >
                    Quitar archivo
                  </button>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-sm">Click para subir foto</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Subida de PDF */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/50 uppercase">Informe PDF (Opcional)</label>
          <div className="relative">
            <input 
              type="file" 
              name="pdfFile" 
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 'pdf')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full bg-black border border-dashed rounded-xl px-4 py-6 flex flex-col items-center justify-center transition-all ${
              pdfName 
                ? 'border-green-500/50 text-green-500 bg-green-500/5' 
                : 'border-white/20 text-white/50 hover:border-red-500 hover:text-red-500'
            }`}>
              {pdfName ? (
                <>
                  <FileText className="w-8 h-8 mb-2" />
                  <span className="text-sm font-bold truncate max-w-full px-4">{pdfName}</span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); clearFile('pdf'); }}
                    className="mt-2 text-[10px] uppercase font-black tracking-widest text-white/40 hover:text-red-500 transition-colors z-20"
                  >
                    Quitar archivo
                  </button>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-sm">Click para subir informe .pdf</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <button 
        disabled={isPending}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-[0.99]"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Publicando...
          </>
        ) : 'Crear Proyecto'}
      </button>
    </form>
  );
}
