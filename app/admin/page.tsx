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
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <header className="border-b border-white/10 pb-10">
        <h1 className="text-5xl md:text-7xl font-black text-red-600 uppercase tracking-tighter italic leading-none">
          {isAdmin ? t.admin.dashboard.adminTitle : t.admin.dashboard.vocalTitle}
        </h1>
        <p className="text-gray-400 mt-4 text-sm font-black uppercase tracking-widest">
          {isAdmin 
            ? t.admin.dashboard.adminDesc 
            : t.admin.dashboard.vocalDesc}
        </p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isAdmin ? (
          <>
            <div className="p-8 border border-white/10 hover:border-red-600/50 hover:bg-white/5 transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em]">{t.admin.dashboard.totalUsers}</p>
                  <h3 className="text-6xl font-black text-white mt-4 group-hover:text-red-600 transition-colors leading-none">{totalUsers}</h3>
                </div>
                <Users className="w-8 h-8 text-gray-500 group-hover:text-red-600 transition-colors" strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="p-8 border border-white/10 hover:border-red-600/50 hover:bg-white/5 transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em]">{t.admin.dashboard.admins}</p>
                  <h3 className="text-6xl font-black text-white mt-4 group-hover:text-red-600 transition-colors leading-none">{totalAdmins}</h3>
                </div>
                <ShieldCheck className="w-8 h-8 text-gray-500 group-hover:text-red-600 transition-colors" strokeWidth={1.5} />
              </div>
            </div>
          </>
        ) : (
          <>
             <Link href="/admin/projects" className="p-8 border border-white/10 hover:border-red-600/50 hover:bg-white/5 transition-all duration-300 group block">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em]">{t.admin.dashboard.activeProjects}</p>
                  <h3 className="text-6xl font-black text-white mt-4 group-hover:text-red-600 transition-colors leading-none">{totalProjects}</h3>
                </div>
                <Folder className="w-8 h-8 text-gray-500 group-hover:text-red-600 transition-colors" strokeWidth={1.5} />
              </div>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">
                <Plus className="w-4 h-4" strokeWidth={2} /> {t.admin.dashboard.create}
              </div>
            </Link>

            <Link href="/admin/events" className="p-8 border border-white/10 hover:border-red-600/50 hover:bg-white/5 transition-all duration-300 group block">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em]">{t.admin.dashboard.manageEvents}</p>
                  <h3 className="text-2xl font-black text-white mt-4 group-hover:text-red-600 transition-colors uppercase tracking-tight">{t.admin.dashboard.organize}</h3>
                </div>
                <Activity className="w-8 h-8 text-gray-500 group-hover:text-red-600 transition-colors" strokeWidth={1.5} />
              </div>
            </Link>
          </>
        )}
        
        <div className="p-8 border border-white/10 hover:border-green-500/50 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em]">{t.admin.dashboard.systemStatus}</p>
              <h3 className="text-3xl font-black text-green-500 mt-4 flex items-center gap-4 uppercase tracking-tighter italic">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-sm h-4 w-4 bg-green-500"></span>
                </span>
                {t.admin.dashboard.operational}
              </h3>
            </div>
            <Activity className="w-8 h-8 text-gray-500 group-hover:text-green-500 transition-colors" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table (Sólo para Admin) */}
      {isAdmin && (
        <div className="border border-white/10 mt-12">
          <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{t.admin.dashboard.recentUsers}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead className="text-xs text-gray-500 uppercase font-black tracking-[0.2em] border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-8 py-6">{t.admin.dashboard.tableEmail}</th>
                  <th className="px-8 py-6 text-center">{t.admin.dashboard.tableAccess}</th>
                  <th className="px-8 py-6 text-right">{t.admin.dashboard.tableDate}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6 font-bold text-white italic flex items-center gap-6">
                      <div className="w-10 h-10 overflow-hidden bg-red-600 flex items-center justify-center shrink-0">
                        {u.image ? (
                          <img src={u.image} alt={u.name || 'Perfil'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-black font-black text-sm">{u.name ? u.name[0].toUpperCase() : 'E'}</span>
                        )}
                      </div>
                      {u.email}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-2 text-[10px] font-black tracking-[0.2em] uppercase border ${
                        u.role === 'ADMIN' ? 'bg-red-600/10 text-red-600 border-red-600/30' : 'bg-transparent text-gray-400 border-white/10'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-gray-500 font-bold uppercase tracking-widest text-xs">{new Date(u.createdAt).toLocaleDateString('es-ES')}</td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-10 text-center text-gray-500 uppercase tracking-widest font-black text-xs">{t.admin.dashboard.noUsers}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista simplificada para Vocales si no son Admin */}
      {!isAdmin && (
        <div className="border border-white/10 p-12 flex flex-col items-center justify-center text-center space-y-6">
          <ShieldCheck className="w-12 h-12 text-red-500" strokeWidth={1.5} />
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t.admin.dashboard.vocalPanelActive}</h2>
          <p className="text-gray-400 max-w-md font-medium">
            {t.admin.dashboard.vocalPanelDesc}
          </p>
        </div>
      )}
    </div>
  );
}
