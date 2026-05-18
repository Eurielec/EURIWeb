'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCircle, LogOut, Calendar as CalendarIcon, Folder, ShoppingBag, Crown } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';

export default function Sidebar({ session }: { session: { userId: string; role: string; vocalia?: string | null } | null }) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Mi Perfil', href: '/perfil', icon: UserCircle },
    { name: 'Usuarios', href: '/admin/users', icon: Users, adminOnly: true },
    { name: 'Junta', href: '/admin/junta', icon: Crown, adminOnly: true },
    { name: 'Eventos', href: '/admin/events', icon: CalendarIcon },
    { name: 'Ranking, IMW y CP', href: '/admin/ranking', icon: Crown, adminOnly: true },
    { name: 'Proyectos', href: '/admin/projects', icon: Folder },
    { name: 'Asambleas (Votaciones)', href: '/admin/votaciones', icon: Folder, adminOnly: true },
    { name: 'Archivo', href: '/admin/archivo', icon: Folder, adminOnly: true },
    { name: 'Tienda', href: '/admin/tienda', icon: ShoppingBag, restricted: true },
  ].filter(link => {
    if (link.adminOnly) return session?.role === 'ADMIN';
    if (link.name === 'Tienda') {
      return session?.role === 'ADMIN' || (session?.role === 'VOCAL' && session?.vocalia === 'sudaderas');
    }
    return true;
  });

  return (
    <aside className="w-full md:w-64 bg-neutral-900 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-row md:flex-col shrink-0 relative z-20 font-sans items-center md:items-start justify-between md:justify-start gap-4">
      <div className="md:mb-10 shrink-0">
        <div className="text-xl md:text-2xl font-black text-red-600 uppercase tracking-tighter italic truncate max-w-full">
          Eurielec
        </div>
        <p className="hidden md:block text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Control Panel</p>
      </div>
      
      <nav className="flex-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all font-black text-[10px] md:text-xs uppercase tracking-widest shrink-0 ${
                isActive 
                  ? 'bg-red-600/10 text-red-600 ring-1 ring-red-600/20' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-500/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
              <span className="hidden sm:inline-block">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer Profile - Hidden on very small screens to save space */}
      <div className="hidden sm:flex md:flex-col md:mt-auto pt-4 md:pt-6 md:border-t border-white/10 items-center md:items-stretch gap-4">
        <div className="hidden md:flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-white truncate uppercase tracking-tight">{session?.userId}</p>
            <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">{session?.role}</p>
          </div>
        </div>
        
        <form action={logoutAction}>
          <button type="submit" className="flex items-center justify-center gap-2 p-2.5 md:w-full md:py-2.5 md:px-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-medium border border-red-500/20 text-xs">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
