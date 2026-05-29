import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Belt, Technique } from '../models/judo.model';

// Tipos auxiliares para extensões do jsPDF
interface JsPDFWithAutoTable extends jsPDF {
    lastAutoTable: { finalY: number };
}
interface JsPDFWithPages extends jsPDF {
    internal: jsPDF['internal'] & { getNumberOfPages(): number };
}

// Brand colors
const COLOR_NAVY: [number, number, number] = [16, 42, 67];   // #102a43
const COLOR_SKY: [number, number, number] = [14, 165, 233];  // #0ea5e9
const COLOR_LIGHT: [number, number, number] = [248, 250, 252]; // slate-50
const COLOR_GRAY: [number, number, number] = [100, 116, 139];  // slate-500
const COLOR_BORDER: [number, number, number] = [226, 232, 240]; // slate-200

@Injectable({ providedIn: 'root' })
export class ExportService {

    // ── Excel ──────────────────────────────────────────────────────────────────

    public exportToExcel(belt: Belt): void {
        if (!belt.techniques.length) return;

        const wb = XLSX.utils.book_new();
        const COLS = ['Nome', 'Tradução', 'Categoria', 'Descrição', 'Execução', 'Aplicação', 'URL Demo'];

        // Group techniques by category
        const groups = this.groupByCategory(belt.techniques);

        // Build rows: category header + data rows per group
        const aoa: unknown[][] = [COLS];
        for (const [category, techs] of groups) {
            // Category separator row (merged visually via empty cols)
            aoa.push([category, '', '', '', '', '', '']);
            for (const tech of techs) {
                aoa.push([
                    tech.name,
                    tech.translation,
                    tech.category,
                    tech.description,
                    tech.execution,
                    tech.application,
                    tech.demoUrl,
                ]);
            }
        }

        const ws = XLSX.utils.aoa_to_sheet(aoa);

        // Column widths
        ws['!cols'] = [
            { wch: 28 }, // Nome
            { wch: 28 }, // Tradução
            { wch: 22 }, // Categoria
            { wch: 45 }, // Descrição
            { wch: 45 }, // Execução
            { wch: 35 }, // Aplicação
            { wch: 35 }, // URL Demo
        ];

        // Style header row (row 0)
        for (let c = 0; c < COLS.length; c++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c });
            if (!ws[cellRef]) continue;
            ws[cellRef].s = {
                font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
                fill: { fgColor: { rgb: '102A43' } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: { bottom: { style: 'thin', color: { rgb: '0EA5E9' } } },
            };
        }

        // Style category separator rows
        let rowIdx = 1;
        for (const [, techs] of groups) {
            // Category row
            const cellRef = XLSX.utils.encode_cell({ r: rowIdx, c: 0 });
            if (ws[cellRef]) {
                ws[cellRef].s = {
                    font: { bold: true, color: { rgb: '0369A1' }, sz: 10, italic: true },
                    fill: { fgColor: { rgb: 'F0F9FF' } },
                    alignment: { horizontal: 'left', vertical: 'center' },
                };
            }
            rowIdx += 1 + techs.length;
        }

        XLSX.utils.book_append_sheet(wb, ws, belt.name.substring(0, 31));
        XLSX.writeFile(wb, `${belt.name.replace(/\s+/g, '_')}_tecnicas_${this.dateStamp()}.xlsx`);
    }

    // ── PDF ────────────────────────────────────────────────────────────────────

    public exportToPDF(belt: Belt): void {
        if (!belt.techniques.length) return;

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const margin = 14;

        // ── Header bar ──
        doc.setFillColor(...COLOR_NAVY);
        doc.rect(0, 0, pageW, 18, 'F');

        // App name
        doc.setTextColor(14, 165, 233);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Judô Master', margin, 12);

        // Belt name on the right
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(belt.name, pageW - margin, 12, { align: 'right' });

        // ── Accent line under header ──
        doc.setFillColor(...COLOR_SKY);
        doc.rect(0, 18, pageW, 1, 'F');

        // ── Belt meta ──
        let y = 26;
        doc.setTextColor(...COLOR_GRAY);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.text(`Faixa Etária: ${belt.ageGroup}   •   Pré-requisitos: ${belt.prerequisites}`, margin, y);

        y += 6;

        // ── Tables per category ──
        const groups = this.groupByCategory(belt.techniques);

        for (const [category, techs] of groups) {
            // Category label
            if (y > pageH - 30) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLOR_NAVY);
            doc.text(category.toUpperCase(), margin, y);
            y += 2;

            autoTable(doc, {
                startY: y,
                head: [['Nome', 'Tradução', 'Descrição', 'Execução']],
                body: techs.map(t => [t.name, t.translation, t.description, t.execution]),
                theme: 'grid',
                margin: { left: margin, right: margin },
                headStyles: {
                    fillColor: COLOR_NAVY,
                    textColor: [255, 255, 255],
                    fontSize: 8,
                    fontStyle: 'bold',
                    cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
                },
                bodyStyles: {
                    fontSize: 7.5,
                    textColor: [30, 41, 59],
                    cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
                },
                alternateRowStyles: { fillColor: COLOR_LIGHT },
                columnStyles: {
                    0: { cellWidth: 40 },
                    1: { cellWidth: 38 },
                    2: { cellWidth: 80 },
                    3: { cellWidth: 80 },
                },
                tableLineColor: COLOR_BORDER,
                tableLineWidth: 0.1,
                didDrawCell: (data) => {
                    // Sky accent left border on header row
                    if (data.row.section === 'head' && data.column.index === 0) {
                        doc.setFillColor(...COLOR_SKY);
                        doc.rect(data.cell.x, data.cell.y, 1.5, data.cell.height, 'F');
                    }
                },
            });

            y = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 8;
        }

        // ── Footer on every page ──
        const totalPages = (doc as JsPDFWithPages).internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFillColor(...COLOR_NAVY);
            doc.rect(0, pageH - 8, pageW, 8, 'F');
            doc.setTextColor(...COLOR_GRAY);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.text(
                `Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
                margin, pageH - 3
            );
            doc.text(`Página ${i} de ${totalPages}`, pageW - margin, pageH - 3, { align: 'right' });
        }

        doc.save(`${belt.name.replace(/\s+/g, '_')}_tecnicas_${this.dateStamp()}.pdf`);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private groupByCategory(techniques: Technique[]): Map<string, Technique[]> {
        const map = new Map<string, Technique[]>();
        for (const tech of techniques) {
            const list = map.get(tech.category) ?? [];
            list.push(tech);
            map.set(tech.category, list);
        }
        return map;
    }

    private dateStamp(): string {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    }
}
