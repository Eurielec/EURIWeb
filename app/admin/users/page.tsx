import { prisma } from '@/lib/prisma';
import { Search, Shield, User } from 'lucide-react';
import { getUserSession } from '@/lib/auth';
import UserActions from '@/components/UserActions';
import CreateUserButton from '@/components/CreateUserButton';
import ResetMembershipButton from '@/components/ResetMembershipButton';
import { redirect } from 'next/navigation';

export default async function UsersManagement() {
  const session = await getUserSession();
  
  // Protección de seguridad para Vocales u otros roles no autorizados
  if (session?.role !== 'ADMIN') {
    redirect('/admin');
  }

  // Fetch users ordered by newest first
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-sans text-white tracking-tight">Gestión de Usuarios</h1>
          <p className="text-gray-400 mt-2 text-lg">Administra los miembros de la asociación Eurielec.</p>
        </div>
        
        {session?.role === 'ADMIN' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <ResetMembershipButton />
            <CreateUserButton />
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-neutral-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-white/5 bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar socios..." 
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="text-sm font-medium text-gray-400">
            Total: <span className="text-white font-bold">{users.length}</span> miembros
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/40 text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-8 py-5 font-semibold">Miembro</th>
                <th className="px-8 py-5 font-semibold">Rol</th>
                <th className="px-8 py-5 font-semibold">Cuota Socio</th>
                <th className="px-8 py-5 font-semibold">Fecha de Ingreso</th>
                <th className="px-8 py-5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        user.role === 'ADMIN' 
                          ? 'bg-gradient-to-tr from-purple-500 to-pink-500 shadow-purple-500/20' 
                          : user.role === 'VOCAL'
                            ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/20'
                            : user.role === 'ALUMNI'
                              ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/20'
                              : user.role === 'GUEST'
                                ? 'bg-gradient-to-tr from-gray-500 to-slate-500 shadow-gray-500/20'
                                : 'bg-gradient-to-tr from-blue-500 to-cyan-500 shadow-blue-500/20'
                      } shadow-lg`}>
                        {user.role === 'ADMIN' || user.role === 'VOCAL' ? <Shield className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.name || 'Sin Nombre'}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : user.role === 'VOCAL'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : user.role === 'ALUMNI'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : user.role === 'GUEST'
                                ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {user.role === 'ADMIN' ? 'ADMINISTRADOR' : user.role === 'VOCAL' ? 'VOCAL' : user.role === 'ALUMNI' ? 'ALUMNI' : user.role === 'GUEST' ? 'INVITADO (PDTE)' : 'SOCIO'}
                      </span>
                      {user.role === 'VOCAL' && user.vocalia && (
                        <span className="text-[10px] uppercase font-bold text-amber-500/70 tracking-widest pl-1">
                          Vocalía: {user.vocalia}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {user.membershipPaymentStatus === 'PAID' || user.membershipPaymentStatus === 'PAID_CARD' || user.membershipPaymentStatus === 'PAID_CASH' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        PAGADA
                      </span>
                    ) : user.membershipPaymentStatus === 'PENDING_CASH' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Efectivo Pdte
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                        NO PAGADA
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-gray-400 tabular-nums">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </td>
                  <td className="px-8 py-5 align-middle">
                    <UserActions 
                      user={user} 
                      isSelf={session?.userId === user.id} 
                    />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-500">
                    No hay usuarios registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
