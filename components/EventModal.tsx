'use client';

import { useEffect, useState, useTransition, useRef, useCallback } from 'react';
import { X, User, Check, Users, AlignLeft, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { getEventDetailsAction, toggleRSVPAction } from '@/app/actions/events';
import { createEventSumUpCheckout, verifyEventPayment } from '@/app/actions/checkout';

type EventDetails = {
  id: string; 
  title: string; 
  description: string | null; 
  date: Date;
  endDate: Date | null;
  type: string; 
  color: string | null;
  location: string | null;
  fee: string | null;
  price: number | null;
  isOpenEvent: boolean;
  registrationDeadline: Date | null;
  attendances: { user: { name: string | null, email: string, image: string | null, role: string } }[];
  userAttendance: { paymentStatus: string | null, paymentMethod: string | null } | null;
};

export default function EventModal({
  eventId,
  isUserAttending,
  allowRSVP,
  onClose,
  onRSVPToggled
}: {
  eventId: string;
  isUserAttending: boolean;
  allowRSVP: boolean;
  onClose: () => void;
  onRSVPToggled: () => void;
}) {
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH'>('CARD');
  const [paymentState, setPaymentState] = useState<'idle' | 'loading' | 'widget' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);

  const loadSumUpScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).SumUpCard) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar la pasarela. Por favor, desactiva los bloqueadores de anuncios e inténtalo de nuevo.'));
      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getEventDetailsAction(eventId);
        if (mounted && data) setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [eventId]);

  const handleRsvp = async () => {
    if (!allowRSVP || !event) return;

    if (!isUserAttending && event.price && event.price > 0) {
      if (paymentMethod === 'CARD') {
        setPaymentState('loading');
        setPaymentError('');
        const result = await createEventSumUpCheckout(eventId);
        if (!result.success || !result.checkoutId) {
           setPaymentError(result.error || 'Error al crear el pago');
           setPaymentState('error');
           setTimeout(() => setPaymentState('idle'), 4000);
           return;
        }

        try {
          await loadSumUpScript();
        } catch (err: any) {
          setPaymentError(err.message || 'Error al cargar el sistema de pago');
          setPaymentState('error');
          setTimeout(() => setPaymentState('idle'), 4000);
          return;
        }
        setPaymentState('widget');

        setTimeout(() => {
          if (widgetRef.current && (window as unknown as Record<string, unknown>).SumUpCard) {
            widgetRef.current.innerHTML = '';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((window as any).SumUpCard as any).mount({
              id: 'sumup-event-widget',
              checkoutId: result.checkoutId,
              onResponse: async (type: string, body: { message?: string }) => {
                if (type === 'success') {
                  setPaymentState('success');
                  if (result.reference) {
                    await verifyEventPayment(result.reference);
                  }
                  setTimeout(() => {
                     setPaymentState('idle');
                     onRSVPToggled();
                     getEventDetailsAction(eventId).then(d => d && setEvent(d));
                  }, 2000);
                } else if (type === 'error') {
                  setPaymentError(body?.message || 'Error en el pago');
                  setPaymentState('error');
                  setTimeout(() => setPaymentState('idle'), 4000);
                }
              }
            });
          } else {
             // Si pasados 100ms no encuentra el ref, reintentamos un poco más tarde (como fallback)
             setTimeout(() => {
                if (widgetRef.current && (window as any).SumUpCard) {
                   widgetRef.current.innerHTML = '';
                   ((window as any).SumUpCard as any).mount({
                      id: 'sumup-event-widget',
                      checkoutId: result.checkoutId,
                      onResponse: async (type: string, body: any) => {
                         if (type === 'success') {
                            setPaymentState('success');
                            if (result.reference) {
                              await verifyEventPayment(result.reference);
                            }
                            setTimeout(() => { setPaymentState('idle'); onRSVPToggled(); }, 2000);
                         } else {
                            setPaymentState('error');
                            setTimeout(() => setPaymentState('idle'), 4000);
                         }
                      }
                   });
                } else {
                   setPaymentError('Error al iniciar la pasarela');
                   setPaymentState('error');
                   setTimeout(() => setPaymentState('idle'), 4000);
                }
             }, 1000);
          }
        }, 100);
        return;
      } else {
        // CASH
        startTransition(async () => {
          const result = await toggleRSVPAction(eventId, 'CASH');
          if (result?.error) { alert(result.error); return; }
          onRSVPToggled();
          const newData = await getEventDetailsAction(eventId);
          if (newData) setEvent(newData);
        });
        return;
      }
    }

    const isDeadlinePassed = event.registrationDeadline && new Date() > new Date(event.registrationDeadline);
    if (isDeadlinePassed && !isUserAttending) return; // Permitir desapuntarse si ya estaba? El usuario dijo "para poder apuntarnos"

    startTransition(async () => {
      const result = await toggleRSVPAction(eventId);
      if (result?.error) { alert(result.error); return; }
      onRSVPToggled();
      const newData = await getEventDetailsAction(eventId);
      if (newData) setEvent(newData);
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return null;

  const isRsvpEligible = allowRSVP && (event.type === 'ASSOCIATION' || event.type === 'WORKSHOP');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b border-white/10 flex justify-between items-start ${event.color ? event.color.replace('bg-', 'bg-').replace('600/10', '600/20') : 'bg-white/5'}`}>
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded text-white/70">
                {event.type}
              </span>
              {event.isOpenEvent && (
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-400">
                  Abierto
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {event.title}
            </h3>
            <p className="text-white/60 text-sm">
              {new Date(event.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' })}
              {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' })}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {event.description && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <AlignLeft className="w-4 h-4" /> Descripción
              </h4>
              <div className="text-gray-300 leading-relaxed bg-white/5 border border-white/5 rounded-xl p-4">
                {event.description}
              </div>
            </div>
          )}

          {(event.location || event.fee) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.location && (
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-start gap-3">
                  <div className="bg-red-600/20 text-red-400 p-2 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase">Ubicación</h5>
                    <a href={event.location.startsWith('http') ? event.location : `https://maps.google.com/?q=${event.location}`} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium mt-0.5 line-clamp-2">
                      {event.location}
                    </a>
                  </div>
                </div>
              )}
              {event.fee && (
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 p-2 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase">Entrada</h5>
                    <p className="text-white text-sm font-medium mt-0.5">{event.fee}</p>
                  </div>
                </div>
              )}
              {event.registrationDeadline && (
                <div className={`col-span-1 sm:col-span-2 p-4 rounded-xl flex items-start gap-3 border ${new Date() > new Date(event.registrationDeadline) ? 'bg-red-500/10 border-red-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                  <div className={`${new Date() > new Date(event.registrationDeadline) ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'} p-2 rounded-lg shrink-0`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase">Deadline de Inscripción</h5>
                    <p className={`${new Date() > new Date(event.registrationDeadline) ? 'text-red-400' : 'text-white'} text-sm font-medium mt-0.5`}>
                      {new Date() > new Date(event.registrationDeadline) 
                        ? 'Plazo finalizado' 
                        : `Hasta el ${new Date(event.registrationDeadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}h`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              <Users className="w-4 h-4" /> Asistentes ({event.attendances.length})
            </h4>
            
            {event.attendances.length === 0 ? (
              <p className="text-gray-500 italic px-2">Sé el primero en apuntarte a este evento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.attendances.map((att, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center shrink-0">
                       <User className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-white truncate">{att.user.name || 'Usuario'}</p>
                      {att.user.role === 'ADMIN' && (
                        <span className="text-[10px] text-red-600 font-black">ADMIN</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isRsvpEligible ? (
          <div className="p-4 border-t border-white/10 bg-black/20 mt-auto">
            {event.price && event.price > 0 && !isUserAttending && paymentState !== 'widget' && paymentState !== 'success' && (
              <div className="mb-4 space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase">Método de Pago ({event.price.toFixed(2)}€)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setPaymentMethod('CARD')} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 border ${paymentMethod === 'CARD' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                    <CreditCard className="w-4 h-4" /> Tarjeta
                  </button>
                  <button onClick={() => setPaymentMethod('CASH')} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 border ${paymentMethod === 'CASH' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                    Efectivo
                  </button>
                </div>
              </div>
            )}

            {paymentState === 'widget' && (
               <div className="bg-white rounded-2xl p-2 mb-4 animate-in zoom-in-95 duration-300">
                 <div id="sumup-event-widget" ref={widgetRef} />
               </div>
            )}

            {paymentState === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl mb-4 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={16} /> {paymentError}
              </div>
            )}

            {paymentState === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-xl mb-4 flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                <Check size={16} /> Pago realizado con éxito
              </div>
            )}

            {!(paymentState === 'widget' || paymentState === 'success') && (
              <button
                onClick={handleRsvp}
                disabled={isPending || paymentState === 'loading' || (event.registrationDeadline && new Date() > new Date(event.registrationDeadline) && !isUserAttending)}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isUserAttending ? 'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 group' : 'bg-red-600 hover:bg-red-700 border border-red-600 text-white shadow-lg shadow-red-600/20'} ${(isPending || paymentState === 'loading' || (event.registrationDeadline && new Date() > new Date(event.registrationDeadline) && !isUserAttending)) ? 'opacity-50 pointer-events-none grayscale' : ''}`}
              >
                {paymentState === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isUserAttending ? (
                  <>
                     <Check className="w-5 h-5 group-hover:hidden" />
                     <X className="w-5 h-5 hidden group-hover:block" />
                     <span className="group-hover:hidden flex items-center gap-2">
                       {event.isOpenEvent ? 'Me paso' : 'Apuntado'}
                       {event.userAttendance?.paymentStatus === 'PENDING' && (
                          <span className="text-[9px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Pago Pendiente</span>
                       )}
                       {event.userAttendance?.paymentStatus === 'PAID' && (
                          <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Pagado</span>
                       )}
                     </span>
                     <span className="hidden group-hover:inline">Desapuntarse</span>
                  </>
                ) : (
                  event.registrationDeadline && new Date() > new Date(event.registrationDeadline) 
                    ? 'Plazo Finalizado'
                    : (event.price && event.price > 0 && paymentMethod === 'CARD' ? 'Ir a Pagar' : (event.isOpenEvent ? '¡Voy a pasarme!' : '¡Apuntarme al Evento!'))
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 border-t border-white/10 bg-black/20 mt-auto">
            <a href="/login" className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10 text-white">
              Inicia sesión para apuntarte
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
