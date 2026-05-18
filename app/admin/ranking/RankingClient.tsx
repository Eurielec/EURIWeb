'use client';

import { useState } from 'react';
import { Award, Calculator, Printer, Settings2, Download, Trash2, FileText, MoveVertical, Plus } from 'lucide-react';
import AdjustPointsModal from '@/components/AdjustPointsModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Reorder } from 'framer-motion';

type UserRank = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  points: number;
  image: string | null;
  imwPrice: number | null;
  imwPaymentStatus: string | null;
};

export default function RankingClient({ initialUsers, initialPriorityLists = [] }: { initialUsers: UserRank[], initialPriorityLists?: any[] }) {
  const [selectedUser, setSelectedUser] = useState<UserRank | null>(null);

  // IMW Calculator State
  const [targetAvg, setTargetAvg] = useState<number>(70);
  const [step, setStep] = useState<number>(5);
  const [maxDiff, setMaxDiff] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // CP Priority List State
  const [priorityLists, setPriorityLists] = useState(initialPriorityLists);
  const [cpEventName, setCpEventName] = useState('');
  const [cpComments, setCpComments] = useState('');
  const [cpSelectedMembers, setCpSelectedMembers] = useState<UserRank[]>([]);
  const [cpIsSaving, setCpIsSaving] = useState(false);

  const isIMWActive = initialUsers.some(u => u.imwPrice !== null);

  // Helper function to calculate IMW distribution
  const calculateIMW = () => {
    if (isIMWActive) {
      const activeUsers = initialUsers.filter(u => u.imwPrice !== null).sort((a, b) => b.points - a.points);
      const results = activeUsers.map(user => ({
        ...user,
        calculatedPrice: user.imwPrice as number
      }));
      const realSum = results.reduce((acc, curr) => acc + curr.calculatedPrice, 0);
      const realAverage = results.length > 0 ? Number((realSum / results.length).toFixed(2)) : 0;
      return { results, realAverage };
    }

    const sortedUsers = [...initialUsers].sort((a, b) => b.points - a.points);
    const N = sortedUsers.length;
    if (N === 0) return { results: [], realAverage: 0 };

    const K = Math.max(1, Math.floor(maxDiff / step) + 1); // Number of tiers
    const maxPts = Math.max(...sortedUsers.map(u => u.points));
    const minPts = Math.min(...sortedUsers.map(u => u.points));

    let sumTiers = 0;
    const userTiers = sortedUsers.map(user => {
      let tierIndex = 0;
      // Map user points to a tier linearly based on the min/max points.
      // maxPts gets tier 0 (cheapest), minPts gets tier K-1 (most expensive)
      if (maxPts > minPts && K > 1) {
        tierIndex = Math.round(((maxPts - user.points) / (maxPts - minPts)) * (K - 1));
      }
      sumTiers += tierIndex;
      return { user, tierIndex };
    });

    // BasePrice = targetAvg - (step * sumTiers) / N
    const exactBasePrice = targetAvg - (step * sumTiers) / N;
    // Round to nearest integer so we don't have prices with decimals
    const roundedBasePrice = Math.round(exactBasePrice);

    const results = userTiers.map(item => ({
      ...item.user,
      tierIndex: item.tierIndex,
      calculatedPrice: roundedBasePrice + item.tierIndex * step
    }));

    // Recalculate real average based on rounded prices
    const realSum = results.reduce((acc, curr) => acc + curr.calculatedPrice, 0);
    const realAverage = Number((realSum / N).toFixed(2));

    return { results, realAverage };
  };

  const { results: imwResults, realAverage } = calculateIMW();

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      const doc = new jsPDF();
      doc.setFont('helvetica');
      
      const pageW = 210;
      const margin = 16;
      
      // Header (Emerald 600 color)
      doc.setFillColor(5, 150, 105);
      doc.rect(0, 0, pageW, 4, 'F');
      
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text('RESUMEN PRECIOS IMW', margin, 18);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Media Real: ${realAverage}€ | Objetivo: ${targetAvg}€ | Salto: ${step}€ | Max Diff: ${maxDiff}€ | Participantes: ${imwResults.length}`, margin, 26);
      
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, 30, pageW - margin, 30);
      
      const tableColumn = ["#", "SOCIO", "PUNTOS", "PRECIO IMW"];
      const tableRows = imwResults.map((res, i) => [
        (i + 1).toString(),
        res.name || res.email,
        `${res.points} pts`,
        `${res.calculatedPrice} €`
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 9 },
        headStyles: { fillColor: [5, 150, 105], textColor: 255, halign: 'center' },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
        }
      });
      
      // ─── LOGOS AT BOTTOM ───
      const finalY = (doc as any).lastAutoTable.finalY || 35;
      const lastPage = (doc as any).internal.getNumberOfPages();
      doc.setPage(lastPage);

      const eurielecW = 45;
      const eurielecH = eurielecW / 4.31;
      const eestecW = 40;
      const eestecH = eestecW / 1.786;

      const logoGap = 25;
      const totalW = eurielecW + logoGap + eestecW;
      const logosX = (pageW - totalW) / 2;
      const maxH = Math.max(eurielecH, eestecH);
      let logosY = finalY + 12;

      if (logosY + maxH + 18 > 280) { doc.addPage(); logosY = 30; }

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin + 30, logosY - 4, pageW - margin - 30, logosY - 4);

      try {
        const eurielecLogo = await loadImage('/logo-eurielec.png');
        const eestecLogo = await loadImage('/logo-eestec.png');

        const eurielecY = logosY + (maxH - eurielecH) / 2;
        const eestecY = logosY + (maxH - eestecH) / 2;
        const eestecX = logosX + eurielecW + logoGap;

        doc.addImage(eurielecLogo, 'PNG', logosX, eurielecY, eurielecW, eurielecH);

        doc.setFillColor(220, 38, 38);
        const pad = 2.5;
        doc.roundedRect(eestecX - pad, eestecY - pad, eestecW + pad * 2, eestecH + pad * 2, 2, 2, 'F');
        doc.addImage(eestecLogo, 'PNG', eestecX, eestecY, eestecW, eestecH);
      } catch (err) {
        console.warn('No se pudieron cargar los logos para el PDF', err);
      }

      // ─── PAGE FOOTER ───
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(5, 150, 105);
        doc.rect(0, 293, pageW, 4, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(160, 160, 160);
        doc.text(`Eurielec & EESTEC LC Madrid  —  Página ${i} de ${pageCount}`, pageW / 2, 291, { align: 'center' });
      }
      
      doc.save(`Precios_IMW_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error al generar PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleActivateIMW = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres publicar y activar los pagos de IMW para ${imwResults.length} usuarios? Esto actualizará la base de datos con los precios calculados actuales.`)) return;
    
    try {
      setIsActivating(true);
      const { saveIMWPricesAction } = await import('@/app/actions/imw');
      
      const payload = imwResults.map(r => ({
        userId: r.id,
        calculatedPrice: r.calculatedPrice
      }));
      
      const res = await saveIMWPricesAction(payload);
      if (res.success) {
        alert('¡Pagos activados con éxito! Los usuarios ya pueden pagar desde su perfil personal.');
      } else {
        alert('Error al activar los pagos.');
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un error al comunicar con el servidor.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivateIMW = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres DESACTIVAR los pagos de IMW? Esto borrará los precios fijados y reiniciará todos los estados de pago.`)) return;
    
    try {
      setIsActivating(true);
      const { deactivateIMWPricesAction } = await import('@/app/actions/imw');
      
      const res = await deactivateIMWPricesAction();
      if (res.success) {
        alert('¡Pagos desactivados! La calculadora vuelve a estar en modo dinámico.');
      } else {
        alert('Error al desactivar los pagos.');
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un error al comunicar con el servidor.');
    } finally {
      setIsActivating(false);
    }
  };

  // Add member to CP Priority List
  const handleAddCPMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    if (!userId) return;
    const user = initialUsers.find(u => u.id === userId);
    if (user && !cpSelectedMembers.find(u => u.id === userId)) {
      const newMembers = [...cpSelectedMembers, user].sort((a, b) => b.points - a.points);
      setCpSelectedMembers(newMembers);
    }
    e.target.value = ''; // Reset select
  };

  const handleRemoveCPMember = (id: string) => {
    setCpSelectedMembers(prev => prev.filter(u => u.id !== id));
  };

  // Generate CP PDF Function
  const generateCPPDF = async (listToPrint: { eventName: string, comments: string, members: any[] }, isPreview = false) => {
    try {
      if (isPreview) setIsGenerating(true);
      const doc = new jsPDF();
      doc.setFont('helvetica');
      const pageW = 210;
      const margin = 16;
      
      // Header (Blue for CP)
      doc.setFillColor(37, 99, 235); // blue-600
      doc.rect(0, 0, pageW, 4, 'F');
      
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('PRIORITY LIST', margin, 18);
      
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text(`Event: ${listToPrint.eventName}`, margin, 28);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const splitAclaracion = doc.splitTextToSize("This Priority List has been designed based on an objective points system that establishes who has collaborated the most with the association and therefore has priority.", pageW - margin * 2);
      doc.text(splitAclaracion, margin, 35);
      
      let startY = 35 + (splitAclaracion.length * 5) + 5;
      
      if (listToPrint.comments) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        const splitComments = doc.splitTextToSize(`Comments: ${listToPrint.comments}`, pageW - margin * 2);
        doc.text(splitComments, margin, startY);
        startY += (splitComments.length * 5) + 5;
      }
      
      const tableColumn = ["#", "MEMBER", "POINTS", "ROLE"];
      const tableRows = listToPrint.members.map((res, i) => [
        (i + 1).toString(),
        res.name || res.email,
        `${res.points} pts`,
        res.role
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 10 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, halign: 'center' },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 30, halign: 'center' },
        }
      });
      
      // ─── LOGOS AT BOTTOM ───
      const finalY = (doc as any).lastAutoTable.finalY || startY;
      const lastPage = (doc as any).internal.getNumberOfPages();
      doc.setPage(lastPage);

      const eurielecW = 45;
      const eurielecH = eurielecW / 4.31;
      const eestecW = 40;
      const eestecH = eestecW / 1.786;

      const logoGap = 25;
      const totalW = eurielecW + logoGap + eestecW;
      const logosX = (pageW - totalW) / 2;
      const maxH = Math.max(eurielecH, eestecH);
      let logosY = finalY + 15;

      if (logosY + maxH + 18 > 280) { doc.addPage(); logosY = 30; }

      try {
        const eurielecLogo = await loadImage('/logo-eurielec.png');
        const eestecLogo = await loadImage('/logo-eestec.png');

        const eurielecY = logosY + (maxH - eurielecH) / 2;
        const eestecY = logosY + (maxH - eestecH) / 2;
        const eestecX = logosX + eurielecW + logoGap;

        doc.addImage(eurielecLogo, 'PNG', logosX, eurielecY, eurielecW, eurielecH);

        doc.setFillColor(220, 38, 38);
        const pad = 2.5;
        doc.roundedRect(eestecX - pad, eestecY - pad, eestecW + pad * 2, eestecH + pad * 2, 2, 2, 'F');
        doc.addImage(eestecLogo, 'PNG', eestecX, eestecY, eestecW, eestecH);
      } catch (err) {
        console.warn('No se pudieron cargar los logos para el PDF', err);
      }
      
      doc.save(`PriorityList_${listToPrint.eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error al generar PDF de Priority List');
    } finally {
      if (isPreview) setIsGenerating(false);
    }
  };

  const handleSavePriorityList = async () => {
    if (!cpEventName) return alert('Ponle título al evento.');
    if (cpSelectedMembers.length === 0) return alert('Añade al menos un miembro.');
    
    setCpIsSaving(true);
    try {
      const { savePriorityListAction } = await import('@/app/actions/priorityList');
      const res = await savePriorityListAction(cpEventName, cpComments, cpSelectedMembers);
      
      if (res.success && res.list) {
        setPriorityLists([res.list, ...priorityLists]);
        setCpEventName('');
        setCpComments('');
        setCpSelectedMembers([]);
        alert('Priority List guardada con éxito.');
      } else {
        alert('Error al guardar: ' + res.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    } finally {
      setCpIsSaving(false);
    }
  };

  const handleDeletePriorityList = async (id: string) => {
    if (!confirm('¿Seguro que quieres borrar esta lista del cajón?')) return;
    
    try {
      const { deletePriorityListAction } = await import('@/app/actions/priorityList');
      const res = await deletePriorityListAction(id);
      
      if (res.success) {
        setPriorityLists(prev => prev.filter(l => l.id !== id));
      } else {
        alert('Error al borrar.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    }
  };

  return (
    <div className="space-y-12">
      {/* Raking Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Leaderboard */}
        <div className="xl:col-span-2">
          <div className="bg-neutral-900 border border-white/5 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-black/40 flex items-center gap-4">
              <Award className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Ranking Global</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/60 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    <th className="px-6 py-4">Posición</th>
                    <th className="px-6 py-4">Socio</th>
                    <th className="px-6 py-4">Puntos</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {initialUsers.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <span className={`font-black text-lg ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img src={user.image} alt={user.name || 'User'} className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs font-black text-gray-500">
                              {(user.name || user.email).charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white text-sm">{user.name || 'Sin Nombre'}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm font-black">
                          {user.points} pts
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                          title="Gestionar Puntos"
                        >
                          <Settings2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {initialUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                        No hay usuarios en el ranking.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* IMW Calculator Settings */}
        <div className="xl:col-span-1">
          <div className="bg-neutral-900 border border-emerald-500/20 rounded-3xl p-8 sticky top-8 shadow-2xl shadow-emerald-500/5">
            <div className="flex items-start gap-3 mb-6">
              <Calculator className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter break-words min-w-0 w-full">Calculadora IMW</h2>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">Ajusta los parámetros para recalcular los precios personalizados del IMW en base a los puntos de cada socio.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Precio Medio Objetivo (€)</label>
                <input 
                  type="number" 
                  value={targetAvg} 
                  onChange={e => setTargetAvg(Number(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-bold text-xl focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Salto / Intervalo (€)</label>
                  <input 
                    type="number" 
                    value={step} 
                    onChange={e => setStep(Number(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Diferencia Máx. (€)</label>
                  <input 
                    type="number" 
                    value={maxDiff} 
                    onChange={e => setMaxDiff(Number(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Información de Cálculo</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Participantes: {initialUsers.length}</li>
                <li>• Nivel de Escalones: {Math.max(1, Math.floor(maxDiff / Math.max(1, step)) + 1)}</li>
                <li>• Media Resultante (Real): <span className="text-white font-bold">{realAverage}€</span></li>
                <li>• Precio Base Estimado: {imwResults.length > 0 ? `${imwResults[0].calculatedPrice}€` : 'N/A'}</li>
              </ul>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                onClick={generatePDF}
                disabled={isGenerating || isActivating}
                className="w-full py-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-500 border border-emerald-500/30 disabled:opacity-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> {isGenerating ? 'Generando...' : 'Descargar PDF'}
              </button>
              
              {isIMWActive ? (
                <button 
                  onClick={handleDeactivateIMW}
                  disabled={isGenerating || isActivating}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 disabled:opacity-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" /> {isActivating ? 'Cargando...' : 'Desactivar'}
                </button>
              ) : (
                <button 
                  onClick={handleActivateIMW}
                  disabled={isGenerating || isActivating}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" /> {isActivating ? 'Activando...' : 'Activar Pagos'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Results */}
      <div className="bg-neutral-900 border border-white/5 p-10 rounded-3xl">
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white">Resumen de Precios IMW</h2>
            <p className="text-gray-400 font-medium mt-1">
              Precio Medio Real: <strong>{realAverage}€</strong> • 
              Salto: <strong>{step}€</strong> • 
              Diferencia: <strong>{maxDiff}€</strong>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-500">{initialUsers.length}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Participantes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {imwResults.map((result, idx) => (
            <div key={result.id} className="flex flex-col p-4 rounded-2xl border border-white/10 bg-black/20 relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-black text-sm w-4">{idx + 1}.</span>
                  <div>
                    <p className="font-bold text-sm leading-tight text-white">{result.name || result.email}</p>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{result.points} pts</p>
                  </div>
                </div>
                <div className="text-xl font-black tracking-tight text-white">
                  {result.calculatedPrice}€
                </div>
              </div>

              {isIMWActive && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Estado</span>
                  <select 
                    value={result.imwPaymentStatus || 'PENDING'}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      if (!window.confirm('¿Cambiar estado de pago para ' + (result.name || result.email) + '?')) return;
                      const { updateIMWPaymentStatusAction } = await import('@/app/actions/imw');
                      await updateIMWPaymentStatusAction(result.id, newStatus);
                    }}
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border focus:outline-none appearance-none cursor-pointer ${
                      result.imwPaymentStatus === 'PAID_CARD' || result.imwPaymentStatus === 'PAID_CASH' || result.imwPaymentStatus === 'PAID'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : result.imwPaymentStatus === 'PENDING_CASH'
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="PENDING_CASH">En Efectivo (Pendiente)</option>
                    <option value="PAID_CASH">Pagado (Efectivo)</option>
                    <option value="PAID_CARD">Pagado (Tarjeta)</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Priority List (CP) Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-8 border-t border-white/5">
        
        {/* CP Generator Form */}
        <div className="xl:col-span-2">
          <div className="bg-neutral-900 border border-blue-500/20 rounded-3xl p-8 shadow-2xl shadow-blue-500/5">
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Priority List CP</h2>
                <p className="text-sm text-gray-400">Genera la lista priorizada para eventos en base al ranking.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Evento</label>
                <input 
                  type="text" 
                  value={cpEventName}
                  onChange={e => setCpEventName(e.target.value)}
                  placeholder="Ej: IMW Madrid 2026..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Añadir Miembro</label>
                <select 
                  onChange={handleAddCPMember}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none"
                  value=""
                >
                  <option value="" disabled>Selecciona un socio...</option>
                  {initialUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name || u.email} ({u.points} pts)</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Comentarios (Opcional)</label>
              <textarea 
                value={cpComments}
                onChange={e => setCpComments(e.target.value)}
                rows={2}
                placeholder="Aclaraciones para la junta de LC Madrid..."
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none resize-none" 
              />
            </div>

            {/* Reorderable List */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 min-h-[200px]">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 px-2">Orden de Prioridad (Arrastra para reordenar)</h3>
              
              {cpSelectedMembers.length === 0 ? (
                <div className="text-center py-10 text-gray-600 font-bold uppercase tracking-widest text-xs">
                  Añade miembros para generar la lista
                </div>
              ) : (
                <Reorder.Group axis="y" values={cpSelectedMembers} onReorder={setCpSelectedMembers} className="space-y-2">
                  {cpSelectedMembers.map((member, idx) => (
                    <Reorder.Item key={member.id} value={member} className="flex items-center gap-4 bg-neutral-800 border border-white/10 p-3 rounded-xl cursor-grab active:cursor-grabbing hover:bg-neutral-700 transition-colors">
                      <MoveVertical className="w-5 h-5 text-gray-500" />
                      <span className="font-black text-blue-500 w-6">#{idx + 1}</span>
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">{member.name || member.email}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{member.role}</p>
                      </div>
                      <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-xs font-black">
                        {member.points} pts
                      </div>
                      <button onClick={() => handleRemoveCPMember(member.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => generateCPPDF({ eventName: cpEventName || 'Borrador', comments: cpComments, members: cpSelectedMembers }, true)}
                disabled={isGenerating || cpSelectedMembers.length === 0}
                className="flex-1 py-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 border border-blue-500/30 disabled:opacity-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> {isGenerating ? 'Generando...' : 'Previsualizar PDF'}
              </button>
              <button 
                onClick={handleSavePriorityList}
                disabled={cpIsSaving || cpSelectedMembers.length === 0 || !cpEventName}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> {cpIsSaving ? 'Guardando...' : 'Guardar en Cajón'}
              </button>
            </div>
          </div>
        </div>

        {/* The Drawer (Cajón) */}
        <div className="xl:col-span-1">
          <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 h-full shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Cajón de Listas</h3>
              <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-md font-bold">{priorityLists.length}</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {priorityLists.length === 0 ? (
                <p className="text-gray-600 text-xs text-center py-6 font-bold uppercase tracking-widest">No hay listas guardadas.</p>
              ) : (
                priorityLists.map((list) => (
                  <div key={list.id} className="bg-black/40 border border-white/5 p-4 rounded-xl group hover:border-blue-500/30 transition-colors">
                    <h4 className="font-bold text-white text-sm mb-1 line-clamp-1">{list.eventName}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                      {new Date(list.createdAt).toLocaleDateString()} • {list.members?.length || 0} Miembros
                    </p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => generateCPPDF(list)}
                        className="flex-1 py-2 bg-white/5 hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                      <button 
                        onClick={() => handleDeletePriorityList(list.id)}
                        className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Modal Overlay */}
      {selectedUser && (
        <AdjustPointsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}
