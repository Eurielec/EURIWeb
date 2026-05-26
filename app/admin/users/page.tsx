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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* Header */}
      <header className="border-b border-white/10 pb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-red-600 uppercase tracking-tighter italic leading-none">USUARIOS</h1>
          <p className="text-gray-400 mt-4 text-sm font-black uppercase tracking-[0.2em]">Administra los miembros de Eurielec</p>
        </div>
        
        {session?.role === 'ADMIN' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <ResetMembershipButton />
            <CreateUserButton />
          </div>
        )}
      </header>

      {/* Table Container */}
      <div className="border border-white/10 flex flex-col">
        {/* Table Toolbar */}
        <div className="p-8 border-b border-white/10 bg-transparent flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="BUSCAR SOCIOS..." 
              className="w-full bg-white/5 border border-white/10 rounded-none py-3 pl-12 pr-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-red-600 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="text-xs font-black tracking-[0.2em] uppercase text-gray-500">
            TOTAL: <span className="text-white text-lg">{users.length}</span>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-white/5 text-gray-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-white/10">
              <tr>
                <th className="px-8 py-6">Miembro</th>
                <th className="px-8 py-6">Rol</th>
                <th className="px-8 py-6">Cuota Socio</th>
                <th className="px-8 py-6">Ingreso</th>
                <th className="px-8 py-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 flex items-center justify-center shrink-0 border border-white/10 ${
                        user.role === 'ADMIN' 
                          ? 'bg-red-600/10 text-red-500' 
                          : user.role === 'VOCAL'
                            ? 'bg-orange-500/10 text-orange-500'
                            : user.role === 'ALUMNI'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : user.role === 'GUEST'
                                ? 'bg-gray-500/10 text-gray-400'
                                : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {user.role === 'ADMIN' || user.role === 'VOCAL' ? <Shield className="w-6 h-6" strokeWidth={1.5} /> : <User className="w-6 h-6" strokeWidth={1.5} />}
                      </div>
                      <div>
                        <div className="font-black text-white uppercase tracking-widest text-xs">{user.name || 'SIN NOMBRE'}</div>
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2 items-start">
                      <span className={`inline-flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border ${
                        user.role === 'ADMIN' 
                          ? 'bg-red-600/10 text-red-500 border-red-600/30' 
                          : user.role === 'VOCAL'
                            ? 'bg-orange-500/10 text-orange-500 border-orange-500/30'
                            : user.role === 'ALUMNI'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                              : user.role === 'GUEST'
                                ? 'bg-transparent text-gray-500 border-white/10'
                                : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                      }`}>
                        {user.role === 'ADMIN' ? 'ADMINISTRADOR' : user.role === 'VOCAL' ? 'VOCAL' : user.role === 'ALUMNI' ? 'ALUMNI' : user.role === 'GUEST' ? 'INVITADO (PDTE)' : 'SOCIO'}
                      </span>
                      {user.role === 'VOCAL' && user.vocalia && (
                        <span className="text-[10px] uppercase font-black text-orange-500/70 tracking-widest">
                          VOCALÍA: {user.vocalia}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {user.membershipPaymentStatus === 'PAID' || user.membershipPaymentStatus === 'PAID_CARD' || user.membershipPaymentStatus === 'PAID_CASH' ? (
                      <span className="inline-flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 border border-emerald-500/30 bg-emerald-500/5">
                        PAGADA
                      </span>
                    ) : user.membershipPaymentStatus === 'PENDING_CASH' ? (
                      <span className="inline-flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 border border-orange-500/30 bg-orange-500/5">
                        Efectivo Pdte
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 border border-red-500/30 bg-red-500/5">
                        NO PAGADA
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', { 
                      year: 'numeric', month: 'short', day: 'numeric' 
                    })}
                  </td>
                  <td className="px-8 py-6 align-middle text-right">
                    <UserActions 
                      user={user} 
                      isSelf={session?.userId === user.id} 
                    />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-gray-500 font-black uppercase tracking-[0.2em] text-xs">
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
