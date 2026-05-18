'use client';

import { toggleRoleAction, deleteUserAction } from '@/app/actions/users';
import { Shield, ShieldAlert, Trash2, UserCheck, Edit3, Award } from 'lucide-react';
import { useTransition, useState } from 'react';
import EditUserModal from './EditUserModal';
import AdjustPointsModal from './AdjustPointsModal';

export default function UserActions({ user, isSelf }: { user: any, isSelf: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdjustingPoints, setIsAdjustingPoints] = useState(false);

  if (isSelf) {
    return <div className="flex justify-end pr-4"><span className="text-xs text-orange-400 font-bold italic">Tú</span></div>;
  }

  const handleToggle = () => {
    startTransition(async () => {
      await toggleRoleAction(user.id);
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás MUY seguro de que quieres eliminar a este usuario de la base de datos?')) {
      startTransition(async () => {
        await deleteUserAction(user.id);
      });
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsAdjustingPoints(true)}
          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
          title="Gestión de Puntos"
        >
          <Award className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
          title="Editar Usuario"
        >
          <Edit3 className="w-5 h-5" />
        </button>

        <button 
          onClick={handleToggle}
          disabled={isPending}
          className={`p-2 rounded-lg transition-colors ${
            user.role === 'ADMIN' 
              ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400' 
              : user.role === 'VOCAL'
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                : user.role === 'GUEST'
                  ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400'
          }`}
          title={user.role === 'ADMIN' ? 'Modificar Rol' : user.role === 'VOCAL' ? 'Hacer Admin' : user.role === 'GUEST' ? 'Validar a Socio' : 'Hacer Vocal'}
        >
          {user.role === 'ADMIN' ? <ShieldAlert className="w-5 h-5" /> : user.role === 'VOCAL' ? <Shield className="w-5 h-5" /> : user.role === 'GUEST' ? <UserCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
          title="Eliminar Usuario Completamente"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {isEditing && (
        <EditUserModal 
          user={user} 
          onClose={() => setIsEditing(false)} 
          isAdmin={true} 
        />
      )}

      {isAdjustingPoints && (
        <AdjustPointsModal 
          user={user} 
          onClose={() => setIsAdjustingPoints(false)} 
        />
      )}
    </>
  );
}
