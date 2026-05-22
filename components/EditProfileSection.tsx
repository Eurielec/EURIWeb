'use client';

import { useState, useRef, useTransition } from 'react';
import { Edit3, Mail, Phone, MapPin, Building2, GraduationCap, BookOpen, Utensils, Shirt, Wine, Car, Camera, Loader2 } from 'lucide-react';
import EditUserModal from './EditUserModal';
import { uploadProfileImageAction } from '@/app/actions/upload';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';

export default function EditProfileSection({ user }: { user: any }) {
  const [editMode, setEditMode] = useState<'none' | 'personal' | 'logistics'>('none');
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    startUpload(async () => {
      await uploadProfileImageAction(formData);
    });
  };

  return (
    <>
      <section className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-xl relative overflow-hidden group font-sans">
        {/* Luces sutiles - Red Theme */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20 overflow-hidden relative border border-white/10">
                 {user.image ? (
                   <Image src={user.image} alt={user.name || 'Perfil'} fill className="object-cover" />
                 ) : (
                   <span className="text-white font-black text-2xl">{user.name ? user.name[0].toUpperCase() : 'E'}</span>
                 )}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                   {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                 </div>
               </div>
               <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>
            <div>
              <h2 className="text-xl font-black text-red-600 uppercase tracking-widest italic">{t.editProfile.personalInfo}</h2>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{user.name || 'Usuario'}</p>
            </div>
          </div>
          <button 
            onClick={() => setEditMode('personal')}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-600/20 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Edit3 className="w-4 h-4" />
            {t.editProfile.editData}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
               <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.email}</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
               <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.phone}</p>
              <p className="text-white font-medium">{user.phone || t.editProfile.notSpecified}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
               <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.address}</p>
              <p className="text-white font-medium">{user.address || t.editProfile.notSpecified}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
               <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.location}</p>
              <p className="text-white font-medium">
                {user.city ? `${user.city}, ${user.province} (${user.zipCode})` : t.editProfile.notSpecified}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
               <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.school}</p>
              <p className="text-white font-medium">{user.university || t.editProfile.notSpecified}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-white/5 rounded-lg text-gray-400">
               <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.year}</p>
              <p className="text-white font-medium">{user.academicYear || t.editProfile.notSpecified}</p>
            </div>
          </div>
        </div>
      </section>

      {user.role !== 'GUEST' && (
        <section className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-xl mt-8 font-sans">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-xl font-black text-red-600 uppercase tracking-widest italic">{t.editProfile.logistics}</h2>
            <button 
              onClick={() => setEditMode('logistics')}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-600/20 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <Edit3 className="w-4 h-4" />
              {t.editProfile.editLogistics}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                 <Utensils className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.dietary}</p>
                <p className="text-white font-medium">{user.dietary || t.editProfile.notSpecified}</p>
                {user.allergies && <p className="text-xs text-red-400 mt-1 line-clamp-1">{t.editProfile.allergies} {user.allergies}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                 <Shirt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.tshirt}</p>
                <p className="text-white font-bold">{user.tShirtSize || t.editProfile.notSpecified}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                 <Wine className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.alcohol}</p>
                <p className="text-white font-medium">{user.alcohol || t.editProfile.notSpecified}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                 <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{t.editProfile.car}</p>
                <p className="text-white font-medium">{user.hasCar ? t.editProfile.hasCar : t.editProfile.noCar}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {editMode !== 'none' && (
        <EditUserModal 
          user={user} 
          onClose={() => setEditMode('none')} 
          isAdmin={false} 
          mode={editMode}
        />
      )}
    </>
  );
}
