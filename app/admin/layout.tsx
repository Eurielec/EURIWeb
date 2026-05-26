import { getUserSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();
  
  if (session) {
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    
    // Si no es un invitado ni un administrador, y le falta la talla de camiseta,redirigir
    // Excluimos a los administradores para evitar bucles de redirección o problemas de acceso al panel
    if (user && user.role !== 'GUEST' && user.role !== 'ADMIN' && !user.tShirtSize) {
      redirect('/preferencias-socio');
    }
  }

  return (
    <div className="panel-wrapper h-screen flex flex-col md:flex-row bg-black text-white font-sans overflow-hidden selection:bg-red-500/30 pt-16">
      <Sidebar session={session} />

      <main className="flex-1 overflow-y-auto w-full bg-black relative">
        {/* Glow Effects - Red Theme */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 blur-[120px] pointer-events-none" />
        
        <div className="p-6 sm:p-10 md:p-16 w-full max-w-[1600px] mx-auto relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
