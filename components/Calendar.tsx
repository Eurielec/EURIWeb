'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import DayModal from './DayModal';
import EventModal from './EventModal';

export type EventData = {
  id: string;
  title: string;
  date: Date;
  endDate?: Date | null;
  type: string;
  color: string | null;
};

export default function InteractiveCalendar({ 
  events,
  allowRSVP = false,
  userAttendances = []
}: { 
  events: EventData[];
  allowRSVP?: boolean;
  userAttendances?: string[];
}) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Inicializar la fecha solo en el cliente para evitar mismatch de hidratación
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  if (!currentDate) {
    return (
      <div className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 border border-white/5 bg-white/1"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
    
    const dayEvents = events.filter(e => {
      const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const eStart = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate());
      const eEnd = e.endDate ? new Date(e.endDate.getFullYear(), e.endDate.getMonth(), e.endDate.getDate()) : eStart;
      return currentDayDate >= eStart && currentDayDate <= eEnd;
    });

    days.push(
      <div 
        key={`day-${day}`} 
        onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 12, 0, 0))}
        className={`relative h-24 sm:h-32 border border-white/5 p-2 transition-all hover:bg-white/5 cursor-pointer group overflow-y-auto custom-scrollbar ${isToday ? 'bg-red-600/10' : 'bg-black/20'}`}
      >
        <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${isToday ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' : 'text-gray-400 group-hover:text-white'}`}>
          {day}
        </span>
        
        <div className="flex flex-col gap-1.5">
          {dayEvents.map(event => {
             const isAttending = userAttendances.includes(event.id);
             const isRsvpEligible = allowRSVP && (event.type === 'ASSOCIATION' || event.type === 'WORKSHOP');
             
             const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
             const eStart = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate());
             const eEnd = event.endDate ? new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate()) : eStart;

             const isFirstDay = currentDayDate.getTime() === eStart.getTime();
             const isLastDay = currentDayDate.getTime() === eEnd.getTime();
             const isMultiDay = eStart.getTime() !== eEnd.getTime();

             // Define shape and borders for continuity
             let spanClasses = 'rounded-md border';
             let wrapperClasses = '';
             
             if (isMultiDay) {
               if (isFirstDay) {
                 spanClasses = 'rounded-l-md rounded-r-none border-r-0';
                 wrapperClasses = '-mr-2.5 z-10 relative';
               } else if (isLastDay) {
                 spanClasses = 'rounded-r-md rounded-l-none border-l-0';
                 wrapperClasses = '-ml-2.5 z-10 relative';
               } else {
                 spanClasses = 'rounded-none border-l-0 border-r-0';
                 wrapperClasses = '-mx-2.5 z-10 relative';
               }
             }

             let cssColors = 'bg-white/10 text-white border-white/10';
             if (event.color?.includes('red') || event.type === 'ASSOCIATION') cssColors = 'bg-red-600/20 text-red-300 border-red-600/30';
             if (event.type === 'WORKSHOP') cssColors = 'bg-white/15 text-white border-white/20';
             if (event.color?.includes('emerald') || event.color?.includes('green')) cssColors = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
             
             // Decidir cuándo mostrar el texto (primer día, inicio de mes, o lunes)
             const showText = isFirstDay || day === 1 || currentDayDate.getDay() === 1;

             return (
               <div key={event.id} className={wrapperClasses}>
                 <div 
                   onClick={(e) => { e.stopPropagation(); setSelectedEventId(event.id); }}
                   className={`text-[10px] sm:text-xs px-2 py-1 font-medium flex justify-between items-center group/event transition-all select-none cursor-pointer hover:brightness-125 ${cssColors} ${spanClasses}`} 
                   title={event.title}
                 >
                    <span className={`truncate w-full ${!showText ? 'opacity-0' : ''}`}>{event.title}</span>
                    {isRsvpEligible && isAttending && showText && (
                      <div className="bg-green-500 text-white rounded-full p-0.5 shadow-sm transform scale-110 ml-1 shrink-0">
                        <Check className="w-2.5 h-2.5 shrink-0" />
                      </div>
                    )}
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    );
  }

  const totalCells = days.length;
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) {
    days.push(<div key={`end-empty-${i}`} className="h-24 sm:h-32 border border-white/5 bg-white/1"></div>);
  }

  return (
    <div className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8">
       <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-black text-red-600 uppercase tracking-tighter">
             {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
             <button onClick={prevMonth} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white shadow-sm">
                <ChevronLeft className="w-6 h-6" />
             </button>
             <button onClick={nextMonth} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white shadow-sm">
                <ChevronRight className="w-6 h-6" />
             </button>
          </div>
       </div>

       <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden shadow-inner">
          {dayNames.map(day => (
             <div key={day} className="bg-black/60 p-3 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">
                {day}
             </div>
          ))}
          {days}
       </div>

       {selectedDate && (
         <DayModal 
           date={selectedDate} 
           events={events.filter(e => {
             const currentDayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
             const eStart = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate());
             const eEnd = e.endDate ? new Date(e.endDate.getFullYear(), e.endDate.getMonth(), e.endDate.getDate()) : eStart;
             return currentDayDate >= eStart && currentDayDate <= eEnd;
           })}
           onClose={() => setSelectedDate(null)}
           onSelectEvent={(id) => { setSelectedDate(null); setSelectedEventId(id); }}
         />
       )}

       {selectedEventId && (
         <EventModal 
           eventId={selectedEventId}
           isUserAttending={userAttendances.includes(selectedEventId)}
           allowRSVP={allowRSVP}
           onClose={() => setSelectedEventId(null)}
           onRSVPToggled={() => {}} 
         />
       )}
    </div>
  );
}
