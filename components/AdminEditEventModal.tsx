'use client';

import { useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { Edit2, X, Trash2, Calendar, MapPin, Users, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { getEventDetailsAction, updateEventAction, removeAttendeeAction, deleteEventAction, confirmCashPaymentAction } from '@/app/actions/events';
import { DownloadEventSummaryBtn } from './DownloadEventSummaryBtn';

export function AdminEditEventModal({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [eventData, setEventData] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'edit' | 'attendees'>('edit');
  const [isPaidMode, setIsPaidMode] = useState(false);
  const [isOpenEvent, setIsOpenEvent] = useState(false);

  const openModal = async () => {
    setIsOpen(true);
    const data = await getEventDetailsAction(eventId);
    if (data) {
      setEventData(data);
      setIsPaidMode(!!(data.price && data.price > 0));
      setIsOpenEvent(!!data.isOpenEvent);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setEventData(null), 300);
  };

  const handleUpdate = async (formData: FormData) => {
    if (isOpenEvent) {
      formData.set('isOpenEvent', 'true');
      formData.delete('price');
    } else if (!isPaidMode) {
      formData.delete('price');
      formData.set('price', '0');
    }
    startTransition(async () => {
      await updateEventAction(eventId, formData);
      closeModal();
    });
  };

  const handleRemoveAttendee = async (userId: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar a este usuario del evento?')) return;
    startTransition(async () => {
      await removeAttendeeAction(eventId, userId);
      const data = await getEventDetailsAction(eventId);
      setEventData(data);
    });
  };

  const handleConfirmCashPayment = async (userId: string) => {
    if (!window.confirm('¿Confirmar que este usuario ha pagado en efectivo?')) return;
    startTransition(async () => {
      await confirmCashPaymentAction(eventId, userId);
      const data = await getEventDetailsAction(eventId);
      setEventData(data);
    });
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('¿ELIMINAR PERMANENTEMENTE ESTE EVENTO?')) return;
    startTransition(async () => {
      await deleteEventAction(eventId);
      closeModal();
    });
  };

  const formatForInput = (dateInput: any) => {
    if (!dateInput) return '';
    try {
      const d = new Date(dateInput);
      const tzOffset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  return (
    <>
      <button 
        onClick={openModal} 
        className="p-3 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all flex items-center justify-center cursor-pointer border border-red-600/10"
        title="Editar Evento"
      >
        <Edit2 className="w-5 h-5" />
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-white/5 rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-10 border-b border-white/5 bg-black/40 shrink-0">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Gestión <span className="text-red-600">Evento</span></h2>
                  <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Nivel de Acceso: Administrativo</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-4 text-gray-600 hover:text-white hover:bg-red-600 rounded-2xl transition-all">
                <X className="w-7 h-7" />
              </button>
            </div>

            {!eventData ? (
              <div className="p-24 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Sincronizando Base de Datos...</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex border-b border-white/5 px-10 bg-black/20">
                  <button 
                    onClick={() => setActiveTab('edit')} 
                    className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-3 ${activeTab === 'edit' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-white'}`}
                  >
                    Detalles Técnicos
                  </button>
                  <button 
                    onClick={() => setActiveTab('attendees')} 
                    className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-3 ${activeTab === 'attendees' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-white'}`}
                  >
                    Personal Inscrito
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${activeTab === 'attendees' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-600'}`}>
                      {eventData.attendances?.length || 0}
                    </span>
                  </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1 p-10 bg-neutral-900/40">
                  {activeTab === 'edit' && (
                    <form action={handleUpdate} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                          <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Denominación del Evento</label>
                            <input type="text" name="title" defaultValue={eventData.title} required className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Inicio</label>
                              <input type="datetime-local" name="date" defaultValue={formatForInput(eventData.date)} required className="w-full bg-black/60 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Fin {isOpenEvent ? '(Req.)' : '(Opc.)'}</label>
                              <input type="datetime-local" name="endDate" defaultValue={formatForInput(eventData.endDate)} required={isOpenEvent} className="w-full bg-black/60 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                            </div>
                            <div>
                               <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Clasificación</label>
                               <select name="type" defaultValue={eventData.type} className="w-full bg-black/60 border border-white/5 rounded-2xl py-3 px-4 text-[10px] font-black uppercase text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                                <option value="ASSOCIATION">Asociación</option>
                                <option value="EXAM">Examen</option>
                                <option value="HOLIDAY">Festivo</option>
                                <option value="WORKSHOP">Workshop</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Identidad Visual</label>
                              <select name="color" defaultValue={eventData.color || 'bg-red-600'} className="w-full bg-black/60 border border-white/5 rounded-2xl py-3 px-4 text-[10px] font-black uppercase text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                                <option value="bg-red-600">Corporativo (Rojo)</option>
                                <option value="bg-white">Blanco</option>
                                <option value="bg-neutral-800">Negro</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 ml-1">Deadline Inscripción</label>
                              <input type="datetime-local" name="registrationDeadline" defaultValue={formatForInput(eventData.registrationDeadline)} className="w-full bg-black/60 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                            </div>
                          </div>

                          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpenEvent(!isOpenEvent)}>
                              <div>
                                <p className="text-sm font-bold text-white mb-1">Evento Continuo / Abierto</p>
                                <p className="text-[10px] text-gray-500 font-medium">No requiere pago, dura varios días y el botón dirá "Me pasaré". Ideal para Hackathons.</p>
                              </div>
                              <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${isOpenEvent ? 'bg-red-600' : 'bg-neutral-800'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isOpenEvent ? 'translate-x-6' : 'translate-x-0'}`} />
                              </div>
                            </div>
                          </div>

                          {!isOpenEvent && (
                            <div>
                              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Modalidad de Acceso</label>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <button 
                                  type="button"
                                  onClick={() => setIsPaidMode(false)}
                                  className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${!isPaidMode ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-black/50 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
                                >
                                  Gratuito
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => setIsPaidMode(true)}
                                  className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${isPaidMode ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-black/50 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
                                >
                                  De Pago
                                </button>
                              </div>
                              {isPaidMode && (
                                <div className="relative animate-in slide-in-from-top-2 fade-in duration-200">
                                  <input type="number" step="0.01" min="0.01" name="price" defaultValue={eventData.price || ''} required className="w-full bg-black/60 border border-white/5 rounded-2xl py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm" placeholder="Precio (ej: 5.00)" />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">€</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-8">
                          <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-red-600" /> Coordenadas / Lugar
                            </label>
                            <input type="text" name="location" defaultValue={eventData.location || ''} placeholder="URL Google Maps o Aula" className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Información Complementaria</label>
                            <textarea name="description" rows={5} defaultValue={eventData.description || ''} className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder:text-gray-800 font-medium text-sm" placeholder="Detalles operativos..."></textarea>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 mt-10">
                         <button type="submit" disabled={isPending} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-600/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50">
                          Sincronizar Cambios
                        </button>
                      </div>
                    </form>
                  )}

                  {activeTab === 'attendees' && (
                    <div className="space-y-4">
                      {eventData.attendances?.length === 0 ? (
                        <div className="text-center py-20 bg-black/20 rounded-[2rem] border border-white/5 border-dashed">
                          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] italic">Sin registros de asistencia confirmados</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {eventData.attendances.map((att: any) => (
                            <div key={att.userId} className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-red-600/20 transition-all">
                              <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                                <div className="w-12 h-12 shrink-0 bg-red-600/10 text-red-600 rounded-xl flex items-center justify-center font-black text-sm border border-red-600/10">
                                  {att.user.name ? att.user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-black text-white text-xs uppercase tracking-tight truncate">{att.user.name || 'Incógnito'}</h4>
                                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest truncate">{att.user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {att.paymentMethod && (
                                  <div className="flex flex-col items-end mr-2">
                                    <span className="text-[9px] font-black uppercase text-gray-500 mb-0.5">{att.paymentMethod === 'CARD' ? 'Tarjeta' : 'Efectivo'}</span>
                                    {att.paymentStatus === 'PAID' ? (
                                      <span className="text-[10px] font-black uppercase tracking-widest text-green-500">PAGADO</span>
                                    ) : (
                                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">PENDIENTE</span>
                                    )}
                                  </div>
                                )}
                                {att.paymentMethod === 'CASH' && att.paymentStatus === 'PENDING' && (
                                  <button 
                                    onClick={() => handleConfirmCashPayment(att.userId)}
                                    disabled={isPending}
                                    className="p-2 text-gray-600 hover:text-green-500 hover:bg-green-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                    title="Confirmar Pago Manual"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleRemoveAttendee(att.userId)}
                                  disabled={isPending}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-600/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                  title="Expulsar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-10 border-t border-white/5 bg-black/40 flex justify-between gap-6 shrink-0 mt-auto">
                  <button 
                    onClick={handleDeleteEvent}
                    disabled={isPending}
                    type="button" 
                    className="flex text-[10px] items-center gap-3 px-8 py-3.5 bg-white/[0.02] text-gray-600 hover:text-red-600 hover:bg-red-600/10 rounded-2xl transition-all border border-white/5 font-black uppercase tracking-widest"
                  >
                    <Trash2 className="w-4 h-4" />
                    Destruir Registro
                  </button>
                  <div className="flex gap-4">
                    <DownloadEventSummaryBtn eventId={eventId} />
                    <button onClick={closeModal} className="px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white border border-transparent hover:border-white/5 bg-white/[0.02] transition-all">
                      Cerrar Panel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
