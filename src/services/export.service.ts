import { Injectable } from '@angular/core';

import { APP_NAME } from '../constants/app.constants';
import { Belt, Technique } from '../models/judo.model';
import { dateStamp, slugify } from '../utils/text.util';

type Rgb = [number, number, number];

const COLOR_NAVY: Rgb = [16, 42, 67]; // #102a43
const COLOR_SKY: Rgb = [14, 165, 233]; // #0ea5e9
const COLOR_LIGHT: Rgb = [248, 250, 252]; // slate-50
const COLOR_MUTED: Rgb = [100, 116, 139]; // slate-500
const COLOR_FOOTER_TEXT: Rgb = [203, 213, 225]; // slate-300, readable on navy
const COLOR_BORDER: Rgb = [226, 232, 240]; // slate-200
const COLOR_BODY_TEXT: Rgb = [30, 41, 59]; // slate-800

const SHEET_COLUMNS = [
  'Categoria',
  'Nome',
  'Tradução',
  'Descrição',
  'Execução',
  'Aplicação',
  'Vídeo',
];

/**
 * Excel and PDF downloads of a belt's techniques. The libraries are large and
 * only needed here, so they load on the first export instead of with the app.
 */
@Injectable({ providedIn: 'root' })
export class ExportService {
  public async exportToExcel(belt: Belt): Promise<void> {
    const XLSX = await import('xlsx');
    const rows = belt.techniques.map(t => [
      t.category,
      t.name,
      t.translation,
      t.description,
      t.execution,
      t.application,
      t.demoUrl,
    ]);
    const sheet = XLSX.utils.aoa_to_sheet([SHEET_COLUMNS, ...rows]);
    sheet['!cols'] = [28, 28, 28, 45, 45, 35, 40].map(wch => ({ wch }));
    sheet['!autofilter'] = {
      ref: XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: rows.length, c: SHEET_COLUMNS.length - 1 },
      }),
    };
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, sheetName(belt.name));
    XLSX.writeFile(book, `${this.fileName(belt)}.xlsx`);
  }

  public async exportToPdf(belt: Belt): Promise<void> {
    const [{ jsPDF }, { autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ]);
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    // Header bar with the app name and the belt
    doc.setFillColor(...COLOR_NAVY);
    doc.rect(0, 0, pageWidth, 18, 'F');
    doc.setFillColor(...COLOR_SKY);
    doc.rect(0, 18, pageWidth, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...COLOR_SKY);
    doc.text(APP_NAME, margin, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(belt.name, pageWidth - margin, 12, { align: 'right' });

    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(
      `Faixa etária: ${belt.ageGroup}   •   Pré-requisitos: ${belt.prerequisites}`,
      margin,
      26,
      {
        maxWidth: pageWidth - 2 * margin,
      }
    );

    let y = 34;
    for (const [category, techniques] of groupByCategory(belt.techniques)) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...COLOR_NAVY);
      doc.text(category.toUpperCase(), margin, y);

      autoTable(doc, {
        startY: y + 2,
        head: [['Nome', 'Tradução', 'Descrição', 'Execução']],
        body: techniques.map(t => [t.name, t.translation, t.description, t.execution]),
        theme: 'grid',
        // Leave room for the footer bar on every page.
        margin: { left: margin, right: margin, bottom: 14 },
        headStyles: {
          fillColor: COLOR_NAVY,
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
        },
        bodyStyles: { fontSize: 7.5, textColor: COLOR_BODY_TEXT },
        styles: {
          cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
          lineColor: COLOR_BORDER,
          lineWidth: 0.1,
        },
        alternateRowStyles: { fillColor: COLOR_LIGHT },
        columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 45 } },
      });
      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
    }

    const generatedOn = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const totalPages = doc.getNumberOfPages();
    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);
      doc.setFillColor(...COLOR_NAVY);
      doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...COLOR_FOOTER_TEXT);
      doc.text(`Gerado em ${generatedOn}`, margin, pageHeight - 3);
      doc.text(`Página ${page} de ${totalPages}`, pageWidth - margin, pageHeight - 3, {
        align: 'right',
      });
    }

    doc.save(`${this.fileName(belt)}.pdf`);
  }

  private fileName(belt: Belt): string {
    return `judo-master-${slugify(belt.name)}-${dateStamp()}`;
  }
}

function groupByCategory(techniques: readonly Technique[]): Map<string, Technique[]> {
  const groups = new Map<string, Technique[]>();
  for (const technique of techniques) {
    const group = groups.get(technique.category);
    if (group) group.push(technique);
    else groups.set(technique.category, [technique]);
  }
  return groups;
}

/** Excel limits sheet names to 31 characters and forbids : \ / ? * [ ] */
function sheetName(name: string): string {
  return name.replaceAll(/[:\\/?*[\]]/g, ' ').slice(0, 31);
}
