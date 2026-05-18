'use client';

import React, { useMemo } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';

interface Member {
  university?: string | null;
  academicYear?: string | null;
  [key: string]: any;
}

export default function MemberStats({ members }: { members: Member[] }) {
  const stats = useMemo(() => {
    const unis: Record<string, number> = {};
    const courses: Record<string, number> = {};
    
    // Contamos solo lo que esté definido
    let totalUnis = 0;
    let totalCourses = 0;

    members.forEach(m => {
      if (m.university && m.university.trim() !== '') {
        unis[m.university] = (unis[m.university] || 0) + 1;
        totalUnis++;
      }
      if (m.academicYear && m.academicYear.trim() !== '') {
        courses[m.academicYear] = (courses[m.academicYear] || 0) + 1;
        totalCourses++;
      }
    });

    const sortedUnis = Object.entries(unis).sort((a, b) => b[1] - a[1]);
    const sortedCourses = Object.entries(courses).sort((a, b) => b[1] - a[1]);

    return { totalUnis, totalCourses, sortedUnis, sortedCourses };
  }, [members]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-20">
      {/* Escuelas UPM */}
      <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/20 shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight" style={{ color: '#fff' }}>
            Escuelas UPM
          </h3>
        </div>
        
        <div className="space-y-5">
          {stats.sortedUnis.length > 0 ? stats.sortedUnis.map(([uni, count]) => {
            const percentage = Math.round((count / stats.totalUnis) * 100);
            return (
              <div key={uni} className="group/item">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-white transition-colors">{uni}</span>
                  <span className="text-white/70 group-hover/item:text-purple-300 transition-colors">
                    {count} socio{count !== 1 ? 's' : ''} <span className="text-xs opacity-60">({percentage}%)</span>
                  </span>
                </div>
                <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all duration-1000 ease-out" 
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
              </div>
            );
          }) : (
            <div className="flex items-center justify-center p-8 border border-dashed border-white/10 rounded-2xl bg-black/20">
              <p className="text-white/50 text-sm">Aún no hay datos demográficos disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Cursos */}
      <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/20 shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight" style={{ color: '#fff' }}>
            Cursos Académicos
          </h3>
        </div>
        
        <div className="space-y-5">
          {stats.sortedCourses.length > 0 ? stats.sortedCourses.map(([course, count]) => {
            const percentage = Math.round((count / stats.totalCourses) * 100);
            return (
              <div key={course} className="group/item">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-white transition-colors">{course}</span>
                  <span className="text-white/70 group-hover/item:text-cyan-300 transition-colors">
                    {count} socio{count !== 1 ? 's' : ''} <span className="text-xs opacity-60">({percentage}%)</span>
                  </span>
                </div>
                <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all duration-1000 ease-out" 
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
              </div>
            );
          }) : (
            <div className="flex items-center justify-center p-8 border border-dashed border-white/10 rounded-2xl bg-black/20">
              <p className="text-white/50 text-sm">Aún no hay datos demográficos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
