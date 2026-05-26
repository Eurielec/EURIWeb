'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  X, 
  Save, 
  ArrowUp, 
  ArrowDown,
  User
} from 'lucide-react';
import { 
  createJuntaMemberAction, 
  updateJuntaMemberAction, 
  deleteJuntaMemberAction, 
  uploadJuntaImageAction,
  reorderJuntaMembersAction
} from '@/app/actions/junta';
// import { toast } from 'sonner'; // Eliminado por falta de dependencia

interface JuntaMember {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string | null;
  order: number;
}

export default function JuntaAdminClient({ initialMembers }: { initialMembers: JuntaMember[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<JuntaMember> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Abrir modal para crear
  const handleAddClick = () => {
    setEditingMember({
      name: '',
      role: '',
      description: '',
      imageUrl: '',
      order: members.length
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEditClick = (member: JuntaMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  // Eliminar miembro
  const handleDeleteClick = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar a este miembro de la junta?')) return;
    
    try {
      await deleteJuntaMemberAction(id);
      setMembers(members.filter(m => m.id !== id));
      alert('Miembro eliminado');
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  // Subir imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const result = await uploadJuntaImageAction(formData);
      if (result.success && result.imageUrl) {
        setEditingMember(prev => ({ ...prev, imageUrl: result.imageUrl }));
        alert('Imagen subida');
      } else {
        alert(result.error || 'Error al subir imagen');
      }
    } catch (error) {
      alert('Error en la subida');
    } finally {
      setIsUploading(false);
    }
  };

  // Guardar (Crear o Editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.role) {
      alert('Nombre y cargo son obligatorios');
      return;
    }

    setIsSaving(true);
    try {
      if (editingMember.id) {
        // Update
        const updated = await updateJuntaMemberAction(editingMember.id, {
          name: editingMember.name,
          role: editingMember.role,
          description: editingMember.description || '',
          imageUrl: editingMember.imageUrl || undefined,
          order: editingMember.order
        });
        setMembers(members.map(m => m.id === updated.id ? updated as JuntaMember : m));
        alert('Miembro actualizado');
      } else {
        // Create
        const created = await createJuntaMemberAction({
          name: editingMember.name,
          role: editingMember.role,
          description: editingMember.description || '',
          imageUrl: editingMember.imageUrl || undefined,
          order: editingMember.order
        });
        setMembers([...members, created as JuntaMember]);
        alert('Miembro creado');
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  // Reordenar
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newMembers = [...members];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= members.length) return;

    [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];
    
    setMembers(newMembers);
    try {
      await reorderJuntaMembersAction(newMembers.map(m => m.id));
    } catch (error) {
      alert('Error al reordenar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">Miembros actuales</h2>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
        >
          <Plus className="w-4 h-4" /> Añadir Miembro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.sort((a,b) => a.order - b.order).map((member, index) => (
          <div 
            key={member.id}
            className="p-6 border border-white/10 group hover:border-red-600/30 hover:bg-white/5 transition-all duration-300 font-sans"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-600/20 overflow-hidden flex items-center justify-center shrink-0">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-red-600" />
                )}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-lg font-black text-white truncate uppercase tracking-tight">{member.name}</h3>
                <p className="text-[10px] text-red-600 font-black uppercase tracking-widest truncate">{member.role}</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm line-clamp-2 mb-6 font-light">
              {member.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 disabled:opacity-20 transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === members.length - 1}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 disabled:opacity-20 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditClick(member)}
                  className="p-2 bg-red-600/10 hover:bg-red-600/20 rounded-lg text-red-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(member.id)}
                  className="p-2 bg-red-600/10 hover:bg-red-600/20 rounded-lg text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-black border border-white/10 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 font-sans">
            <header className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
                {editingMember?.id ? 'Editar Miembro' : 'Nuevo Miembro'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </header>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Imagen */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 bg-red-600/5 border border-dashed border-red-600/20 overflow-hidden flex items-center justify-center group">
                  {editingMember?.imageUrl ? (
                    <img src={editingMember.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-red-600/40" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Foto del miembro</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={editingMember?.name}
                    onChange={e => setEditingMember(prev => ({ ...prev!, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 transition-colors"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Cargo</label>
                  <input 
                    type="text" 
                    value={editingMember?.role}
                    onChange={e => setEditingMember(prev => ({ ...prev!, role: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 transition-colors"
                    placeholder="Ej: Presidente"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Descripción</label>
                  <textarea 
                    value={editingMember?.description}
                    onChange={e => setEditingMember(prev => ({ ...prev!, description: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-red-600/50 transition-colors h-24 resize-none"
                    placeholder="Breve biografía o responsabilidades..."
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20"
                >
                  {isSaving ? 'Guardando...' : (
                    <>
                      <Save className="w-5 h-5" /> {editingMember?.id ? 'Actualizar Miembro' : 'Crear Miembro'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
