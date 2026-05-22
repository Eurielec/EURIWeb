'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';
import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Copy, Send, Mail, Phone, Handshake, Trophy, Globe, User2, Building2 } from 'lucide-react';
import { getContactPersons, type ContactPersonData } from '@/app/actions/contacts';

type Step = 'who' | 'empresaGoal' | 'result';
type Selection = 'alumno' | 'empresa' | 'eestec' | 'normal' | 'inter' | 'colab' | 'patro' | null;

export default function ContactoPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('who');
  const [history, setHistory] = useState<Step[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [copied, setCopied] = useState(false);

  // Datos de contacto reales desde la BD
  const [contacts, setContacts] = useState<{
    secretario: ContactPersonData | null;
    cr: ContactPersonData | null;
    cp: ContactPersonData | null;
  }>({ secretario: null, cr: null, cp: null });

  useEffect(() => {
    getContactPersons().then(setContacts);
  }, []);

  const handleNext = (nextStep: Step, choice: Selection) => {
    setHistory([...history, step]);
    setStep(nextStep);
    setSelection(choice);
  };

  const handleBack = () => {
    const prev = history.pop();
    if (prev) {
      setStep(prev);
      setHistory([...history]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Contact person mapping — data from DB
  const getContactPerson = (): ContactPersonData | null => {
    if (selection === 'normal') return contacts.secretario;
    if (selection === 'colab' || selection === 'patro') return contacts.cr;
    if (selection === 'eestec') return contacts.cp;
    return null;
  };

  // Result matching
  const getResult = () => {
    const person = getContactPerson();
    // Si tenemos datos reales del usuario, usar su email; si no, fallback a los emails genéricos
    if (selection === 'normal') return { text: t.contact.results.upm, email: person?.email || 'contacto@eurielec.etsit.upm.es' };
    if (selection === 'inter') return { text: t.contact.results.eestec, email: 'relaciones.externas@eurielec.etsit.upm.es' };
    if (selection === 'eestec') return { text: t.contact.results.eestec, email: person?.email || 'madrid@eestec.org' };
    if (selection === 'colab') return { text: t.contact.results.colab, email: person?.email || 'cr@eurielec.etsit.upm.es' };
    if (selection === 'patro') return { text: t.contact.results.patro, email: person?.email || 'cr@eurielec.etsit.upm.es' };
    return { text: '', email: '' };
  };

  const currentResult = getResult();
  const contactPerson = getContactPerson();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--red)] relative overflow-hidden">
      {/* Decorative minimalism */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none overflow-hidden flex items-center justify-center">
         <span className="text-[30vw] font-black text-black leading-none uppercase tracking-tighter">CONTACT</span>
      </div>

      <div className="max-w-3xl w-full relative z-10">
        
        {/* Navigation / Progress */}
        <div className="absolute -top-20 left-0 flex items-center gap-4">
           {history.length > 0 && (
             <button 
               onClick={handleBack}
               className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
             >
               <ArrowLeft size={16} />
               {t.contact.back}
             </button>
           )}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: WHO */}
          {step === 'who' && (
            <motion.div
              key="who"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9]">
                {t.contact.steps.who.q}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <OptionButton 
                  icon={<User2 size={24} />} 
                  label={t.contact.steps.who.alumno} 
                  onClick={() => handleNext('result', 'normal')} 
                />
                <OptionButton 
                  icon={<Building2 size={24} />} 
                  label={t.contact.steps.who.empresa} 
                  onClick={() => handleNext('empresaGoal', 'empresa')} 
                />
                <OptionButton 
                  icon={<Globe size={24} />} 
                  label={t.contact.steps.who.eestec} 
                  onClick={() => handleNext('result', 'eestec')} 
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: EMPRESA GOAL */}
          {step === 'empresaGoal' && (
            <motion.div
              key="empresaGoal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9]">
                {t.contact.steps.empresaGoal.q}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OptionButton 
                  icon={<Handshake size={24} />} 
                  label={t.contact.steps.empresaGoal.colab} 
                  onClick={() => handleNext('result', 'colab')} 
                />
                <OptionButton 
                  icon={<Trophy size={24} />} 
                  label={t.contact.steps.empresaGoal.patro} 
                  onClick={() => handleNext('result', 'patro')} 
                />
              </div>
            </motion.div>
          )}

          {/* STEP: RESULT */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
               <h1 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tight">
                 {t.contact.title}
               </h1>

               {/* Contact Person Card — datos reales de la BD */}
               {contactPerson && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.15 }}
                   className="flex items-center gap-5 p-5 rounded-2xl border border-white/15 backdrop-blur-sm"
                   style={{ background: 'var(--surface-inv)' }}
                 >
                   {/* Avatar */}
                   <div
                     className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2"
                     style={{ borderColor: 'var(--red)' }}
                   >
                     <img
                       src={contactPerson.img || '/junta/member3.png'}
                       alt={contactPerson.name}
                       className="w-full h-full object-cover object-top"
                       style={{ filter: 'brightness(1.1)' }}
                     />
                   </div>

                   {/* Info */}
                   <div className="flex-1 min-w-0">
                     <p className="text-white font-black text-lg leading-none tracking-tight">
                       {contactPerson.name}
                     </p>
                     <p
                       className="text-xs font-bold uppercase tracking-widest mt-1"
                       style={{ color: 'rgba(232,22,27,0.8)' }}
                     >
                       {contactPerson.role}
                     </p>
                     {/* Teléfono real del usuario */}
                     {contactPerson.phone && (
                       <a
                         href={`tel:${contactPerson.phone}`}
                         className="flex items-center gap-2 mt-2 text-white/60 hover:text-white transition-colors text-sm"
                       >
                         <Phone size={13} className="shrink-0" />
                         <span className="font-bold">{contactPerson.phone}</span>
                       </a>
                     )}
                   </div>

                   {/* Direct mail + phone CTAs */}
                   <div className="flex flex-col gap-2 shrink-0">
                     <a
                       href={`mailto:${contactPerson.email}`}
                       className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                       style={{ background: 'var(--red)' }}
                       title={`Email ${contactPerson.name}`}
                     >
                       <Mail size={16} className="text-white" />
                     </a>
                     {contactPerson.phone && (
                       <a
                         href={`tel:${contactPerson.phone}`}
                         className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 bg-white/10 hover:bg-white/20"
                         title={`Llamar a ${contactPerson.name}`}
                       >
                         <Phone size={16} className="text-white" />
                       </a>
                     )}
                   </div>
                 </motion.div>
               )}

               {/* Main result card — con email real del usuario */}
               <div className="p-10 rounded-[3rem] bg-black text-white space-y-8 shadow-2xl relative overflow-hidden border border-white/5">
                 {/* Glossy accent */}
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
                 
                 <p 
                   className="text-xl md:text-2xl italic border-l-4 pl-6 uppercase tracking-tight font-black"
                   style={{ color: 'var(--text-brand)', borderColor: 'var(--text-brand)' }}
                 >
                   &quot;{currentResult.text}&quot;
                 </p>

                 <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <div className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                         <Mail size={20} style={{ color: 'var(--text-brand)' }} />
                         <span 
                           className="text-sm font-black truncate max-w-[200px] uppercase tracking-wider"
                           style={{ color: 'var(--text-brand)' }}
                         >
                           {currentResult.email}
                         </span>
                       </div>
                       <button 
                        onClick={() => copyToClipboard(currentResult.email)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title={t.contact.copy}
                       >
                         {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-white/40 group-hover:text-white" />}
                       </button>
                    </div>

                    <a 
                      href={`mailto:${currentResult.email}`}
                      className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[var(--red)] hover:text-white transition-all shadow-lg"
                    >
                      <Send size={16} className="shrink-0" />
                      ENVIAR EMAIL
                    </a>
                 </div>
               </div>

               <button 
                onClick={() => { setStep('who'); setHistory([]); setSelection(null); }}
                className="text-white/40 hover:text-white transition-colors text-[0.6rem] font-black uppercase tracking-[0.3em] mx-auto block"
               >
                 Reiniciar proceso
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer minimal info */}
      <div className="absolute bottom-10 left-10 hidden md:block">
         <p className="text-white/10 text-[0.6rem] font-black uppercase tracking-widest">
           Eurielec ETSIT Madrid &middot; 2026 &copy;
         </p>
      </div>
    </main>
  );
}

function OptionButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -5, backgroundColor: 'var(--surface-inv)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-10 rounded-4xl bg-[var(--surface-inv)] border-2 border-white/10 flex flex-col items-center justify-center gap-6 text-white transition-all group"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[var(--red)] transition-colors">
        {icon}
      </div>
      <span className="text-sm font-black uppercase tracking-widest text-center group-hover:text-white transition-colors">
        {label}
      </span>
    </motion.button>
  );
}