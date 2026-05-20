import InteractiveCalendar from '@/components/Calendar';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDictionaryServer } from '@/lib/i18n-server';
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import MajorEvents from '@/components/MajorEvents';
import { verifyEventPayment } from '@/app/actions/checkout';

export default async function CalendarioPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const t = await getDictionaryServer();
  const session = await getUserSession();
  
  const paymentSuccess = searchParams?.payment === 'success';
  const orderRef = searchParams?.ref;

  if (paymentSuccess && orderRef) {
    await verifyEventPayment(orderRef);
  }

  if (session && session.role !== 'ADMIN') {
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (user && !user.province) redirect('/completar-perfil');
  }

  // Obtenemos los eventos públicos (mes actual y próximos)
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    where: {
      date: { gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1) }
    }
  });

  let userAttendances: string[] = [];
  if (session) {
    const attendances = await prisma.attendance.findMany({
      where: { 
        userId: session.userId,
        OR: [
          { paymentMethod: null }, // Eventos gratis
          { paymentMethod: 'CASH' }, // Efectivo (se asume intención de ir)
          { paymentMethod: 'CARD', paymentStatus: 'PAID' } // Solo si está pagado
        ]
      },
      select: { eventId: true }
    });
    userAttendances = attendances.map(a => a.eventId);
  }

  return (
    <main className="min-h-screen bg-[#08090a] text-white py-12 relative overflow-hidden font-sans">
      {/* Decorative background with red/black brand colors */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/2 left-0 w-[600px] h-[600px] bg-red-900/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      {paymentSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 bg-neutral-900 border border-green-500/30">
          <CheckCircle2 size={20} className="text-green-500" />
          <span className="text-white font-black text-sm uppercase tracking-widest">Pago del evento procesado con éxito</span>
        </div>
      )}

      {/* Decorative side elements for scrolling guidance - Positioned relative to main container to avoid clipping */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
          <header className="text-center space-y-4 pt-10">
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 label px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(232, 22, 27, 0.1)', color: '#E8161B', border: '1px solid rgba(232, 22, 27, 0.2)' }}
            >
              <CalendarIcon size={14} />
              PLANIFICACIÓN
            </span>
          </div>

          <h1 
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none"
            style={{ color: '#E8161B' }}
          >
            {t.calendar.title}
          </h1>
          <p 
            className="text-lg max-w-2xl mx-auto font-medium"
            style={{ color: '#E8161B', opacity: 0.8 }}
          >
            {t.calendar.subtitle}
          </p>

          <div className="w-16 h-1 mx-auto rounded-full bg-red-600/30" />
        </header>

        <section className="pb-10 border-b border-white/5">
          <InteractiveCalendar 
            events={events} 
            allowRSVP={!!session} 
            userAttendances={userAttendances} 
          />
        </section>
      </div>

      {/* New Major Events Section with Red Background - Moved OUTSIDE max-w container */}
      <section className="relative w-full bg-[#E8161B] overflow-hidden mt-24">
        {/* Decorative minimalist text behind hitos */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none select-none overflow-hidden">
            <span className="text-[20vw] font-black text-black leading-none uppercase tracking-tighter">HITOS</span>
        </div>
        
        <div className="max-w-6xl mx-auto py-32 px-6 sm:px-12 relative z-10">
          <MajorEvents />
        </div>
      </section>
    </main>
  );
}