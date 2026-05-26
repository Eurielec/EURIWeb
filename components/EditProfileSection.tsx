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
      <section className="font-sans">
        
        {/* PERSONAL INFO HEADER */}
        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <div className="w-16 h-16 bg-red-600 flex items-center justify-center overflow-hidden relative">
                 {user.image ? (
                   <Image src={user.image} alt={user.name || 'Perfil'} fill className="object-cover" />
                 ) : (
                   <span className="text-black font-black text-2xl">{user.name ? user.name[0].toUpperCase() : 'E'}</span>
                 )}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                   {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                 </div>
               </div>
               <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t.editProfile.personalInfo}</h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">{user.name || 'Usuario'}</p>
            </div>
          </div>
          <button 
            onClick={() => setEditMode('personal')}
            className="flex items-center gap-2 px-6 py-3 border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Edit3 className="w-3 h-3" />
            {t.editProfile.editData}
          </button>
        </div>

        {/* PERSONAL INFO DATA LIST */}
        <div className="space-y-0">
          
          <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
            <div className="flex items-center gap-6">
              <Mail className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold w-32">{t.editProfile.email}</p>
            </div>
            <p className="text-white font-medium text-right">{user.email}</p>
          </div>

          <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
            <div className="flex items-center gap-6">
              <Phone className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold w-32">{t.editProfile.phone}</p>
            </div>
            <p className="text-white font-medium text-right">{user.phone || t.editProfile.notSpecified}</p>
          </div>

          <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
            <div className="flex items-center gap-6">
              <MapPin className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold w-32">{t.editProfile.address}</p>
            </div>
            <p className="text-white font-medium text-right">{user.address || t.editProfile.notSpecified}</p>
          </div>

          <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
            <div className="flex items-center gap-6">
              <Building2 className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold w-32">{t.editProfile.location}</p>
            </div>
            <p className="text-white font-medium text-right">
              {user.city ? `${user.city}, ${user.province} (${user.zipCode})` : t.editProfile.notSpecified}
            </p>
          </div>

          <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
            <div className="flex items-center gap-6">
              <GraduationCap className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold w-32">{t.editProfile.school}</p>
            </div>
            <p className="text-white font-medium text-right">{user.university || t.editProfile.notSpecified}</p>
          </div>

          <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
            <div className="flex items-center gap-6">
              <BookOpen className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold w-32">{t.editProfile.year}</p>
            </div>
            <p className="text-white font-medium text-right">{user.academicYear || t.editProfile.notSpecified}</p>
          </div>

        </div>
      </section>

      {user.role !== 'GUEST' && (
        <section className="font-sans mt-16">
          {/* LOGISTICS INFO HEADER */}
          <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t.editProfile.logistics}</h2>
            <button 
              onClick={() => setEditMode('logistics')}
              className="flex items-center gap-2 px-6 py-3 border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Edit3 className="w-3 h-3" />
              {t.editProfile.editLogistics}
            </button>
          </div>

          {/* LOGISTICS DATA LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
            
            <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
              <div className="flex items-center gap-4">
                <Utensils className="w-5 h-5 text-red-500" strokeWidth={1.5} />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t.editProfile.dietary}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{user.dietary || t.editProfile.notSpecified}</p>
                {user.allergies && <p className="text-[10px] text-red-400 mt-1 uppercase tracking-widest font-black">{t.editProfile.allergies} {user.allergies}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
              <div className="flex items-center gap-4">
                <Shirt className="w-5 h-5 text-red-500" strokeWidth={1.5} />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t.editProfile.tshirt}</p>
              </div>
              <p className="text-white font-black text-xl">{user.tShirtSize || t.editProfile.notSpecified}</p>
            </div>

            <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
              <div className="flex items-center gap-4">
                <Wine className="w-5 h-5 text-red-500" strokeWidth={1.5} />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t.editProfile.alcohol}</p>
              </div>
              <p className="text-white font-medium">{user.alcohol || t.editProfile.notSpecified}</p>
            </div>

            <div className="flex items-center justify-between py-5 border-b border-white/5 hover:bg-white/5 transition-colors px-2">
              <div className="flex items-center gap-4">
                <Car className="w-5 h-5 text-red-500" strokeWidth={1.5} />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t.editProfile.car}</p>
              </div>
              <p className="text-white font-medium">{user.hasCar ? t.editProfile.hasCar : t.editProfile.noCar}</p>
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
