'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { getEventSummaryDataAction } from '@/app/actions/events';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function DownloadEventSummaryBtn({ eventId, iconOnly = false }: { eventId: string, iconOnly?: boolean }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

  // Helper: draw a labeled stat pill
  const drawStat = (doc: jsPDF, x: number, y: number, label: string, value: string, w: number) => {
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(x, y, w, 16, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(x, y, w, 16, 2, 2, 'S');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 140);
    doc.text(label.toUpperCase(), x + w / 2, y + 5, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(value, x + w / 2, y + 12, { align: 'center' });
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const event = await getEventSummaryDataAction(eventId);
      if (!event) { alert('No se pudo obtener la información del evento.'); return; }

      const doc = new jsPDF();
      doc.setFont('helvetica');
      const pageW = 210;
      const margin = 16;
      const contentW = pageW - margin * 2;

      // ─── HEADER ───
      // Red accent bar at top
      doc.setFillColor(220, 38, 38);
      doc.rect(0, 0, pageW, 4, 'F');

      // Title
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('FICHA RESUMEN', margin, 18);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      doc.text('DEL EVENTO', margin + doc.getTextWidth('FICHA RESUMEN '), 18);

      // Thin red line under title
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.8);
      doc.line(margin, 21, pageW - margin, 21);

      // Event name + date
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(event.title.toUpperCase(), margin, 28);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      const dateStr = new Date(event.date).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      doc.text(dateStr.charAt(0).toUpperCase() + dateStr.slice(1), margin, 33);

      // ─── EVENT INFO CARD ───
      let currentY = 39;

      // Location & Price row
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(margin, currentY, contentW, 14, 2, 2, 'F');
      doc.setDrawColor(230, 230, 230);
      doc.roundedRect(margin, currentY, contentW, 14, 2, 2, 'S');

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(140, 140, 140);
      doc.text('UBICACIÓN', margin + 4, currentY + 5);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      const locText = doc.splitTextToSize(event.location || 'No especificada', 90);
      doc.text(locText[0], margin + 4, currentY + 10.5);

      // Vertical separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin + contentW * 0.6, currentY + 2, margin + contentW * 0.6, currentY + 12);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(140, 140, 140);
      doc.text('ENTRADA', margin + contentW * 0.6 + 6, currentY + 5);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text(event.price && event.price > 0 ? `${event.price.toFixed(2)}€` : 'GRATIS', margin + contentW * 0.6 + 6, currentY + 11);

      currentY += 18;

      // Description
      if (event.description) {
        const descLines = doc.splitTextToSize(event.description, contentW - 8);
        const descH = 8 + descLines.length * 3.8;
        doc.setFillColor(255, 252, 252);
        doc.roundedRect(margin, currentY, contentW, descH, 2, 2, 'F');
        // Left red accent bar on description
        doc.setFillColor(220, 38, 38);
        doc.rect(margin, currentY, 2.5, descH, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80, 80, 80);
        doc.text(descLines, margin + 7, currentY + 5.5);
        currentY += descH + 4;
      }

      // ─── STATISTICS ───
      // Section label
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('ESTADÍSTICAS GLOBALES', margin, currentY + 3);
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY + 5, pageW - margin, currentY + 5);
      currentY += 9;

      // Compute stats
      const totalAttendees = event.attendances.length;
      const totalCars = event.attendances.filter(a => a.user.hasCar).length;
      const allergiesList = event.attendances.map(a => a.user.allergies).filter(a => a && a.trim().length > 0) as string[];
      const totalWithAllergies = allergiesList.length;
      const uniqueAllergies = Array.from(new Set(allergiesList.map(a => a.toLowerCase().trim()))).join(', ');

      const dietCounts = event.attendances.reduce((acc, att) => {
        const diet = att.user.dietary;
        if (diet && diet.trim() !== '' && diet.toLowerCase() !== 'ninguna' && diet.toLowerCase() !== 'no') {
          const nd = diet.charAt(0).toUpperCase() + diet.slice(1).toLowerCase();
          acc[nd] = (acc[nd] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      const totalWithDiets = Object.values(dietCounts).reduce((a, b) => a + b, 0);
      const dietSummary = Object.entries(dietCounts).map(([d, c]) => `${d}: ${c}`).join(', ');

      const tShirtCounts = event.attendances.reduce((acc, att) => {
        const s = att.user.tShirtSize;
        if (s && s.trim() !== '') acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const tShirtSummary = Object.entries(tShirtCounts).map(([s, c]) => `${s}: ${c}`).join('  |  ');

      const drinkCounts = event.attendances.reduce((acc, att) => {
        const d = att.user.alcohol;
        if (d && d.trim() !== '') acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const drinkSummary = Object.entries(drinkCounts).map(([d, c]) => `${d}: ${c}`).join('  |  ');

      // Row 1: Key numbers in pills
      const pillW = (contentW - 6) / 3;
      drawStat(doc, margin, currentY, 'Asistentes', `${totalAttendees}`, pillW);
      drawStat(doc, margin + pillW + 3, currentY, 'Coches Disponibles', `${totalCars}`, pillW);

      let financialText = 'Gratis';
      if (event.price && event.price > 0) {
        const paidCount = event.attendances.filter(a => a.paymentStatus === 'PAID').length;
        financialText = `${(paidCount * event.price).toFixed(0)}€ / ${(totalAttendees * event.price).toFixed(0)}€`;
      }
      drawStat(doc, margin + (pillW + 3) * 2, currentY, 'Recaudado / Esperado', financialText, pillW);
      currentY += 20;

      // Row 2: Detail lines
      const detailLineH = 5;
      const drawDetailLine = (label: string, value: string, y: number) => {
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(140, 140, 140);
        doc.text(label, margin + 2, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        const truncVal = doc.splitTextToSize(value, contentW - 45)[0];
        doc.text(truncVal || '-', margin + 40, y);
      };

      drawDetailLine('Dietas Especiales', totalWithDiets > 0 ? `${totalWithDiets} (${dietSummary})` : '-', currentY);
      currentY += detailLineH;
      drawDetailLine('Alergias', totalWithAllergies > 0 ? `${totalWithAllergies} (${uniqueAllergies})` : '-', currentY);
      currentY += detailLineH;
      drawDetailLine('Bebidas', drinkSummary || '-', currentY);
      currentY += detailLineH;
      drawDetailLine('Tallas Camiseta', tShirtSummary || '-', currentY);
      currentY += detailLineH + 4;

      // Thin separator before table
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.line(margin, currentY, pageW - margin, currentY);
      currentY += 4;

      // ─── TABLE ───
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('LISTADO DE ASISTENTES', margin, currentY + 2);
      currentY += 6;

      const tableColumn = ["NOMBRE", "CONTACTO", "PAGO", "DIETA Y ALERGIAS", "COCHE", "EXTRAS"];
      const tableRows: string[][] = [];

      event.attendances.forEach(att => {
        const user = att.user;
        const paymentInfo = att.paymentMethod
          ? `${att.paymentMethod === 'CARD' ? 'Tarjeta' : 'Efectivo'}\n(${att.paymentStatus === 'PAID' ? 'Pagado' : 'Pendiente'})`
          : 'Gratis';
        let dietInfo = '';
        if (user.dietary && user.dietary.toLowerCase() !== 'ninguna' && user.dietary.toLowerCase() !== 'no') dietInfo += `${user.dietary}\n`;
        if (user.allergies) dietInfo += `Alerg: ${user.allergies}`;
        if (!dietInfo) dietInfo = '-';
        let othersInfo = '';
        if (user.tShirtSize) othersInfo += `Talla camiseta: ${user.tShirtSize}\n`;
        if (user.alcohol) othersInfo += user.alcohol;
        tableRows.push([
          user.name || 'Desconocido',
          user.email || '',
          paymentInfo,
          dietInfo,
          user.hasCar ? 'SÍ' : 'NO',
          othersInfo || '-'
        ]);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: currentY,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 7.5,
          cellPadding: 3,
          lineColor: [230, 230, 230],
          lineWidth: 0.15,
          textColor: [40, 40, 40],
          valign: 'middle'
        },
        headStyles: {
          fillColor: [220, 38, 38],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 7,
          cellPadding: 4
        },
        columnStyles: {
          0: { cellWidth: 32, fontStyle: 'bold' },
          1: { cellWidth: 42, textColor: [100, 100, 100], fontSize: 7 },
          2: { cellWidth: 22, halign: 'center' },
          3: { cellWidth: 38 },
          4: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
          5: { cellWidth: 'auto' }
        },
        alternateRowStyles: { fillColor: [252, 252, 252] },
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 2) {
            const raw = data.cell.raw;
            if (typeof raw === 'string') {
              if (raw.includes('Pendiente')) {
                data.cell.styles.fillColor = [255, 235, 235];
                data.cell.styles.textColor = [180, 0, 0];
              } else if (raw.includes('Pagado')) {
                data.cell.styles.fillColor = [235, 255, 235];
                data.cell.styles.textColor = [0, 120, 0];
              }
            }
          }
        }
      });

      // ─── LOGOS AT BOTTOM ───
      const finalY = (doc as any).lastAutoTable.finalY || currentY;
      const lastPage = (doc as any).internal.getNumberOfPages();
      doc.setPage(lastPage);

      // Eurielec: 448x104 → ratio 4.31:1
      const eurielecW = 45;
      const eurielecH = eurielecW / 4.31;
      // EESTEC: 600x336 → ratio 1.786:1
      const eestecW = 40;
      const eestecH = eestecW / 1.786;

      const logoGap = 25;
      const totalW = eurielecW + logoGap + eestecW;
      const logosX = (pageW - totalW) / 2;
      const maxH = Math.max(eurielecH, eestecH);
      let logosY = finalY + 12;

      if (logosY + maxH + 18 > 280) { doc.addPage(); logosY = 30; }

      // Thin line above logos
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

        // EESTEC logo is white-on-transparent → red background with rounded corners
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
        // Red line at bottom
        doc.setFillColor(220, 38, 38);
        doc.rect(0, 293, pageW, 4, 'F');
        // Page number
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(160, 160, 160);
        doc.text(`Eurielec & EESTEC LC Madrid  —  Página ${i} de ${pageCount}`, pageW / 2, 291, { align: 'center' });
      }

      doc.save(`Resumen_${event.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Ocurrió un error al generar el PDF.');
    } finally {
      setIsGenerating(false);
    }
  }

  if (iconOnly) {
    return (
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={`p-3 text-gray-600 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center justify-center cursor-pointer border border-transparent hover:border-white/10 ${isGenerating ? 'opacity-50 animate-pulse' : ''}`}
        title="Descargar PDF Asistentes"
      >
        <Download className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      type="button"
      className="flex text-[10px] items-center gap-3 px-8 py-3.5 bg-white/[0.02] text-gray-600 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5 font-black uppercase tracking-widest disabled:opacity-50"
      title="Descargar plantilla de asistencia"
    >
      <Download className="w-4 h-4" />
      {isGenerating ? 'Generando...' : 'Descargar Ficha PDF'}
    </button>
  );
}
