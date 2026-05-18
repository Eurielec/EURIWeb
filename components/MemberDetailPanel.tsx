'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Member {
  name: string;
  role: string;
  description: string;
  img: string;
}

interface Props {
  member: Member;
  onClose: () => void;
}

export default function MemberDetailPanel({ member, onClose }: Props) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
        />

        {/* Detail Glass Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="relative w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Close button - sleek and minimal */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all z-20"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col md:flex-row p-8 sm:p-12 items-center gap-8">
            {/* Visual focus on portrait */}
            <div className="relative shrink-0">
               <div className="absolute inset-0 bg-white/20 blur-2xl opacity-20 -z-10 rounded-full" />
               <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-[3px] border-white/20 shadow-2xl"
              />
            </div>

            {/* Info details with Helvetica alignment */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <span className="label text-white/40 text-[0.6rem] tracking-[0.2em]">{member.role}</span>
                <h3 className="text-3xl md:text-4xl font-black text-white leading-[0.95] tracking-tight">
                  {member.name.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h3>
              </div>
              
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto md:mx-0" />
              
              <p className="text-gray-200/80 font-light leading-relaxed text-balance text-sm md:text-base">
                {member.description}
              </p>
            </div>
          </div>
          
          {/* Subtle bottom decorative glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/5 blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

