import { prisma } from '@/lib/prisma';
import { Users, ShieldCheck, Activity, Folder, Plus } from 'lucide-react';
import { getUserSession } from '@/lib/auth';
import Link from 'next/link';
import { getDictionaryServer } from '@/lib/i18n-server';

export default async function AdminDashboard() {
  const t = await getDictionaryServer();
  const session = await getUserSession();
  const isAdmin = session?.role === 'ADMIN';

  // Métricas generales para Admin
  const totalUsers = isAdmin ? await prisma.user.count() : 0;
  const totalAdmins = isAdmin ? await prisma.user.count({ where: { role: 'ADMIN' } }) : 0;
  
  // Últimos registros solo para Admin
  const recentUsers = isAdmin ? await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, image: true, role: true, createdAt: true }
  }) : [];

  // Métricas de Proyectos (Para ambos)
  const totalProjects = await prisma.project.count();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <header>
        <h1 className="text-3xl md:text-5xl font-black text-red-600 uppercase tracking-tighter italic">
          {isAdmin ? t.admin.dashboard.adminTitle : t.admin.dashboard.vocalTitle}
        </h1>
        <p className="text-gray-400 mt-3 text-lg font-medium">
          {isAdmin 
            ? t.admin.dashboard.adminDesc 
            : t.admin.dashboard.vocalDesc}
        </p>
        <div className="w-20 h-1 bg-red-600 mt-6" />
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isAdmin ? (
          <>
            <div className="bg-neutral-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl hover:border-red-600/30 transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t.admin.dashboard.totalUsers}</p>
                  <h3 className="text-4xl font-black text-white mt-3 group-hover:text-red-600 transition-colors">{totalUsers}</h3>
                </div>
                <div className="p-3.5 bg-red-600/10 rounded-2xl group-hover:bg-red-600/20 transition-colors">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl hover:border-red-600/30 transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t.admin.dashboard.admins}</p>
                  <h3 className="text-4xl font-black text-white mt-3 group-hover:text-red-600 transition-colors">{totalAdmins}</h3>
                </div>
                <div className="p-3.5 bg-red-600/10 rounded-2xl group-hover:bg-red-600/20 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
             <Link href="/admin/projects" className="bg-neutral-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl hover:border-red-600/30 transition-all duration-300 group text-left">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t.admin.dashboard.activeProjects}</p>
                  <h3 className="text-4xl font-black text-white mt-3 group-hover:text-red-600 transition-colors">{totalProjects}</h3>
                </div>
                <div className="p-3.5 bg-red-600/10 rounded-2xl group-hover:bg-red-600/20 transition-colors">
                  <Folder className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-600/5 py-1.5 px-3 rounded-full w-fit">
                <Plus className="w-3 h-3" /> {t.admin.dashboard.create}
              </div>
            </Link>

            <Link href="/admin/events" className="bg-neutral-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl hover:border-red-600/30 transition-all duration-300 group text-left">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t.admin.dashboard.manageEvents}</p>
                  <h3 className="text-lg font-black text-white mt-4 group-hover:text-red-600 transition-colors uppercase tracking-tight">{t.admin.dashboard.organize}</h3>
                </div>
                <div className="p-3.5 bg-red-600/10 rounded-2xl group-hover:bg-red-600/20 transition-colors">
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </Link>
          </>
        )}
        
        <div className="bg-neutral-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl hover:border-red-600/30 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t.admin.dashboard.systemStatus}</p>
              <h3 className="text-2xl font-black text-green-500 mt-4 flex items-center gap-2.5 uppercase tracking-tight">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                {t.admin.dashboard.operational}
              </h3>
            </div>
            <div className="p-3.5 bg-red-600/10 rounded-2xl group-hover:bg-red-600/20 transition-colors">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table (Sólo para Admin) */}
      {isAdmin && (
        <div className="bg-neutral-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-black/20">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">{t.admin.dashboard.recentUsers}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-[10px] text-gray-500 uppercase font-black tracking-widest bg-black/40">
                <tr>
                  <th className="px-8 py-5">{t.admin.dashboard.tableEmail}</th>
                  <th className="px-8 py-5 text-center">{t.admin.dashboard.tableAccess}</th>
                  <th className="px-8 py-5 text-right">{t.admin.dashboard.tableDate}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 font-bold text-white italic flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-red-600 flex items-center justify-center shrink-0 border border-white/10">
                        {u.image ? (
                          <img src={u.image} alt={u.name || 'Perfil'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-black text-xs">{u.name ? u.name[0].toUpperCase() : 'E'}</span>
                        )}
                      </div>
                      {u.email}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                        u.role === 'ADMIN' ? 'bg-red-600/10 text-red-600 border-red-600/30' : 'bg-white/5 text-white/40 border-white/10'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right text-gray-500 font-medium">{new Date(u.createdAt).toLocaleDateString('es-ES')}</td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-10 text-center text-gray-500">{t.admin.dashboard.noUsers}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista simplificada para Vocales si no son Admin */}
      {!isAdmin && (
        <div className="grid grid-cols-1 gap-6">
           <div className="bg-neutral-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-red-500/10 rounded-full">
                <ShieldCheck className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t.admin.dashboard.vocalPanelActive}</h2>
              <p className="text-gray-400 max-w-md">
                {t.admin.dashboard.vocalPanelDesc}
              </p>
           </div>
        </div>
      )}
    </div>
  );
}
