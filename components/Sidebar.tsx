'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCircle, LogOut, Calendar as CalendarIcon, Folder, ShoppingBag, Crown } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';
import { useLanguage } from '@/components/LanguageProvider';

export default function Sidebar({ session }: { session: { userId: string; role: string; vocalia?: string | null } | null }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { id: 'dashboard', name: t.admin.sidebar.dashboard, href: '/admin', icon: LayoutDashboard },
    { id: 'profile', name: t.admin.sidebar.profile, href: '/perfil', icon: UserCircle },
    { id: 'users', name: t.admin.sidebar.users, href: '/admin/users', icon: Users, adminOnly: true },
    { id: 'board', name: t.admin.sidebar.board, href: '/admin/junta', icon: Crown, adminOnly: true },
    { id: 'events', name: t.admin.sidebar.events, href: '/admin/events', icon: CalendarIcon },
    { id: 'ranking', name: t.admin.sidebar.ranking, href: '/admin/ranking', icon: Crown, adminOnly: true },
    { id: 'projects', name: t.admin.sidebar.projects, href: '/admin/projects', icon: Folder },
    { id: 'polls', name: t.admin.sidebar.polls, href: '/admin/votaciones', icon: Folder, adminOnly: true },
    { id: 'archive', name: t.admin.sidebar.archive, href: '/admin/archivo', icon: Folder, adminOnly: true },
    { id: 'shop', name: t.admin.sidebar.shop, href: '/admin/tienda', icon: ShoppingBag, restricted: true },
  ].filter(link => {
    if (link.adminOnly) return session?.role === 'ADMIN';
    if (link.id === 'shop') {
      return session?.role === 'ADMIN' || (session?.role === 'VOCAL' && session?.vocalia === 'sudaderas');
    }
    return true;
  });

  return (
    <aside className="w-full md:w-64 bg-black border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-row md:flex-col shrink-0 relative z-20 font-sans items-center md:items-start justify-between md:justify-start gap-4">
      <div className="md:mb-10 shrink-0">
        <div className="text-xl md:text-3xl font-black text-red-600 uppercase tracking-tighter italic truncate max-w-full">
          Eurielec
        </div>
        <p className="hidden md:block text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">{t.admin.sidebar.controlPanel}</p>
      </div>
      
      <nav className="flex-1 flex md:flex-col gap-1 w-full overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`flex items-center gap-2 md:gap-4 px-4 py-3 md:py-4 transition-colors font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shrink-0 border-l-2 ${
                isActive 
                  ? 'border-red-600 bg-red-600/5 text-red-600' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'
              }`}
            >
              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-red-600' : 'text-gray-500'}`} strokeWidth={1.5} />
              <span className="hidden sm:inline-block">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer Profile - Hidden on very small screens to save space */}
      <div className="hidden sm:flex md:flex-col md:mt-auto pt-6 md:border-t border-white/10 w-full gap-4">
        <div className="hidden md:flex items-center gap-4 mb-4 px-2">
          <div className="w-12 h-12 bg-red-600 flex items-center justify-center shrink-0">
            <UserCircle className="w-8 h-8 text-black" strokeWidth={1.5} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-white truncate uppercase tracking-tighter">{session?.userId}</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{session?.role}</p>
          </div>
        </div>
        
        <form action={logoutAction} className="w-full">
          <button type="submit" className="flex items-center justify-center gap-3 w-full py-4 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors font-black uppercase tracking-[0.2em] text-[10px]">
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden md:inline">{t.admin.sidebar.logout}</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
