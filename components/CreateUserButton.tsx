'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import CreateUserModal from './CreateUserModal';

export default function CreateUserButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-orange-500/25 transition-all transform active:scale-95"
      >
        <UserPlus className="w-5 h-5" />
        Nuevo Socio
      </button>

      {isOpen && (
        <CreateUserModal onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
